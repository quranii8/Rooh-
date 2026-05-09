"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Moon, Sun, Search, BookmarkCheck } from "lucide-react";
import { useQuranStore } from "@/lib/store";
import { SearchBar } from "./SearchBar";

export function Header() {
  const theme = useQuranStore((s) => s.theme);
  const toggleTheme = useQuranStore((s) => s.toggleTheme);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 glass border-b" style={{ borderColor: "var(--border-soft)" }}>
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 font-extrabold" style={{ color: "var(--primary)" }}>
            <div className="w-11 h-11 rounded-xl grid place-items-center text-white text-xl shadow-md relative overflow-hidden"
                 style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-light))" }}>
              ۩
              <div className="absolute inset-[3px] border border-white/30 rounded-[9px]" />
            </div>
            <div className="hidden sm:block">
              <div className="text-base leading-tight">منصة القرآن</div>
              <div className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
                اقرأ • استمع • تدبّر
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className={`${mobileOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row gap-1 md:mr-auto absolute md:relative top-full md:top-auto inset-x-0 md:inset-auto p-3 md:p-0`}
               style={{ background: mobileOpen ? "var(--bg-elev)" : "transparent", borderBottom: mobileOpen ? "1px solid var(--border)" : "none" }}>
            <NavLink href="/">الرئيسية</NavLink>
            <NavLink href="/surahs">السور</NavLink>
            <NavLink href="/tafsir">التفاسير</NavLink>
            <NavLink href="/reciters">القراء</NavLink>
            <NavLink href="/bookmarks">
              <span className="inline-flex items-center gap-1.5">
                <BookmarkCheck className="w-4 h-4" /> المحفوظات
              </span>
            </NavLink>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              className="icon-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="بحث"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              className="icon-btn"
              onClick={toggleTheme}
              aria-label="تبديل الوضع"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              className="icon-btn md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="القائمة"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search bar (expanded) */}
        {searchOpen && (
          <div className="border-t animate-fade-in" style={{ borderColor: "var(--border-soft)", background: "var(--bg-elev)" }}>
            <div className="max-w-3xl mx-auto px-5 py-4">
              <SearchBar autoFocus onSelect={() => setSearchOpen(false)} />
            </div>
          </div>
        )}
      </header>
    </>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3.5 py-2 rounded-lg font-medium text-sm transition-colors"
      style={{ color: "var(--text-muted)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--primary-soft)";
        e.currentTarget.style.color = "var(--primary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "var(--text-muted)";
      }}
    >
      {children}
    </Link>
  );
}
