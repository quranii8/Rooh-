import Link from "next/link";

export default function NotFound() {
  return (
    <section className="max-w-2xl mx-auto px-5 py-20 text-center">
      <div className="text-7xl mb-5">🕊️</div>
      <h1 className="text-3xl font-extrabold mb-3" style={{ color: "var(--primary)" }}>
        الصفحة غير موجودة
      </h1>
      <p className="mb-7" style={{ color: "var(--text-muted)" }}>
        الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
      </p>
      <Link href="/" className="btn btn-primary">
        ← الرجوع للرئيسية
      </Link>
    </section>
  );
}
