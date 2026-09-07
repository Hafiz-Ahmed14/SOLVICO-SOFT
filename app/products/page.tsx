import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import StatusPill from "@/components/StatusPill";
import { products } from "@/content/products";

export const metadata: Metadata = {
  title: "Products",
  description:
    "The three systems SolvicoSoft builds and maintains: HMMS for hall meal management, OBE Framework for outcome-based education, and VitaCraft for CVs.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <section className="band-tight">
        <div className="wrap">
          <Eyebrow>Catalogue</Eyebrow>
          <h1>Everything we make</h1>
          <p className="lead">
            Three products, all ours. We chose each problem, wrote each codebase and run each
            deployment — so what you see below is the whole catalogue, not a menu of things we
            could build for you.
          </p>
        </div>
      </section>

      <section className="band band-sunken">
        <div className="wrap">
          {products.map((p) => (
            <Reveal as="section" className="prod" key={p.slug}>
              <div>
                <div className="prod-kicker">
                  <span className="prod-code">{p.code}</span>
                  <StatusPill status={p.status} label={p.statusLabel} />
                </div>
                <h3>{p.name}</h3>
                <p className="prod-sub">{p.summary}</p>
                <div className="prod-actions btn-row">
                  <Link href={`/products/${p.slug}`} className="btn btn-outline">
                    Full detail
                    <span className="arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                  {p.liveUrl ? (
                    <a
                      href={p.liveUrl}
                      className="btn btn-ghost"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {p.liveLabel}
                      <span className="arrow" aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  ) : null}
                </div>
              </div>

              <div>
                {p.screenshot ? (
                  <figure className="shot">
                    <Image
                      src={p.screenshot.src}
                      alt={p.screenshot.alt}
                      width={p.screenshot.width}
                      height={p.screenshot.height}
                      sizes="(max-width: 980px) 92vw, 620px"
                    />
                    <figcaption className="shot-cap">{p.screenshot.caption}</figcaption>
                  </figure>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}