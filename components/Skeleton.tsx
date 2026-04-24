'use client'

/**
 * Shimmer-animated placeholder block. Use for loading states.
 *
 *   <Skeleton width="60%" height={20} />
 *
 * The shimmer animation is defined in globals.css as `@keyframes shimmer`.
 */
export function Skeleton({
  width = '100%',
  height = 16,
  rounded = 8,
  className = '',
  style,
}: {
  width?: string | number
  height?: string | number
  rounded?: string | number
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        borderRadius: typeof rounded === 'number' ? `${rounded}px` : rounded,
        background:
          'linear-gradient(90deg, #e8eef2 0%, #f0f5f8 50%, #e8eef2 100%)',
        backgroundSize: '200% 100%',
        animation: 'tbs-shimmer 1.4s ease-in-out infinite',
        ...style,
      }}
    />
  )
}

export function TripCardSkeleton() {
  return (
    <div
      className="rounded-2xl bg-white p-6"
      style={{
        border: '1px solid #dde8ee',
        borderLeft: '4px solid #2D6A4F',
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 space-y-2">
          <Skeleton width="70%" height={20} />
          <Skeleton width="50%" height={14} />
        </div>
        <Skeleton width={60} height={22} rounded={999} />
      </div>
      <div className="space-y-2.5 mb-5">
        <Skeleton width="80%" height={14} />
        <Skeleton width="55%" height={14} />
        <Skeleton width="40%" height={14} />
      </div>
      <div
        className="pt-4 flex items-center justify-between gap-3"
        style={{ borderTop: '1px solid #f0f4f6' }}
      >
        <Skeleton width={120} height={22} />
        <Skeleton width={70} height={14} />
      </div>
    </div>
  )
}

export function MemberCardSkeleton() {
  return (
    <div
      className="bg-white rounded-2xl p-5 border flex items-center gap-4"
      style={{ borderColor: '#dde8ee' }}
    >
      <Skeleton width={48} height={48} rounded={999} />
      <div className="flex-1 space-y-2">
        <Skeleton width="60%" height={16} />
        <Skeleton width="35%" height={12} />
      </div>
      <Skeleton width={70} height={22} rounded={999} />
    </div>
  )
}

export function StayCardSkeleton() {
  return (
    <div
      className="bg-white rounded-2xl border p-5 flex items-center gap-4"
      style={{
        borderColor: '#dde8ee',
        borderLeft: '4px solid #f59e0b',
      }}
    >
      <Skeleton width={44} height={44} rounded={999} />
      <div className="flex-1 space-y-2">
        <Skeleton width="55%" height={16} />
        <Skeleton width="75%" height={14} />
        <Skeleton width="45%" height={12} />
      </div>
      <Skeleton width={70} height={22} rounded={999} />
    </div>
  )
}
