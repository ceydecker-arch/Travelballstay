'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import {
  Shield,
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Search,
  ArrowLeft,
  X,
  Save,
  AlertTriangle,
} from 'lucide-react'
import { Skeleton } from '@/components/Skeleton'

interface Venue {
  id: string
  name: string
  address: string | null
  city: string
  state: string
  zip: string | null
  latitude: number | null
  longitude: number | null
  field_count: number | null
  website: string | null
  description: string | null
  gradient: string | null
  badge: string | null
  sports: string[] | null
  nearby_stays: string | null
  season: string | null
}

interface FormState {
  name: string
  address: string
  city: string
  state: string
  zip: string
  latitude: string
  longitude: string
  field_count: string
  website: string
  description: string
  gradient: string
  badge: string
  sports: string
  nearby_stays: string
  season: string
}

const EMPTY_FORM: FormState = {
  name: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  latitude: '',
  longitude: '',
  field_count: '',
  website: '',
  description: '',
  gradient: '',
  badge: '',
  sports: '',
  nearby_stays: '',
  season: '',
}

export default function AdminVenuesPage() {
  const [loading, setLoading] = useState(true)
  const [allowed, setAllowed] = useState(false)
  const [venues, setVenues] = useState<Venue[]>([])
  const [query, setQuery] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [deleteTarget, setDeleteTarget] = useState<Venue | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/signin?redirect=/admin/venues'
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
    const { data } = await supabase
      .from('venues')
      .select('*')
      .order('name')
    setVenues((data as Venue[]) || [])
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return venues
    return venues.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q) ||
        v.state.toLowerCase().includes(q)
    )
  }, [venues, query])

  function openAdd() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setError(null)
    setModalOpen(true)
  }

  function openEdit(v: Venue) {
    setEditingId(v.id)
    setForm({
      name: v.name,
      address: v.address || '',
      city: v.city,
      state: v.state,
      zip: v.zip || '',
      latitude: v.latitude != null ? String(v.latitude) : '',
      longitude: v.longitude != null ? String(v.longitude) : '',
      field_count: v.field_count != null ? String(v.field_count) : '',
      website: v.website || '',
      description: v.description || '',
      gradient: v.gradient || '',
      badge: v.badge || '',
      sports: (v.sports || []).join(', '),
      nearby_stays: v.nearby_stays || '',
      season: v.season || '',
    })
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
    if (!form.city.trim() || !form.state.trim()) {
      setError('City and state are required.')
      return
    }
    setSaving(true)

    const supabase = createClient()
    const payload = {
      name: form.name.trim(),
      address: form.address.trim() || null,
      city: form.city.trim(),
      state: form.state.trim(),
      zip: form.zip.trim() || null,
      latitude: form.latitude ? Number(form.latitude) : null,
      longitude: form.longitude ? Number(form.longitude) : null,
      field_count: form.field_count ? Number(form.field_count) : null,
      website: form.website.trim() || null,
      description: form.description.trim() || null,
      gradient: form.gradient.trim() || null,
      badge: form.badge.trim() || null,
      sports: form.sports
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      nearby_stays: form.nearby_stays.trim() || null,
      season: form.season.trim() || null,
    }

    if (editingId) {
      const { error: uerr } = await supabase
        .from('venues')
        .update(payload)
        .eq('id', editingId)
      if (uerr) {
        setError(uerr.message)
        setSaving(false)
        return
      }
    } else {
      const { error: ierr } = await supabase.from('venues').insert(payload)
      if (ierr) {
        setError(ierr.message)
        setSaving(false)
        return
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
    // Remove tournament_venues links first to satisfy FK
    await supabase
      .from('tournament_venues')
      .delete()
      .eq('venue_id', deleteTarget.id)
    const { error: derr } = await supabase
      .from('venues')
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
          style={{ borderLeft: '3px solid #f59e0b', paddingLeft: '12px' }}
        >
          <div>
            <div className="flex items-center gap-2">
              <MapPin size={18} style={{ color: '#f59e0b' }} />
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: '#f59e0b' }}
              >
                Admin · Venues
              </p>
            </div>
            <h1
              className="text-3xl font-extrabold mt-1"
              style={{ color: '#0f1f2e' }}
            >
              Manage Venues
            </h1>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white"
            style={{
              background:
                'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
            }}
          >
            <Plus size={16} /> Add Venue
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
            placeholder="Search by name or city…"
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
              No venues yet.
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
              <div className="col-span-4">Name</div>
              <div className="col-span-3">Location</div>
              <div className="col-span-2">Fields</div>
              <div className="col-span-2">Geo</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            {filtered.map((v) => (
              <div
                key={v.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 px-5 py-4 items-center"
                style={{ borderBottom: '1px solid #edf2f5' }}
              >
                <div className="md:col-span-4">
                  <p
                    className="font-bold text-sm"
                    style={{ color: '#0f1f2e' }}
                  >
                    {v.name}
                  </p>
                  {v.website && (
                    <a
                      href={v.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs"
                      style={{ color: '#2D6A4F' }}
                    >
                      {v.website}
                    </a>
                  )}
                </div>
                <div
                  className="md:col-span-3 text-sm"
                  style={{ color: '#5a7080' }}
                >
                  {v.city}, {v.state}
                </div>
                <div
                  className="md:col-span-2 text-sm"
                  style={{ color: '#5a7080' }}
                >
                  {v.field_count != null ? `${v.field_count} fields` : '—'}
                </div>
                <div
                  className="md:col-span-2 text-xs"
                  style={{ color: '#5a7080' }}
                >
                  {v.latitude != null && v.longitude != null ? (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md"
                      style={{
                        backgroundColor: '#eef5f0',
                        color: '#2D6A4F',
                      }}
                    >
                      <MapPin size={10} /> Geocoded
                    </span>
                  ) : (
                    <span style={{ color: '#94a3b8' }}>No coords</span>
                  )}
                </div>
                <div className="md:col-span-1 flex md:justify-end gap-2">
                  <button
                    onClick={() => openEdit(v)}
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
                    onClick={() => setDeleteTarget(v)}
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
            ))}
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
                {editingId ? 'Edit Venue' : 'Add Venue'}
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

              <Field label="Street address">
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  className="w-full rounded-xl px-4 py-2.5 border text-sm outline-none"
                  style={{ borderColor: '#dde8ee' }}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="City *">
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) =>
                      setForm({ ...form, city: e.target.value })
                    }
                    className="w-full rounded-xl px-4 py-2.5 border text-sm outline-none"
                    style={{ borderColor: '#dde8ee' }}
                  />
                </Field>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <Field label="State *">
                      <input
                        type="text"
                        value={form.state}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            state: e.target.value.toUpperCase(),
                          })
                        }
                        maxLength={2}
                        placeholder="TX"
                        className="w-full rounded-xl px-3 py-2.5 border text-sm outline-none uppercase"
                        style={{ borderColor: '#dde8ee' }}
                      />
                    </Field>
                  </div>
                  <div className="col-span-2">
                    <Field label="ZIP">
                      <input
                        type="text"
                        value={form.zip}
                        onChange={(e) =>
                          setForm({ ...form, zip: e.target.value })
                        }
                        className="w-full rounded-xl px-3 py-2.5 border text-sm outline-none"
                        style={{ borderColor: '#dde8ee' }}
                      />
                    </Field>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Latitude">
                  <input
                    type="number"
                    step="any"
                    value={form.latitude}
                    onChange={(e) =>
                      setForm({ ...form, latitude: e.target.value })
                    }
                    placeholder="30.2672"
                    className="w-full rounded-xl px-4 py-2.5 border text-sm outline-none"
                    style={{ borderColor: '#dde8ee' }}
                  />
                </Field>
                <Field label="Longitude">
                  <input
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={(e) =>
                      setForm({ ...form, longitude: e.target.value })
                    }
                    placeholder="-97.7431"
                    className="w-full rounded-xl px-4 py-2.5 border text-sm outline-none"
                    style={{ borderColor: '#dde8ee' }}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Field count">
                  <input
                    type="number"
                    value={form.field_count}
                    onChange={(e) =>
                      setForm({ ...form, field_count: e.target.value })
                    }
                    className="w-full rounded-xl px-4 py-2.5 border text-sm outline-none"
                    style={{ borderColor: '#dde8ee' }}
                  />
                </Field>
                <Field label="Season">
                  <input
                    type="text"
                    value={form.season}
                    onChange={(e) =>
                      setForm({ ...form, season: e.target.value })
                    }
                    placeholder="Spring, Summer, Fall"
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

              <Field label="Sports (comma-separated)">
                <input
                  type="text"
                  value={form.sports}
                  onChange={(e) =>
                    setForm({ ...form, sports: e.target.value })
                  }
                  placeholder="baseball, softball"
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

              <div className="grid grid-cols-2 gap-4">
                <Field label="Badge (optional)">
                  <input
                    type="text"
                    value={form.badge}
                    onChange={(e) =>
                      setForm({ ...form, badge: e.target.value })
                    }
                    placeholder="Signature"
                    className="w-full rounded-xl px-4 py-2.5 border text-sm outline-none"
                    style={{ borderColor: '#dde8ee' }}
                  />
                </Field>
                <Field label="Gradient (CSS, optional)">
                  <input
                    type="text"
                    value={form.gradient}
                    onChange={(e) =>
                      setForm({ ...form, gradient: e.target.value })
                    }
                    placeholder="#2D6A4F → #3a8c64"
                    className="w-full rounded-xl px-4 py-2.5 border text-sm outline-none"
                    style={{ borderColor: '#dde8ee' }}
                  />
                </Field>
              </div>

              <Field label="Nearby stays (short note)">
                <input
                  type="text"
                  value={form.nearby_stays}
                  onChange={(e) =>
                    setForm({ ...form, nearby_stays: e.target.value })
                  }
                  placeholder="Hotels within 5 miles"
                  className="w-full rounded-xl px-4 py-2.5 border text-sm outline-none"
                  style={{ borderColor: '#dde8ee' }}
                />
              </Field>
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
                    'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
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
                  Delete venue?
                </h3>
                <p className="text-sm" style={{ color: '#5a7080' }}>
                  &ldquo;{deleteTarget.name}&rdquo; will be permanently
                  removed. Any tournament links to this venue will be
                  unlinked.
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
