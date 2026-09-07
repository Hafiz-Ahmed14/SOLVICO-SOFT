import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import Eyebrow from "@/components/Eyebrow";
import { products } from "@/content/products";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Ask about running HMMS, OBE Framework or VitaCraft at your institution. ${site.contact.email} · ${site.contact.phone}`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const live = products.filter((p) => p.status === "live").length;

  return (
    <>
      <section className="band-tight">
        <div className="wrap contact-grid">
          <div>
            <Eyebrow>Contact</Eyebrow>
            <h1>Request access</h1>
            <p className="lead">
              Tell us which product and which institution. Because we only run our own
              software, there is nothing to scope and nothing to quote — the conversation is
              about your data and your dates.
            </p>

            <dl className="spec block-gap">
              <div className="spec-row">
                <dt className="spec-k">Email</dt>
                <dd className="spec-v spec-v-mono">
                  <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
                </dd>
              </div>
              <div className="spec-row">
                <dt className="spec-k">Phone</dt>
                <dd className="spec-v spec-v-mono">
                  <a href={`tel:${site.contact.phoneHref}`}>{site.contact.phone}</a>
                </dd>
              </div>
              <div className="spec-row">
                <dt className="spec-k">Where</dt>
                <dd className="spec-v">
                  {site.contact.addressLines.map((line) => (
                    <span className="addr-line" key={line}>
                      {line}
                    </span>
                  ))}
                </dd>
              </div>
              <div className="spec-row">
                <dt className="spec-k">Available now</dt>
                <dd className="spec-v">
                  {live} of {products.length} products is deployable today. On the rest we will
                  talk timelines rather than take a deposit.
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="band-tight band-ruled">
        <div className="wrap">
          <Eyebrow>Process</Eyebrow>
          <h2>What happens next</h2>
          <ol className="steps">
            <li className="step">
              <span className="step-n">01</span>
              <h3>We reply</h3>
              <p>
                We answer from {site.contact.email}, usually within a working day.
              </p>
            </li>
            <li className="step">
              <span className="step-n">02</span>
              <h3>You see it running</h3>
              <p>
                A walkthrough of the live deployment with your own questions, before anything is
                agreed.
              </p>
            </li>
            <li className="step">
              <span className="step-n">03</span>
              <h3>We set up your instance</h3>
              <p>
                Your institution, your users, your existing records loaded in — then training
                for the staff who will use it daily.
              </p>
            </li>
          </ol>
        </div>
      </section>
    </>
  );
}