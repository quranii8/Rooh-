export function QuickStats() {
  const stats = [
    { num: "١١٤", label: "سورة" },
    { num: "٦٬٢٣٦", label: "آية" },
    { num: "٣٠", label: "جزءاً" },
    { num: "٨", label: "تفاسير" },
    { num: "+٢٠", label: "قارئاً" },
    { num: "١٠", label: "لغات" },
  ];

  return (
    <section className="relative max-w-7xl mx-auto px-5 py-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="card text-center p-4">
            <div className="text-2xl font-extrabold" style={{ color: "var(--primary)" }}>
              {s.num}
            </div>
            <div className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
