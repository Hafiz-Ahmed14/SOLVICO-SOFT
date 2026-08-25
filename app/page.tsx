"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AttainmentMatrix from "@/components/AttainmentMatrix";
import Eyebrow from "@/components/Eyebrow";
import ProductRegister from "@/components/ProductRegister";
import Reveal from "@/components/Reveal";
import RotatingText from "@/components/RotatingText";
import StatusPill from "@/components/StatusPill";
import HomeAbout from "@/components/HomeAbout";  // <-- ADD THIS
import { products } from "@/content/products";
import { site } from "@/content/site";
import * as SiIcons from "react-icons/si";

const hmms = products[0];

export default function HomePage() {
  return (
    <>
      {/* ---- HERO ---- */}
      <section className="hero-full">
        <div className="wrap">
          <div className="hero-full-content">
            <div className="hero-full-eyebrow">
              Software Product Company · Founded 2025 · Dhaka, Bangladesh
            </div>

            <RotatingText
              items={site.rotatingItems}
              interval={4000}
            />

            <Link href="/products" className="btn-hero-full">
              Our Services →
            </Link>
          </div>
        </div>
      </section>

      {/* ---- ABOUT SECTION - ON HOME PAGE ---- */}
      <HomeAbout />

      {/* ---- Products Section ---- */}
      <section className="band" id="products">
        <div className="wrap">
          <Eyebrow>Products</Eyebrow>

          {products.map((p) => (
            <Reveal as="section" className="prod" key={p.slug}>
              <div>
                <div className="prod-kicker">
                  <span className="prod-code">{p.code}</span>
                  <StatusPill status={p.status} label={p.statusLabel} />
                </div>
                <h3>{p.fullName}</h3>
                <p className="prod-sub">{p.summary}</p>
                <div className="prod-actions btn-row">
                  <Link href={`/products/${p.slug}`} className="btn btn-outline">
                    {p.name} in detail
                    <span className="arrow" aria-hidden="true">→</span>
                  </Link>
                  {p.liveUrl ? (
                    <a
                      href={p.liveUrl}
                      className="btn btn-ghost"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {p.liveLabel}
                      <span className="arrow" aria-hidden="true">↗</span>
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
                ) : (
                  <AttainmentMatrix />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- Technology Stack ---- */}
      <section className="band tech-stack-section">
        <div className="wrap">
          <div className="tech-stack-header">
            <Eyebrow>Technology Stack</Eyebrow>
            <h2>Built with modern tools</h2>
            <p className="lead">
              From frontend to backend, database to DevOps – we use the right tools for the job.
            </p>
          </div>

          <div className="tech-stack-grid">
            {site.technologies.map((tech, index) => {
              const IconComponent = SiIcons[tech.icon as keyof typeof SiIcons];
              return (
                <div key={index} className="tech-badge">
                  {IconComponent ? (
                    <IconComponent className="tech-icon" />
                  ) : (
                    <span className="tech-icon-placeholder">⚙️</span>
                  )}
                  <span className="tech-name">{tech.name}</span>
                  <span className="tech-category">{tech.category}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- User Stories ---- */}
      <section className="band testimonials-section">
        <div className="wrap">
          <div className="testimonials-header">
            <h2>What Our Users Say</h2>
            <p className="lead">
              Hear from students and staff about their experience with our system
            </p>
          </div>

          <div className="testimonials-grid">
            {site.testimonials.map((t, index) => (
              <div key={index} className="testimonial-card">
                <div className="quote-icon">"</div>
                <p className="testimonial-quote">{t.quote}</p>
                <div className="testimonial-footer">
                  <div className="testimonial-user">
                    <span className="testimonial-name">{t.name}</span>
                    <span className="testimonial-role">{t.role}</span>
                  </div>
                  <div className="testimonial-rating">
                    <span className="stars">
                      {"★".repeat(Math.floor(t.rating))}
                      {t.rating % 1 !== 0 ? "½" : ""}
                    </span>
                    <span className="rating-number">{t.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Demo CTA ---- */}
      <section className="demo-cta">
        <div className="wrap">
          <div className="demo-cta-content">
            <h2>{site.demoCta.heading}</h2>
            <p className="lead">{site.demoCta.body}</p>
            <div className="btn-row">
              <Link href="/contact" className="btn btn-solid">
                {site.demoCta.buttonLabel}
                <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}