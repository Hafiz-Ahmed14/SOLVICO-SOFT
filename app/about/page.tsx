import type { Metadata } from "next";
import Link from "next/link";
import Eyebrow from "@/components/Eyebrow";
import { products } from "@/content/products";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name} is a software product company founded in ${site.founded} in ${site.contact.locality}. We build our own software for universities and keep it running.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section className="band-tight">
        <div className="wrap">
          <Eyebrow>About</Eyebrow>
          <h1>A software product company in {site.contact.locality}</h1>
          <p className="lead">
            {site.name} was founded in {site.founded} and works from{" "}
            {site.contact.locality}, {site.contact.country}. What we have is software of our
            own that is in use and that we answer for — not a service list.
          </p>
        </div>
      </section>

      <section className="band band-sunken">
        <div className="wrap split">
          <div>
            <Eyebrow>The model</Eyebrow>
            <h2>Why the distinction matters to you</h2>
            <div className="block-gap">
              {site.model.body.map((para, i) => (
                <p className="prose-p" key={i}>
                  {para}
                </p>
              ))}
            </div>
          </div>

          <div>
            <p className="note">Work we decline</p>
            <ul className="role-list">
              {site.declines.map((item) => (
                <li className="role-item" key={item}>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

     

      <section className="band band-sunken">
        <div className="wrap">
          <Eyebrow>The record</Eyebrow>
          <div className="head-split">
            <h2>What we will and won&rsquo;t claim</h2>
            <p className="lead">
              Being straight about scope is worth more than a longer capability list. So, for
              the record:
            </p>
          </div>

          <dl className="spec">
            <div className="spec-row">
              <dt className="spec-k">Founded</dt>
              <dd className="spec-v">
                {site.founded} — {site.contact.addressOneLine}, {site.contact.country}
              </dd>
            </div>
            <div className="spec-row">
              <dt className="spec-k">In production</dt>
              <dd className="spec-v">
                {products[0].name} is deployed and in daily use. Everything else in the
                catalogue is labelled with exactly where it stands, on its own page.
              </dd>
            </div>
            <div className="spec-row">
              <dt className="spec-k">Roles covered</dt>
              <dd className="spec-v">
                Every discipline the catalogue needs, listed on the{" "}
                <Link href="/member">member page</Link>.
              </dd>
            </div>
            <div className="spec-row">
              <dt className="spec-k">Stack</dt>
              <dd className="spec-v spec-v-mono">
                {site.stack.map((s) => s.v).join(" · ")}
              </dd>
            </div>
          </dl>
        </div>
      </section>

    </>
  );
}
