'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import {
  Shield,
  Trophy,
  Plus,
  Pencil,
  Trash2,
  Search,
  ArrowLeft,
  X,
  Save,
  AlertTriangle,
  MapPin,
  Star,
} from 'lucide-react'
import { Skeleton } from '@/components/Skeleton'

interface Tournament {
  id: string
  name: string
  sport: string
  organization_id: string | null
  age_groups: string[] | null
  start_date: string | null
  end_date: string | null
  entry_fee: number | null
  website: string | null
  description: string | null
}

interface Organization {
  id: string
  name: string
}

interface Venue {
  id: string
  name: string
  city: string
  state: string
}

interface TournamentVenue {
  id: string
  tournament_id: string
  venue_id: string
  is_primary: boolean | null
}

interface FormState {
  name: string
  sport: string
  organization_id: string
  age_groups: string
  start_date: string
  end_date: string
  entry_fee: string
  website: string
  description: string
}

const EMPTY_FORM: FormState = {
  name: '',
  sport: 'baseball',
  organization_id: '',
  age_groups: '',
  start_date: '',
  end_date: '',
  entry_fee: '',
  website: '',
  description: '',
}

const SPORTS = [
  'baseball',
  'softball',
  'soccer',
  'basketball',
  'lacrosse',
  'hockey',
  'volleyball',
  'football',
]

