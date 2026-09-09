"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";

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

  // Scroll separation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
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

  // Auto-close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#050505]/92 backdrop-blur-2xl border-b border-white/[0.08] py-3.5 shadow-sm shadow-black/50"
            : "bg-transparent border-b border-transparent py-5 sm:py-6"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          {/* Brand Mark */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none"
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

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-7"
            aria-label="Primary navigation"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-[13px] font-sans transition-colors duration-200 focus-visible:outline-none ${
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
          <div className="hidden md:flex items-center">
            <Link
              href="/contact"
              className="text-[13px] text-neutral-300 hover:text-white transition-colors duration-200 flex items-center gap-1 focus-visible:outline-none"
            >
              <span>Get in touch</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            ref={toggleBtnRef}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-neutral-300 hover:text-white p-1.5 focus-visible:outline-none cursor-pointer transition-colors"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Curtain / Overlay */}
      <div
        id="mobile-navigation"
        ref={menuRef}
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-40 bg-[#050505]/98 backdrop-blur-2xl flex flex-col justify-between px-7 py-8 pt-24 transition-all duration-300 md:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto visible"
            : "opacity-0 pointer-events-none invisible"
        }`}
      >
        <nav
          className="flex flex-col gap-6 mt-4"
          aria-label="Mobile navigation"
        >
          <span className="text-[11px] uppercase tracking-widest text-neutral-600 font-mono">
            Navigation
          </span>

          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={`text-2xl font-display font-medium tracking-tight transition-colors ${
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
                className={`text-2xl font-display font-medium tracking-tight transition-colors ${
                  isActive ? "text-white" : "text-neutral-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-white/[0.06] flex flex-col gap-2 text-xs text-neutral-500 font-sans">
          <span>Intelligence beyond the human mind.</span>
          <span className="text-neutral-400">viyaan.ai.team@gmail.com</span>
        </div>
      </div>
    </>
  );
}
