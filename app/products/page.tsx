import type { Metadata } from "next";
import Link from "next/link";
import Eyebrow from "@/components/Eyebrow";
import ProductRegister from "@/components/ProductRegister";
import Reveal from "@/components/Reveal";
import StatusPill from "@/components/StatusPill";
import { products } from "@/content/products";
import { site } from "@/content/site";

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

          <div className="block-gap">
            <ProductRegister />
          </div>
        </div>
      </section>

      <section className="band band-sunken">
        <div className="wrap">
          <Eyebrow>Datasheets</Eyebrow>
          <div className="head-split">
            <h2>What each one does, and where it stands</h2>
            <p className="lead">
              One of the three is in production today. We would rather say that plainly than
              describe all three as though they were finished.
            </p>
          </div>

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

              <dl className="spec">
                <div className="spec-row">
                  <dt className="spec-k">Full name</dt>
                  <dd className="spec-v">{p.fullName}</dd>
                </div>
                <div className="spec-row">
                  <dt className="spec-k">Built for</dt>
                  <dd className="spec-v">{p.audience}</dd>
                </div>
                <div className="spec-row">
                  <dt className="spec-k">Status</dt>
                  <dd className="spec-v">{p.since}</dd>
                </div>
                <div className="spec-row">
                  <dt className="spec-k">Capabilities</dt>
                  <dd className="spec-v">
                    {p.capabilities.map((c) => c.title).join(" · ")}
                  </dd>
                </div>
                <div className="spec-row">
                  <dt className="spec-k">{p.roles.length ? "Roles" : "Access"}</dt>
                  <dd className="spec-v">
                    {p.roles.length
                      ? `${p.roles.length} portals — ${p.roles.map((r) => r.name).join(", ")}`
                      : "Single user account, no institutional setup needed"}
                  </dd>
                </div>
              </dl>
            </Reveal>
          ))}
        </div>
      </section>

    </>
  );
}
