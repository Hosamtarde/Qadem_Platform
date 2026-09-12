export default function BuiltAtWahj() {
  return (
    <section className="border-b border-line-soft py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-center">
        <p className="text-xs tracking-[0.2em] text-muted">
          BUILT DURING AN INTERNSHIP AT
        </p>

        <a href="https://wahj.co" target="_blank" rel="noreferrer" className="inline-block rounded-lg opacity-90 transition hover:opacity-100"><img src="/wahj-logo.svg" alt="Wahj" className="h-11 w-auto" /></a>

        <p className="max-w-lg text-sm leading-relaxed text-muted">
          Qadem was designed and built by Hosam Taradeh and Mohammed Tarade
          during a backend engineering internship at Wahj, a software company
          based in Hebron.
        </p>
      </div>
    </section>
  );
}
