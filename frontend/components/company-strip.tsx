"use client";

interface Company {
  name: string;
  logo?: string;
}

const companies: Company[] = [
  { name: "ASAL Technologies" },
  { name: "Foothill" },
  { name: "Harri" },
  { name: "AHL Logics" },
  { name: "Wahj" },
  { name: "Aeliasoft" },
  { name: "Paltel" },
  { name: "Jawwal" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
}

function Item({ company }: { company: Company }) {
  return (
    <span className="flex shrink-0 items-center gap-3 opacity-55 transition hover:opacity-100">
      {company.logo ? (
        <img
          src={company.logo}
          alt={company.name}
          className="h-8 w-auto object-contain"
        />
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-panel-2 text-xs font-semibold text-brand-soft">
          {initials(company.name)}
        </span>
      )}
      <span className="whitespace-nowrap text-sm font-medium text-muted">
        {company.name}
      </span>
    </span>
  );
}

export default function CompanyStrip() {
  const half = Math.ceil(companies.length / 2);
  const rowOne = companies.slice(0, half);
  const rowTwo = companies.slice(half);

  return (
    <div className="marquee-wrap fade-sides space-y-5 overflow-hidden">
      <div className="marquee">
        {[...rowOne, ...rowOne, ...rowOne].map((c, i) => (
          <Item key={`a-${i}`} company={c} />
        ))}
      </div>
      <div className="marquee marquee-rev">
        {[...rowTwo, ...rowTwo, ...rowTwo].map((c, i) => (
          <Item key={`b-${i}`} company={c} />
        ))}
      </div>
    </div>
  );
}
