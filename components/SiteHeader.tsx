// components/SiteHeader.tsx - Modified version
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { nav, navCta, site } from "@/content/site";

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const subRef = useRef<HTMLDivElement | null>(null);

  const closeAll = useCallback(() => {
    setMenuOpen(false);
    setOpenSub(null);
  }, []);

  useEffect(() => {
    closeAll();
  }, [pathname, closeAll]);

  useEffect(() => {
    if (!openSub) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenSub(null);
      subRef.current?.querySelector("button")?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (!subRef.current?.contains(e.target as Node)) setOpenSub(null);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [openSub]);

  const isCurrent = (href: string) => pathname === href;

  return (
    <header className="hdr">
      <div className="wrap hdr-row">
        <Link href="/" className="brand" aria-label={`${site.name} — home`}>
          <Image
            src="/brand/solvicosoft_logo.svg"
            alt={site.name}
            width={2280}
            height={780}
            className="brand-logo"
            priority
          />
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>

        <nav id="site-nav" className={menuOpen ? "nav nav-open" : "nav"} aria-label="Main">
          {nav.map((item) => {
            if (!("children" in item)) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav-link"
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            }

            const open = openSub === item.label;
            const holdsCurrent = item.children.some((c) => isCurrent(c.href));

            return (
              <div
                key={item.label}
                className="has-sub"
                ref={subRef}
                onMouseEnter={() => setOpenSub(item.label)}
                onMouseLeave={() => setOpenSub(null)}
              >
                <button
                  type="button"
                  className="nav-link sub-trigger"
                  data-active={holdsCurrent ? "true" : undefined}
                  aria-expanded={open}
                  aria-controls={`sub-${item.label.replace(/\s+/g, "-").toLowerCase()}`}
                  onClick={() => setOpenSub(open ? null : item.label)}
                >
                  {item.label}
                  <span className="caret" aria-hidden="true" />
                </button>

                <div
                  id={`sub-${item.label.replace(/\s+/g, "-").toLowerCase()}`}
                  className={open ? "subnav subnav-open" : "subnav"}
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="sub-link"
                      aria-current={isCurrent(child.href) ? "page" : undefined}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          {/* CTA moved inside nav for centering */}
          <Link href={navCta.href} className="nav-cta">
            {navCta.label}
            <span className="arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}