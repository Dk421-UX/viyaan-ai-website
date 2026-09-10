"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import SiteContainer from "./SiteContainer";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const menuRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  const navLinks = [
    { label: "Products", href: "/products" },
    { label: "Research", href: "/research" },
    { label: "Lab", href: "/lab" },
    { label: "Founder", href: "/founder" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (!isOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
    };
  }, [isOpen]);

  // Focus trap & Escape listener for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        setIsOpen(false);
        toggleBtnRef.current?.focus();
        return;
      }

      if (e.key === "Tab") {
        if (!menuRef.current) return;
        const focusables = menuRef.current.querySelectorAll(
          "a[href], button:not([disabled])"
        );
        if (focusables.length === 0) return;
        const first = focusables[0] as HTMLElement;
        const last = focusables[focusables.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled
            ? "bg-[#050505]/92 backdrop-blur-md border-b border-white/[0.07] py-3 shadow-sm shadow-black/40"
            : "bg-transparent border-b border-transparent py-4 sm:py-5"
        }`}
      >
        <SiteContainer className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center">
          {/* Brand Mark */}
          <Link
            href="/"
            className="col-start-1 flex items-center gap-2.5 group focus-visible:outline-none min-h-[44px]"
            aria-label="Viyaan AI Home"
          >
            <div className="relative w-6 h-6 rounded-md overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center transition-opacity group-hover:opacity-90">
              <Image
                src="/logo.png"
                alt="Viyaan AI Logo"
                fill
                sizes="24px"
                className="object-contain p-0.5"
                priority
              />
            </div>
            <span className="font-display font-semibold text-sm tracking-tight text-white flex items-center gap-1.5">
              VIYAAN AI
            </span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav
            className="hidden md:col-start-2 md:flex items-center justify-self-center gap-6 lg:gap-7"
            aria-label="Primary navigation"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-xs lg:text-[13px] font-sans transition-colors duration-150 py-2 focus-visible:outline-none ${
                    isActive
                      ? "text-white font-medium"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Quick Action */}
          <div className="hidden md:col-start-3 md:flex items-center justify-self-end">
            <Link
              href="/contact"
              className="cta-link text-xs lg:text-[13px] text-neutral-300 hover:text-white focus-visible:outline-none"
            >
              <span>Get in touch</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            ref={toggleBtnRef}
            onClick={() => setIsOpen(!isOpen)}
            className="col-start-3 md:hidden justify-self-end text-neutral-300 hover:text-white p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-none cursor-pointer transition-colors"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </SiteContainer>
      </header>

      {/* Mobile Navigation Drawer */}
      <div
        id="mobile-navigation"
        ref={menuRef}
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-40 bg-[#050505]/98 backdrop-blur-xl flex flex-col justify-between px-5 sm:px-8 pt-24 pb-8 transition-all duration-250 md:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto visible"
            : "opacity-0 pointer-events-none invisible"
        }`}
      >
        <nav
          className="flex flex-col gap-1"
          aria-label="Mobile navigation"
        >
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={`text-lg font-display font-medium tracking-tight py-3 min-h-[48px] transition-colors ${
              pathname === "/" ? "text-white" : "text-neutral-400 hover:text-white"
            }`}
          >
            Home
          </Link>

          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-display font-medium tracking-tight py-3 min-h-[48px] transition-colors ${
                  isActive ? "text-white" : "text-neutral-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-white/[0.06] flex flex-col gap-2 text-xs text-neutral-500 font-sans">
          <span className="text-white font-medium">VIYAAN AI</span>
          <span>Intelligence beyond the human mind.</span>
          <a
            href="mailto:viyaan.ai.team@gmail.com"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            viyaan.ai.team@gmail.com
          </a>
        </div>
      </div>
    </>
  );
}
