import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AttainmentMatrix from "@/components/AttainmentMatrix";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import StatusPill from "@/components/StatusPill";
import { getProduct, products, productSlugs } from "@/content/products";
import { site } from "@/content/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return productSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: product.fullName,
    description: `${product.oneLine} ${product.statusLabel}. Built and maintained by ${site.name}.`,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.fullName} — ${site.name}`,
      description: product.oneLine,
      images: product.screenshot ? [{ url: product.screenshot.src }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const others = products.filter((p) => p.slug !== product.slug);

  return (
    <>
      {/* ---- head: claim on the left, facts on the right ---------------- */}
      <section className="band-tight">
        <div className="wrap split">
          <div>
            <Eyebrow>{product.code}</Eyebrow>
            <h1>{product.fullName}</h1>
            <p className="lead">{product.summary}</p>
            <div className="actions btn-row">
              {product.liveUrl ? (
                <a
                  href={product.liveUrl}
                  className="btn btn-solid"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open {product.liveLabel}
                  <span className="arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              ) : null}
              <Link
                href="/contact"
                className={product.liveUrl ? "btn btn-outline" : "btn btn-solid"}
              >
                {product.status === "live" ? "Request access" : "Ask about the timeline"}
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </div>

          <dl className="spec">
            <div className="spec-row">
              <dt className="spec-k">Status</dt>
              <dd className="spec-v">
                <StatusPill status={product.status} label={product.statusLabel} />
              </dd>
            </div>
            <div className="spec-row">
              <dt className="spec-k">Where it stands</dt>
              <dd className="spec-v">{product.since}</dd>
            </div>
            <div className="spec-row">
              <dt className="spec-k">Built for</dt>
              <dd className="spec-v">{product.audience}</dd>
            </div>
            <div className="spec-row">
              <dt className="spec-k">Stack</dt>
              <dd className="spec-v spec-v-mono">
                {site.stack.map((s) => s.v).join(" · ")}
              </dd>
            </div>
            <div className="spec-row">
              <dt className="spec-k">Maintained by</dt>
              <dd className="spec-v">
                {site.name} — {site.contact.locality}, {site.contact.country}
              </dd>
            </div>
          </dl>
        </div>

        {/* the artifact: a screenshot, or the matrix the product produces */}
        <div className="wrap">
          {product.screenshot ? (
            <Reveal className="block-gap">
              <figure className="shot">
                <Image
                  src={product.screenshot.src}
                  alt={product.screenshot.alt}
                  width={product.screenshot.width}
                  height={product.screenshot.height}
                  priority
                  sizes="(max-width: 1180px) 92vw, 1100px"
                />
                <figcaption className="shot-cap">{product.screenshot.caption}</figcaption>
              </figure>
            </Reveal>
          ) : product.showMatrix ? (
            <Reveal className="block-gap">
              <AttainmentMatrix />
            </Reveal>
          ) : null}
        </div>
      </section>

      {/* ---- capabilities ---------------------------------------------- */}
      <section className="band band-sunken">
        <div className="wrap">
          <Eyebrow>What it does</Eyebrow>
          <div className="head-split">
            <h2>Capabilities</h2>
            <p className="lead">
              Everything listed here is either shipped or actively being built. Nothing on this
              page is a roadmap item dressed up as a feature.
            </p>
          </div>

          <div className="caps">
            {product.capabilities.map((c) => (
              <div className="cap" key={c.title}>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- role portals ---------------------------------------------- */}
      {product.roles.length ? (
        <section className="band">
          <div className="wrap">
            <Eyebrow>Who uses it</Eyebrow>
            <div className="head-split">
              <h2>
                {product.roles.length} portals, one system
              </h2>
              <p className="lead">
                Each role sees only the screens it needs. The permissions are the design, not a
                setting somebody has to remember to switch on.
              </p>
            </div>

            <div className="roles">
              {product.roles.map((role) => (
                <div className="role" key={role.name}>
                  <p className="role-name">{role.name}</p>
                  <ul className="role-list">
                    {role.items.map((item) => (
                      <li className="role-item" key={item}>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ---- the rest of the catalogue --------------------------------- */}
      <section className="band-tight band-ruled">
        <div className="wrap">
          <div className="reg">
            <div className="reg-head">
              <span>Also from us</span>
              <span>Status</span>
            </div>
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/products/${o.slug}`}
                className="reg-row card-link"
              >
                <span>
                  <span className="reg-name">{o.name}</span>
                  <span className="reg-desc">{o.oneLine}</span>
                </span>
                <StatusPill status={o.status} label={o.statusLabel} />
              </Link>
            ))}
            <div className="reg-foot">
              <Link href="/products">See the full catalogue →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---- close ----------------------------------------------------- */}
      <section className="band band-dark">
        <div className="wrap cta-row">
          <div>
            <Eyebrow>Next step</Eyebrow>
            <h2>
              {product.status === "live"
                ? `Run ${product.name} at your institution`
                : `Be first on ${product.name}`}
            </h2>
            <p className="lead">
              {product.status === "live"
                ? "We set up your instance, load the records you already keep, and walk your staff through it."
                : "Tell us about your department and we will let you know when it is ready — and shape it around what you actually need to report."}
            </p>
          </div>
          <div className="btn-row">
            <Link href="/contact" className="btn btn-solid">
              Get in touch
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </Link>
            <a href={`mailto:${site.contact.email}`} className="btn btn-outline">
              {site.contact.email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
