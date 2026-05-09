# 🕌 منصة القرآن الكريم — Next.js 14

موقع قرآن كريم احترافي كامل بُني بـ **Next.js 14 + TypeScript + Tailwind CSS**، مع التركيز على **نظام تفاسير متعدد** يضم 8 تفاسير معتمدة قابلة للمقارنة.

---

## ✨ الميزات الرئيسية

### 📚 نظام التفاسير المتعدد (الميزة الأبرز)
- **8 تفاسير معتمدة**: الميسّر، الجلالين، القرطبي، الطبري، البغوي، ابن كثير، الوسيط، تنوير المقباس (ابن عباس)
- **مقارنة جنباً إلى جنب**: عرض كل التفاسير لنفس الآية في tab واحد
- صفحة مخصصة لكل تفسير مع معلومات المؤلف والعصر والمنهج
- **متصفح تفاعلي** للتفسير حسب السورة
- ألوان وأيقونات مميزة لكل تفسير

### 📖 القراءة
- النص القرآني الكامل بـ **الرسم العثماني** (مصحف المدينة)
- 114 سورة كاملة مع بياناتها التفصيلية
- وضعان للعرض: صفحة مصحف / قائمة آيات
- **تحكم بالخط** (slider من 1.2 إلى 2.6 rem)
- علامات نهاية الآيات (۝) بتصميم زخرفي
- البسملة بتصميم مميّز
- **اختصارات لوحة المفاتيح**

### 🌍 الترجمات
- **10 ترجمات** بـ 9 لغات (إنجليزي، فرنسي، تركي، أردو، إندونيسي، إسباني، روسي، ألماني...)
- عرض كل الترجمات معاً في tab "الترجمات"
- دعم RTL للترجمات العربية (الأردو)

### 🎙️ الاستماع
- **20+ قارئ** من العالم الإسلامي
- مشغّل صوت ثابت أنيق
- تشغيل آية بآية مع **highlighting تلقائي + scroll**
- أزرار تنقل، شريط تقدم، اختيار قارئ
- صفحة مخصصة لكل قارئ مع playlist لكل سورة

### 📌 المحفوظات والسجل
- حفظ أي آية بنقرة (Zustand + persist في localStorage)
- صفحة محفوظات شاملة بترتيب زمني
- تتبع آخر قراءة + سجل آخر السور
- بطاقات "تابع القراءة" في الرئيسية

