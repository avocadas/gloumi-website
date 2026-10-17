/*
 * Kol portalo puslapis kraunasi (jie visi dinaminiai): blankūs kortelių
 * kontūrai portalo spalvomis, ne tuščias baltas langas.
 */
export default function AdminLoading() {
  return (
    <div className="flex flex-1 flex-col bg-app-sheet" aria-busy="true" aria-label="Kraunama">
      <div className="h-40 bg-app-lavender/60" />
      <div className="mx-auto -mt-20 w-full max-w-5xl space-y-4 px-4 sm:px-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-[22px] bg-white/80 ring-1 ring-app-hairline" />
        ))}
      </div>
    </div>
  );
}
