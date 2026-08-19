export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="font-display text-lg text-ink">Marque</p>
          <p className="font-mono text-xs text-ink-soft">
            Catalog data via DummyJSON
          </p>
        </div>
      </div>
    </footer>
  );
}