### 🎨 التصميم
- **هوية إسلامية** (أخضر #1B5E20 + ذهبي #C8A951)
- **وضع ليلي/نهاري** كامل مع smooth transitions
- 4 خطوط احترافية: **Amiri**, **Noto Kufi Arabic**, **Noto Naskh**, **Inter**
- Glass morphism في الهيدر
- Animations سلسة مع Tailwind
- خلفية زخرفية إسلامية ناعمة
- متجاوب 100% (Mobile First)

### ⚡ الأداء
- **SSG** (Static Site Generation) لكل الصفحات → سرعة فائقة
- **153 صفحة** مولّدة كـ HTML ثابت في وقت البناء
- Code splitting تلقائي
- Caching ذكي لـ APIs (revalidate يومياً)
- متوسط First Load JS: **~100 KB** فقط

### 🔍 SEO + PWA
- Sitemap.xml تلقائي يضم كل السور والتفاسير والقراء
- Robots.txt
- Open Graph + Twitter Cards
- JSON-LD structured data للسور
- Web App Manifest (قابل للتثبيت)
- Metadata ديناميكي لكل صفحة

### 🗄️ قاعدة البيانات (جاهزة للاستخدام)
Schema كامل بـ Prisma + PostgreSQL يدعم:
- المستخدمون والمصادقة (NextAuth.js)
- المحفوظات (Bookmarks)
- الملاحظات (Notes)
- سجل القراءة (ReadingLog)
- التفضيلات الشخصية (UserPreference)

---

## 🚀 التشغيل

### المتطلبات
- Node.js 18+
- npm أو pnpm

### التثبيت
```bash
cd quran-nextjs
npm install
```

### التطوير
```bash
npm run dev
# افتح http://localhost:3000
```

### البناء للإنتاج
```bash
npm run build
npm start
```

### قاعدة البيانات (اختياري)
```bash
cp .env.example .env
# عدّل DATABASE_URL في .env
npx prisma db push
```

---

## 📁 هيكل المشروع

```
quran-nextjs/
├── prisma/
│   └── schema.prisma              # User, Bookmark, Note, ReadingLog, Prefs
├── public/
│   └── manifest.json              # PWA manifest
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── layout.tsx             # Root layout (fonts, header, footer)
│   │   ├── page.tsx               # الصفحة الرئيسية
│   │   ├── globals.css            # Design tokens + utilities
│   │   ├── loading.tsx            # Global loading
│   │   ├── not-found.tsx          # 404
│   │   ├── sitemap.ts             # SEO sitemap
│   │   ├── robots.ts              # SEO robots
│   │   ├── surahs/page.tsx        # قائمة السور
│   │   ├── surah/[number]/        # صفحة قراءة السورة (SSG لكل 114 سورة)
│   │   ├── tafsir/                # ★ نظام التفاسير
│   │   │   ├── page.tsx           # فهرس التفاسير
│   │   │   └── [id]/page.tsx      # صفحة كل تفسير (SSG لكل 8 تفاسير)
│   │   ├── reciters/              # القراء
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx      # SSG لكل 20 قارئ
│   │   ├── bookmarks/page.tsx     # المحفوظات
│   │   └── about/page.tsx
│   ├── components/
│   │   ├── Header.tsx             # Sticky header + theme toggle
│   │   ├── Footer.tsx
│   │   ├── SearchBar.tsx          # بحث فوري في السور
│   │   ├── AudioPlayer.tsx        # ★ مشغّل صوتي عالمي
│   │   ├── ThemeApplier.tsx       # تطبيق الثيم بعد hydration
│   │   ├── SurahsBrowser.tsx      # فلاتر + بحث + شبكة السور
│   │   ├── SurahReader.tsx        # ★ قارئ السورة (الصفحة الأهم)
│   │   ├── VerseModal.tsx         # ★ مودال الآية مع 3 tabs
│   │   ├── TafsirBrowser.tsx      # تصفّح التفسير حسب السورة
│   │   ├── ReciterPlaylist.tsx    # قائمة سور القارئ
│   │   ├── BookmarksList.tsx
│   │   └── home/                  # مكوّنات الصفحة الرئيسية
│   │       ├── HomeHero.tsx
│   │       ├── DailyVerse.tsx     # آية اليوم (server component)
│   │       ├── QuickStats.tsx
│   │       ├── ContinueReading.tsx
│   │       ├── TafsirHighlight.tsx
│   │       └── RecitersHighlight.tsx
│   └── lib/
│       ├── utils.ts               # toArabicNum, formatTime, getAyahAudioUrl, cn
│       ├── surahs.ts              # بيانات الـ 114 سورة
│       ├── tafasir.ts             # ★ بيانات التفاسير + الترجمات
│       ├── reciters.ts            # بيانات القراء
│       ├── quran-api.ts           # API client (alquran.cloud)
│       ├── store.ts               # Zustand global store (مع persist)
│       └── audio-store.ts         # Audio state منفصل
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
└── package.json
```

---

## 📊 نتائج البناء

```
✓ Compiled successfully
✓ 153 static pages generated:
  - 114 surah pages (SSG)
  - 20 reciter pages (SSG)
  - 8 tafsir pages (SSG)
  - 11 other pages (home, surahs list, tafsir list, reciters list, bookmarks, about, etc.)

Route                          Size      First Load JS
/                              3.1 kB    106 kB
/surah/[number]                8.89 kB   106 kB  ★ (الأكبر — يحوي SurahReader + VerseModal)
/tafsir/[id]                   4.56 kB   98.5 kB
/reciters/[id]                 7.49 kB   105 kB
/bookmarks                     7.37 kB   104 kB

Shared JS:                     87.1 kB
```

**كل الصفحات SSG** = أداء فائق + SEO ممتاز + يمكن نشرها على أي static host (Vercel/Netlify/Cloudflare).

---

## 🌐 المصادر (APIs)

| المصدر | الاستخدام |
|---|---|
| `api.alquran.cloud` | النص العثماني، التفاسير الـ 8، الترجمات الـ 10 |
| `everyayah.com` | ملفات الصوت لكل آية لكل قارئ |

كل المصادر **مجانية ومستقرة** (مستخدمة في تطبيقات قرآنية كبرى).

---

## 🎯 الميزات الجاهزة للتفعيل (المرحلة التالية)

البنية التحتية جاهزة، تحتاج فقط لتفعيل:
- [ ] NextAuth.js (الـ schema موجود) → ربط المحفوظات بحساب
- [ ] صفحة Dashboard (إحصائيات قراءة)
- [ ] نظام حفظ متقدم (spaced repetition)
- [ ] Word-by-word translation
- [ ] PWA service worker للقراءة offline
- [ ] إشعارات للقراءة اليومية
- [ ] صفحات الأذكار والأدعية
- [ ] صفحات علوم القرآن

---

## 🛡️ الأمان والأداء

- ✅ HTTPS-ready
- ✅ Security headers (X-Frame-Options, CSP-ready, etc.)
- ✅ TypeScript strict mode
- ✅ ESLint + Next.js best practices
- ✅ Image optimization (Next/Image)
- ✅ Font optimization (next/font)
- ✅ Code splitting تلقائي
- ✅ React Server Components حيث أمكن

---

**صُنع بحب لخدمة كتاب الله ✦**
