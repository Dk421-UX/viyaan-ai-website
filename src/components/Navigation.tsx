"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MoreVertical, X } from "lucide-react";
import BrandMark from "./BrandMark";
import SiteContainer from "./SiteContainer";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Contact", href: "/contact" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    // Focus the first link in the menu when opened
    const timer = setTimeout(() => {
      const firstLink = menuRef.current?.querySelector<HTMLAnchorElement>("a");
      firstLink?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener("keydown", onKeyDown);
      clearTimeout(timer);
    };
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    menuButtonRef.current?.focus();
  };

  return (
    <header className="site-header">
      <SiteContainer className="grid min-h-16 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center">
        <Link href="/" className="col-start-1 w-fit" aria-label="Viyaan AI home">
          <BrandMark compact />
        </Link>

        <nav className="col-start-2 hidden items-center gap-7 text-sm text-slate-300 md:flex" aria-label="Primary navigation">
          {links.map((link) => (
            <Link key={link.label} href={link.href} className="transition-colors hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/contact" className="cta-secondary col-start-3 justify-self-end hidden md:inline-flex">
          Contact
        </Link>

        {/* Mobile three-dot menu trigger */}
        <div className="col-start-3 justify-self-end md:hidden">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex size-11 items-center justify-center rounded-lg border border-white/10 text-slate-200 transition-colors hover:border-white/25 hover:text-white focus-visible:outline-2 focus-visible:outline-sky-400"
            aria-label={open ? "Close navigation menu" : "Open navigation options"}
            aria-expanded={open}
            aria-haspopup="true"
            aria-controls="mobile-navigation"
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <MoreVertical className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </SiteContainer>

      {/* Mobile three-dot dropdown menu */}
      {open ? (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
            onClick={closeMenu}
            aria-hidden="true"
          />

          <div
            id="mobile-navigation"
            ref={menuRef}
            role="menu"
            aria-label="Mobile navigation"
            className="fixed top-16 right-4 sm:right-6 z-[70] w-56 max-w-[calc(100vw-2rem)] rounded-xl border border-white/[0.12] bg-[#081024] p-1.5 shadow-2xl shadow-black/90 md:hidden"
          >
            <div className="border-b border-white/[0.08] px-3 py-2 mb-1">
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Navigation</p>
            </div>
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/[0.08] hover:text-white focus-visible:bg-white/[0.08] focus-visible:text-white focus-visible:outline-none"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </>
      ) : null}
    </header>
  );
}
