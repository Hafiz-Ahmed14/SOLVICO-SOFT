"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { nav, navCta, site } from "@/content/site";

/**
 * Site header: brand lockup on the left, navigation grouped to the right, and
 * the call to action pinned flush to the container edge.
 *
 * Three things are load-bearing and easy to break by accident:
 *
 *   1. "Our Services" is a disclosure button, not a link. It has no page of its
 *      own — giving it one would put it on the same route as "Products" and
 *      mark two elements as the current page. Everything it opens is a real
 *      product route, checked against the filesystem by scripts/verify.mjs.
 *
 *   2. Current-page matching is exact, never a prefix. `startsWith("/products")`
 *      would light up "Products" on every product page at the same time as
 *      "Our Services", which is what `aria-current` exists to prevent. The
 *      services trigger stands in as the active item on a child route instead.
 *
 *   3. The logo file carries a wide transparent margin — its artwork sits in
 *      the lower 61% of the canvas, not centred. `.brand-logo` compensates with
 *      a negative top margin, so changing the image means re-measuring that
 *      offset rather than assuming the artwork is where the box says it is.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const subRef = useRef<HTMLDivElement | null>(null);

  const closeAll = useCallback(() => {
    setMenuOpen(false);
    setOpenSub(null);
  }, []);

  // Navigating away must leave nothing hanging open behind the new page.
  useEffect(() => {
    closeAll();
  }, [pathname, closeAll]);

  // A submenu that only closes by clicking its own trigger is a trap on touch,
  // where there is no hover to fall out of. Escape and an outside press both
  // dismiss it; Escape hands focus back so the keyboard does not lose its place.
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
            // The trigger stands in as the active item while one of its own
            // routes is showing, so the bar never reads as "nowhere".
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
