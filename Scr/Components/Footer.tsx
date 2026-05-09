import Link from "next/link";

export function Footer() {
  return (
    <footer
      className="relative z-10 border-t mt-16 pt-10 pb-24 text-center px-5"
      style={{ background: "var(--bg-elev)", borderColor: "var(--border)" }}
    >
      <div className="flex flex-wrap justify-center gap-5 mb-4">
        <FooterLink href="/">الرئيسية</FooterLink>
        <FooterLink href="/surahs">السور</FooterLink>
        <FooterLink href="/tafsir">التفاسير</FooterLink>
        <FooterLink href="/reciters">القراء</FooterLink>
        <FooterLink href="/about">عن المنصة</FooterLink>
      </div>
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        صُنع بحب لخدمة كتاب الله تعالى ✦ © {new Date().getFullYear()}
      </p>
      <p className="mt-1.5 text-xs" style={{ color: "var(--text-soft)" }}>
        المصادر: api.alquran.cloud • everyayah.com
      </p>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm transition-colors"
      style={{ color: "var(--text-muted)" }}
    >
      {children}
    </Link>
  );
}