export default function AdminTournamentsPage() {
  const [loading, setLoading] = useState(true)
  const [allowed, setAllowed] = useState(false)
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [orgs, setOrgs] = useState<Organization[]>([])
  const [venues, setVenues] = useState<Venue[]>([])
  const [tvs, setTvs] = useState<TournamentVenue[]>([])
  const [query, setQuery] = useState('')

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [selectedVenues, setSelectedVenues] = useState<
    Record<string, { selected: boolean; primary: boolean }>
  >({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Tournament | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/signin?redirect=/admin/tournaments'
        return
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .maybeSingle()
      if (!profile?.is_admin) {
        setAllowed(false)
        setLoading(false)
        return
      }
      setAllowed(true)
      await refresh()
      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function refresh() {
    const supabase = createClient()
    const [t, o, v, tv] = await Promise.all([
      supabase
        .from('tournaments')
        .select(
          'id, name, sport, organization_id, age_groups, start_date, end_date, entry_fee, website, description'
        )
        .order('start_date', { ascending: false, nullsFirst: false }),
      supabase.from('organizations').select('id, name').order('name'),
      supabase
        .from('venues')
        .select('id, name, city, state')
        .order('name'),
      supabase
        .from('tournament_venues')
        .select('id, tournament_id, venue_id, is_primary'),
    ])
    setTournaments((t.data as Tournament[]) || [])
    setOrgs((o.data as Organization[]) || [])
    setVenues((v.data as Venue[]) || [])
    setTvs((tv.data as TournamentVenue[]) || [])
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return tournaments
    return tournaments.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.sport.toLowerCase().includes(q)
    )
  }, [tournaments, query])

  function openAdd() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setSelectedVenues({})
    setError(null)
    setModalOpen(true)
  }

  function openEdit(t: Tournament) {
    setEditingId(t.id)
    setForm({
      name: t.name,
      sport: t.sport,
      organization_id: t.organization_id || '',
      age_groups: (t.age_groups || []).join(', '),
      start_date: t.start_date || '',
      end_date: t.end_date || '',
      entry_fee: t.entry_fee != null ? String(t.entry_fee) : '',
      website: t.website || '',
      description: t.description || '',
    })
    const links = tvs.filter((x) => x.tournament_id === t.id)
    const sel: Record<string, { selected: boolean; primary: boolean }> = {}
    links.forEach((l) => {
      sel[l.venue_id] = { selected: true, primary: !!l.is_primary }
    })
    setSelectedVenues(sel)
    setError(null)
    setModalOpen(true)
  }

  function closeModal() {
    if (saving) return
    setModalOpen(false)
  }

  async function handleSave() {
    setError(null)
    if (!form.name.trim()) {
      setError('Name is required.')
      return
    }
    if (!form.sport.trim()) {
      setError('Sport is required.')
      return
    }
    setSaving(true)

    const supabase = createClient()

    const payload = {
      name: form.name.trim(),
      sport: form.sport.trim().toLowerCase(),
      organization_id: form.organization_id || null,
      age_groups: form.age_groups
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      entry_fee: form.entry_fee ? Number(form.entry_fee) : null,
      website: form.website.trim() || null,
      description: form.description.trim() || null,
    }

    let tournamentId = editingId
    if (editingId) {
      const { error: uerr } = await supabase
        .from('tournaments')
        .update(payload)
        .eq('id', editingId)
      if (uerr) {
        setError(uerr.message)
        setSaving(false)
        return
      }
    } else {
      const { data, error: ierr } = await supabase
        .from('tournaments')
        .insert(payload)
        .select('id')
        .single()
      if (ierr || !data) {
        setError(ierr?.message || 'Failed to create tournament.')
        setSaving(false)
        return
      }
      tournamentId = data.id
    }

    // Sync venue assignments
    if (tournamentId) {
      const existing = tvs.filter((x) => x.tournament_id === tournamentId)
      const existingByVenue: Record<string, TournamentVenue> = {}
      existing.forEach((e) => (existingByVenue[e.venue_id] = e))
      const desired = Object.entries(selectedVenues)
        .filter(([, v]) => v.selected)
        .map(([venue_id, v]) => ({ venue_id, primary: v.primary }))
      const desiredByVenue: Record<string, boolean> = {}
      desired.forEach((d) => (desiredByVenue[d.venue_id] = d.primary))

      // Deletes
      const toDelete = existing
        .filter((e) => !(e.venue_id in desiredByVenue))
        .map((e) => e.id)
      if (toDelete.length > 0) {
        await supabase.from('tournament_venues').delete().in('id', toDelete)
      }
      // Inserts
      const toInsert = desired
        .filter((d) => !(d.venue_id in existingByVenue))
        .map((d) => ({
          tournament_id: tournamentId,
          venue_id: d.venue_id,
          is_primary: d.primary,
        }))
      if (toInsert.length > 0) {
        await supabase.from('tournament_venues').insert(toInsert)
      }
      // Updates (is_primary changed)
      const toUpdate = desired.filter(
        (d) =>
          existingByVenue[d.venue_id] &&
          !!existingByVenue[d.venue_id].is_primary !== d.primary
      )
      for (const u of toUpdate) {
        await supabase
          .from('tournament_venues')
          .update({ is_primary: u.primary })
          .eq('id', existingByVenue[u.venue_id].id)
      }
    }

    await refresh()
    setSaving(false)
    setModalOpen(false)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    const supabase = createClient()
    await supabase
      .from('tournament_venues')
      .delete()
      .eq('tournament_id', deleteTarget.id)
    const { error: derr } = await supabase
      .from('tournaments')
      .delete()
      .eq('id', deleteTarget.id)
    if (derr) {
      alert('Failed to delete: ' + derr.message)
    }
    setDeleting(false)
    setDeleteTarget(null)
    await refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f5f8fa' }}>
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-4">
          <Skeleton width={240} height={32} />
          <Skeleton width={140} height={18} />
          <div className="space-y-3 mt-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height={68} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!allowed) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f5f8fa' }}>
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: '#fef3c7' }}
          >
            <Shield size={28} style={{ color: '#f59e0b' }} />
          </div>
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: '#0f1f2e' }}
          >
            Admin access only
          </h1>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white mt-4"
            style={{
              background:
                'linear-gradient(135deg, #2D6A4F 0%, #3a8c64 100%)',
            }}
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f8fa' }}>
      <div
        style={{
          height: '4px',
          background:
            'linear-gradient(to right, #2D6A4F, #f59e0b, #2D6A4F)',
        }}
      />
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <a
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-6"
          style={{ color: '#5a7080' }}
        >
          <ArrowLeft size={14} /> Admin
        </a>

        <div
          className="flex items-center justify-between gap-3 mb-6 flex-wrap"
          style={{ borderLeft: '3px solid #2D6A4F', paddingLeft: '12px' }}
        >
          <div>
            <div className="flex items-center gap-2">
              <Trophy size={18} style={{ color: '#2D6A4F' }} />
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: '#2D6A4F' }}
              >
                Admin · Tournaments
              </p>
            </div>
            <h1
              className="text-3xl font-extrabold mt-1"
              style={{ color: '#0f1f2e' }}
            >
              Manage Tournaments
            </h1>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white"
            style={{
              background:
                'linear-gradient(135deg, #2D6A4F 0%, #3a8c64 100%)',
            }}
          >
            <Plus size={16} /> Add Tournament
          </button>
        </div>

        {/* Search */}
        <div
          className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 mb-5 border"
          style={{ borderColor: '#dde8ee' }}
        >
          <Search size={16} style={{ color: '#8fa3b2' }} />
          <input
            type="text"
            placeholder="Search by name or sport…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 outline-none text-sm"
            style={{ color: '#0f1f2e' }}
          />
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div
            className="bg-white rounded-2xl p-10 text-center border"
            style={{ borderColor: '#dde8ee' }}
          >
            <p className="text-sm" style={{ color: '#5a7080' }}>
              No tournaments yet.
            </p>
          </div>
        ) : (
          <div
            className="bg-white rounded-2xl border overflow-hidden"
            style={{ borderColor: '#dde8ee' }}
          >
            <div
              className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 text-xs font-bold uppercase tracking-widest"
              style={{ color: '#8fa3b2', borderBottom: '1px solid #dde8ee' }}
            >
              <div className="col-span-5">Name</div>
              <div className="col-span-2">Sport</div>
              <div className="col-span-2">Dates</div>
              <div className="col-span-2">Venues</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            {filtered.map((t) => {
              const venueCount = tvs.filter(
                (x) => x.tournament_id === t.id
              ).length
              return (
                <div
                  key={t.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 px-5 py-4 items-center"
                  style={{ borderBottom: '1px solid #edf2f5' }}
                >
                  <div className="md:col-span-5">
                    <p
                      className="font-bold text-sm"
                      style={{ color: '#0f1f2e' }}
                    >
                      {t.name}
                    </p>
                    {t.website && (
                      <a
                        href={t.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs"
                        style={{ color: '#2D6A4F' }}
                      >
                        {t.website}
                      </a>
                    )}
                  </div>
                  <div
                    className="md:col-span-2 text-sm capitalize"
                    style={{ color: '#5a7080' }}
                  >
                    {t.sport}
                  </div>
                  <div
                    className="md:col-span-2 text-xs"
                    style={{ color: '#5a7080' }}
                  >
                    {formatDateRange(t.start_date, t.end_date)}
                  </div>
                  <div
                    className="md:col-span-2 text-xs"
                    style={{ color: '#5a7080' }}
                  >
                    {venueCount === 0
                      ? '—'
                      : `${venueCount} venue${venueCount === 1 ? '' : 's'}`}
                  </div>
                  <div className="md:col-span-1 flex md:justify-end gap-2">
                    <button
                      onClick={() => openEdit(t)}
                      className="p-2 rounded-lg"
                      style={{
                        backgroundColor: '#eef5f0',
                        color: '#2D6A4F',
                      }}
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(t)}
                      className="p-2 rounded-lg"
                      style={{
                        backgroundColor: '#fef2f2',
                        color: '#b91c1c',
                      }}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
          style={{ backgroundColor: 'rgba(15, 31, 46, 0.55)' }}
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full my-8 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: '1px solid #dde8ee' }}
            >
              <h2
                className="text-lg font-bold"
                style={{ color: '#0f1f2e' }}
              >
                {editingId ? 'Edit Tournament' : 'Add Tournament'}
              </h2>
              <button
                onClick={closeModal}
                className="p-1"
                style={{ color: '#8fa3b2' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {error && (
                <div
                  className="rounded-xl p-3 text-sm flex items-start gap-2"
                  style={{
                    backgroundColor: '#fef2f2',
                    color: '#b91c1c',
                  }}
                >
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Field label="Name *">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full rounded-xl px-4 py-2.5 border text-sm outline-none"
                  style={{ borderColor: '#dde8ee' }}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Sport *">
                  <select
                    value={form.sport}
                    onChange={(e) =>
                      setForm({ ...form, sport: e.target.value })
                    }
                    className="w-full rounded-xl px-4 py-2.5 border text-sm outline-none bg-white"
                    style={{ borderColor: '#dde8ee' }}
                  >
                    {SPORTS.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Organization">
                  <select
                    value={form.organization_id}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        organization_id: e.target.value,
                      })
                    }
                    className="w-full rounded-xl px-4 py-2.5 border text-sm outline-none bg-white"
                    style={{ borderColor: '#dde8ee' }}
                  >
                    <option value="">— None —</option>
                    {orgs.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Start date">
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) =>
                      setForm({ ...form, start_date: e.target.value })
                    }
                    className="w-full rounded-xl px-4 py-2.5 border text-sm outline-none"
                    style={{ borderColor: '#dde8ee' }}
                  />
                </Field>
                <Field label="End date">
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={(e) =>
                      setForm({ ...form, end_date: e.target.value })
                    }
                    className="w-full rounded-xl px-4 py-2.5 border text-sm outline-none"
                    style={{ borderColor: '#dde8ee' }}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Entry fee ($)">
                  <input
                    type="number"
                    step="0.01"
                    value={form.entry_fee}
                    onChange={(e) =>
                      setForm({ ...form, entry_fee: e.target.value })
                    }
                    className="w-full rounded-xl px-4 py-2.5 border text-sm outline-none"
                    style={{ borderColor: '#dde8ee' }}
                  />
                </Field>
                <Field label="Age groups (comma-separated)">
                  <input
                    type="text"
                    value={form.age_groups}
                    onChange={(e) =>
                      setForm({ ...form, age_groups: e.target.value })
                    }
                    placeholder="10U, 12U, 14U"
                    className="w-full rounded-xl px-4 py-2.5 border text-sm outline-none"
                    style={{ borderColor: '#dde8ee' }}
                  />
                </Field>
              </div>

              <Field label="Website">
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) =>
                    setForm({ ...form, website: e.target.value })
                  }
                  placeholder="https://…"
                  className="w-full rounded-xl px-4 py-2.5 border text-sm outline-none"
                  style={{ borderColor: '#dde8ee' }}
                />
              </Field>

              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-xl px-4 py-2.5 border text-sm outline-none resize-none"
                  style={{ borderColor: '#dde8ee' }}
                />
              </Field>

              {/* Venues assignment */}
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: '#8fa3b2' }}
                >
                  Venues
                </p>
                <div
                  className="rounded-xl border max-h-56 overflow-y-auto"
                  style={{ borderColor: '#dde8ee' }}
                >
                  {venues.length === 0 ? (
                    <p
                      className="text-sm p-4"
                      style={{ color: '#5a7080' }}
                    >
                      No venues yet. Add venues first to link them.
                    </p>
                  ) : (
                    venues.map((v) => {
                      const state = selectedVenues[v.id] || {
                        selected: false,
                        primary: false,
                      }
                      return (
                        <label
                          key={v.id}
                          className="flex items-center gap-3 px-4 py-2.5 cursor-pointer"
                          style={{ borderBottom: '1px solid #edf2f5' }}
                        >
                          <input
                            type="checkbox"
                            checked={state.selected}
                            onChange={(e) =>
                              setSelectedVenues({
                                ...selectedVenues,
                                [v.id]: {
                                  selected: e.target.checked,
                                  primary: state.primary,
                                },
                              })
                            }
                          />
                          <div className="flex-1">
                            <p
                              className="text-sm font-bold"
                              style={{ color: '#0f1f2e' }}
                            >
                              {v.name}
                            </p>
                            <p
                              className="text-xs"
                              style={{ color: '#5a7080' }}
                            >
                              {v.city}, {v.state}
                            </p>
                          </div>
                          {state.selected && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault()
                                // Only one primary per tournament
                                const next: typeof selectedVenues = {}
                                Object.entries(selectedVenues).forEach(
                                  ([k, val]) => {
                                    next[k] = {
                                      selected: val.selected,
                                      primary: false,
                                    }
                                  }
                                )
                                next[v.id] = {
                                  selected: true,
                                  primary: !state.primary,
                                }
                                setSelectedVenues(next)
                              }}
                              className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg"
                              style={{
                                backgroundColor: state.primary
                                  ? '#fef3c7'
                                  : '#f5f8fa',
                                color: state.primary ? '#92400e' : '#8fa3b2',
                              }}
                              title={
                                state.primary
                                  ? 'Primary venue'
                                  : 'Mark as primary'
                              }
                            >
                              <Star
                                size={12}
                                fill={state.primary ? '#f59e0b' : 'none'}
                              />
                              {state.primary ? 'Primary' : 'Set primary'}
                            </button>
                          )}
                        </label>
                      )
                    })
                  )}
                </div>
              </div>
            </div>

            <div
              className="flex items-center justify-end gap-3 px-6 py-4"
              style={{ borderTop: '1px solid #dde8ee' }}
            >
              <button
                onClick={closeModal}
                disabled={saving}
                className="px-4 py-2 rounded-xl text-sm font-bold"
                style={{ color: '#5a7080' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{
                  background:
                    'linear-gradient(135deg, #2D6A4F 0%, #3a8c64 100%)',
                  opacity: saving ? 0.6 : 1,
                }}
              >
                <Save size={14} /> {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(15, 31, 46, 0.55)' }}
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: '#fef2f2' }}
              >
                <AlertTriangle size={20} style={{ color: '#b91c1c' }} />
              </div>
              <div>
                <h3
                  className="text-lg font-bold mb-1"
                  style={{ color: '#0f1f2e' }}
                >
                  Delete tournament?
                </h3>
                <p className="text-sm" style={{ color: '#5a7080' }}>
                  &ldquo;{deleteTarget.name}&rdquo; will be permanently
                  removed, including all venue links.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-5">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-sm font-bold"
                style={{ color: '#5a7080' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{
                  backgroundColor: '#b91c1c',
                  opacity: deleting ? 0.6 : 1,
                }}
              >
                <Trash2 size={14} />
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        className="block text-xs font-bold uppercase tracking-widest mb-1.5"
        style={{ color: '#8fa3b2' }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

function formatDateRange(start: string | null, end: string | null): string {
  if (!start && !end) return '—'
  const fmt = (d: string) => {
    const date = new Date(d)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }
  if (start && end) return `${fmt(start)} – ${fmt(end)}`
  return fmt((start || end) as string)
}
