import Link from "next/link";
import { TAFASIR } from "@/lib/tafasir";
import { TRANSLATIONS } from "@/lib/tafasir";
import { RECITERS } from "@/lib/reciters";

export const metadata = {
  title: "عن المنصة",
  description: "تعرّف على منصة القرآن الكريم: الرسالة، المصادر، والتقنيات",
};

export default function AboutPage() {
  return (
    <article className="max-w-4xl mx-auto px-5 py-10">
      <div className="text-center mb-10">
        <div
          className="w-20 h-20 mx-auto mb-5 rounded-2xl grid place-items-center text-white text-4xl shadow-lg"
          style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-light))" }}
        >
          ۩
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">منصة القرآن الكريم</h1>
        <p className="text-lg" style={{ color: "var(--text-muted)" }}>
          مشروع مجاني مفتوح لخدمة كتاب الله عز وجل
        </p>
      </div>

      <div className="space-y-5">
        <Card title="🎯 رسالتنا">
          <p>
            تقديم تجربة رقمية متكاملة للقرآن الكريم تجمع بين <strong>القراءة</strong> بالخط العثماني الأصيل،
            و<strong>الاستماع</strong> لأشهر القراء، و<strong>التفسير</strong> من أعظم كتب التراث الإسلامي،
            و<strong>الترجمة</strong> إلى لغات العالم — بأسلوب عصري وسهل الاستخدام.
          </p>
        </Card>

        <Card title="📚 التفاسير المعتمدة">
          <p className="mb-3">نقدم {toArabic(TAFASIR.length)} تفاسير من كبار علماء الأمة:</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TAFASIR.map((t) => (
              <li key={t.id} className="text-sm flex items-center gap-2">
                <span style={{ color: t.color }}>{t.icon}</span>
                <span>
                  <strong>{t.name}</strong> — <span style={{ color: "var(--text-muted)" }}>{t.era}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="🌍 الترجمات المتوفرة">
          <p className="mb-3">{toArabic(TRANSLATIONS.length)} ترجمات بـ {toArabic(new Set(TRANSLATIONS.map((t) => t.language)).size)} لغات:</p>
          <div className="flex flex-wrap gap-2">
            {TRANSLATIONS.map((t) => (
              <span
                key={t.id}
                className="px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: "var(--bg-soft)", border: "1px solid var(--border)" }}
              >
                {t.flag} {t.language}
              </span>
            ))}
          </div>
        </Card>

        <Card title="🎙️ القراء">
          <p>
            نوفر تلاوات أكثر من <strong>{toArabic(RECITERS.length)} قارئاً</strong> من مختلف الدول الإسلامية،
            بأنماط مختلفة (المرتل، المجوّد، التعليمي).
          </p>
        </Card>

        <Card title="🔧 التقنيات المستخدمة">
          <ul className="space-y-1 text-sm">
            <li>• <strong>Next.js 14</strong> (App Router) + TypeScript</li>
            <li>• <strong>Tailwind CSS</strong> للتصميم</li>
            <li>• <strong>Prisma + PostgreSQL</strong> لقاعدة البيانات</li>
            <li>• <strong>Zustand</strong> لإدارة الحالة</li>
            <li>• <strong>NextAuth.js</strong> للمصادقة</li>
            <li>• <strong>SSG/SSR</strong> لأداء عالٍ</li>
          </ul>
        </Card>

        <Card title="🌐 المصادر">
          <ul className="space-y-2 text-sm">
            <li>
              <strong>النص القرآني والتفاسير والترجمات:</strong>{" "}
              <a href="https://api.alquran.cloud" target="_blank" rel="noopener" className="underline" style={{ color: "var(--primary)" }}>
                api.alquran.cloud
              </a>
            </li>
            <li>
              <strong>التلاوات الصوتية:</strong>{" "}
              <a href="https://everyayah.com" target="_blank" rel="noopener" className="underline" style={{ color: "var(--primary)" }}>
                everyayah.com
              </a>
            </li>
            <li>
              <strong>النص العثماني الأصلي:</strong> مصحف المدينة النبوية — رواية حفص عن عاصم
            </li>
          </ul>
        </Card>

        <Card title="❤️ المساهمة">
          <p className="mb-3">
            هذا المشروع <strong>مفتوح المصدر</strong> ومجاني تماماً. نرحب بمساهماتك سواء كانت:
          </p>
          <ul className="space-y-1 text-sm" style={{ color: "var(--text-muted)" }}>
            <li>• تقارير عن الأخطاء أو اقتراحات للتحسين</li>
            <li>• ترجمات إلى لغات جديدة</li>
            <li>• تطوير ميزات جديدة</li>
            <li>• الدعاء لنا ولأمة محمد ﷺ</li>
          </ul>
        </Card>

        <div className="text-center pt-6">
          <Link href="/" className="btn btn-primary">
            ← الرجوع للرئيسية
          </Link>
        </div>
      </div>
    </article>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-6 md:p-7">
      <h2 className="text-xl font-bold mb-3" style={{ color: "var(--primary)" }}>{title}</h2>
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}

function toArabic(n: number) {
  return String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);
}
