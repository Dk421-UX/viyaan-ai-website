"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  const defaultLinks = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Research", href: "/research" },
    { label: "Innovation Lab", href: "/lab" },
    { label: "Founder", href: "/founder" },
    { label: "Contact", href: "/contact" }
  ];

  const [navLinks, setNavLinks] = useState<any[]>(defaultLinks);

  // Fetch dynamic nav links (optional CMS integration)
  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.navigation && data.navigation.length > 0) {
          // Always ensure Home and Contact exist in dynamic lists if not defined
          let items = [...data.navigation];
          if (!items.find(i => i.href === "/")) {
            items.unshift({ label: "Home", href: "/" });
          }
          if (!items.find(i => i.href === "/contact")) {
            items.push({ label: "Contact", href: "/contact" });
          }
          setNavLinks(items);
        }
      })
      .catch((e) => console.error("Error loading navigation dynamically:", e));
  }, []);

  // Handle scroll opacity header transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock scroll when menu is open
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

  // Focus trap and Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      // Close on Escape key
      if (e.key === "Escape") {
        setIsOpen(false);
        toggleBtnRef.current?.focus();
        return;
      }

      // Focus trap
      if (e.key === "Tab") {
        if (!menuRef.current) return;
        
        const focusableElements = menuRef.current.querySelectorAll(
          'a[href], button:not([disabled])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          // Shift + Tab: loop backward
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          // Tab: loop forward
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Auto-close menu on path changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Focus the first menu link when opening the menu
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const firstLink = menuRef.current.querySelector("a");
      firstLink?.focus();
    }
  }, [isOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#050505]/80 backdrop-blur-md border-b border-[#121214] pb-4 pt-[calc(1rem+env(safe-area-inset-top))] md:pt-4"
            : "bg-transparent border-b border-transparent pb-6 pt-[calc(1.5rem+env(safe-area-inset-top))] md:pt-6"
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-8">
          
          {/* LEFT: Viyaan AI Logo */}
          <Link href="/" className="flex items-center gap-2.5 group focus-visible:outline-none" aria-label="Viyaan AI Home">
            <div className="relative w-7 h-7 rounded border border-neutral-900 bg-neutral-950 p-1 flex items-center justify-center transition-colors group-hover:border-viyaan-blue">
              <Image
                src="/logo.png"
                alt="Viyaan AI Logo"
                fill
                sizes="28px"
                className="object-contain p-0.5"
                priority
              />
            </div>
            <span className="font-display font-bold text-xs tracking-wider text-white">
              VIYAAN AI
            </span>
          </Link>

          {/* RIGHT: Single Hamburger Icon (☰) */}
          <button
            ref={toggleBtnRef}
            onClick={() => setIsOpen(!isOpen)}
            className="text-neutral-400 hover:text-white p-2 focus-visible:outline-2 focus-visible:outline-viyaan-blue outline-none cursor-pointer rounded-lg transition-colors z-50"
            aria-expanded={isOpen}
            aria-controls="fullscreen-navigation"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </header>

      {/* Full-Screen Menu Overlay */}
      <div
        id="fullscreen-navigation"
        ref={menuRef}
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-40 bg-[#050505]/98 backdrop-blur-2xl flex flex-col justify-center items-center transition-all duration-300 ${
          isOpen 
            ? "opacity-100 pointer-events-auto visible" 
            : "opacity-0 pointer-events-none invisible"
        }`}
      >
        <nav 
          className="flex flex-col items-center justify-center gap-6 sm:gap-8 max-w-md w-full px-6" 
          aria-label="Full-screen navigation"
        >
          {navLinks.map((link, index) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  transform: isOpen ? "translateY(0)" : "translateY(15px)",
                  opacity: isOpen ? 1 : 0,
                  transition: `all 300ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 40}ms`
                }}
                className={`text-2xl sm:text-4xl font-display tracking-widest font-semibold hover:text-viyaan-cyan focus-visible:text-viyaan-cyan focus-visible:outline-none transition-colors py-2 uppercase ${
                  isActive ? "text-white" : "text-neutral-500"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
