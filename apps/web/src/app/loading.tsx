export default function Loading() {
  return (
    <div className="container-x py-20" aria-busy="true" aria-live="polite">
      <div className="h-8 w-64 animate-pulse rounded bg-navy-100" />
      <div className="mt-6 space-y-3">
        {[...Array(6)].map((_, i) => <div key={i} className="h-4 animate-pulse rounded bg-navy-50" style={{ width: `${90 - i * 8}%` }} />)}
      </div>
    </div>
  );
}
