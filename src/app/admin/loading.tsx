/*
 * Kol portalo puslapis kraunasi (jie visi dinaminiai): blankūs kortelių
 * kontūrai portalo spalvomis, ne tuščias baltas langas.
 */
export default function AdminLoading() {
  return (
    <div className="flex flex-1 flex-col bg-app-sheet lg:grid lg:grid-cols-[248px_minmax(0,1fr)]" aria-busy="true" aria-label="Kraunama">
      <div className="hidden h-dvh border-r border-app-hairline bg-white lg:block" />
      <div className="mx-auto w-full max-w-[1040px] space-y-4 px-4 pt-10 sm:px-8">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-app-band" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-[20px] bg-white shadow-app-card" />
        ))}
      </div>
    </div>
  );
}
