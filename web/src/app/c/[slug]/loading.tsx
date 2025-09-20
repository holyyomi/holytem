export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg border">
            <div className="aspect-[3/2] bg-muted" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-2/3 bg-muted rounded" />
              <div className="h-3 w-1/2 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
