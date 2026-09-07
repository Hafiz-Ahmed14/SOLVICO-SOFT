"use client";

import Image from "next/image";
import Link from "next/link";
import AttainmentMatrix from "@/components/AttainmentMatrix";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import RotatingText from "@/components/RotatingText";
import StatusPill from "@/components/StatusPill";
import HomeAbout from "@/components/HomeAbout";
import { products } from "@/content/products";
import { site } from "@/content/site";
import * as SiIcons from "react-icons/si";
import { 
  FaUniversity, 
  FaGraduationCap, 
  FaBuilding, 
  FaCogs, 
  FaChartBar, 
  FaCode 
} from "react-icons/fa";

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

      {/* ---- WHAT WE SERVE SECTION ---- */}
      <section className="services-section">
        <div className="wrap">
          <div className="services-header">
            <Eyebrow>WHAT WE SERVE</Eyebrow>
            <h2>Our Service Categories</h2>
            <p className="lead">
              We provide comprehensive software solutions across multiple domains to meet the 
              diverse needs of educational institutions and organizations.
            </p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon-wrapper">
                <FaUniversity className="service-icon" />
              </div>
              <h3>Institutional Management</h3>
              <p>Complete management solutions for educational institutions including student records, staff management, and administrative operations.</p>
            </div>

            <div className="service-card">
              <div className="service-icon-wrapper">
                <FaGraduationCap className="service-icon" />
              </div>
              <h3>Academic & Educational Solutions</h3>
              <p>Outcome-based education systems, curriculum management, assessment tracking, and accreditation support tools.</p>
            </div>

            <div className="service-card">
              <div className="service-icon-wrapper">
                <FaBuilding className="service-icon" />
              </div>
              <h3>Business Management Systems</h3>
              <p>Enterprise resource planning, hall management, resource allocation, and operational management systems.</p>
            </div>

            <div className="service-card">
              <div className="service-icon-wrapper">
                <FaCogs className="service-icon" />
              </div>
              <h3>Workflow Automation</h3>
              <p>Streamline repetitive tasks with automated workflows that reduce manual effort and improve operational efficiency.</p>
            </div>

            <div className="service-card">
              <div className="service-icon-wrapper">
                <FaChartBar className="service-icon" />
              </div>
              <h3>Data & Analytics</h3>
              <p>Centralized reporting dashboards, data visualization, and analytics tools to track performance and make informed decisions.</p>
            </div>

            <div className="service-card">
              <div className="service-icon-wrapper">
                <FaCode className="service-icon" />
              </div>
              <h3>Custom Software Development</h3>
              <p>Tailored software solutions built to address specific institutional needs and integrate with existing systems.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- OUR PROJECTS SECTION - Combined with Products ---- */}
      <section className="band" id="projects">
        <div className="wrap">
          <Eyebrow>OUR PROJECTS</Eyebrow>
          <h2 className="projects-title">Projects We have Worked</h2>
          <p className="projects-description">
            SolvicoSoft's software runs in universities and colleges across Bangladesh. 
            Our clients range from residential halls to academic departments and institutions. 
            These organizations use our systems for their core daily operations, including 
            student meal management, academic outcome tracking, and career preparation.
          </p>

          <div className="products-grid">
            {products.map((p) => (
              <div className="product-card" key={p.slug}>
                <div className="product-card-header">
                  <span className="product-code">{p.code}</span>
                  <StatusPill status={p.status} label={p.statusLabel} />
                </div>
                <h3 className="product-card-title">{p.fullName}</h3>
                
                {p.screenshot ? (
                  <div className="product-card-image">
                    <Image
                      src={p.screenshot.src}
                      alt={p.screenshot.alt}
                      width={p.screenshot.width}
                      height={p.screenshot.height}
                      sizes="(max-width: 980px) 100vw, 33vw"
                    />
                  </div>
                ) : null}

                <div className="product-card-actions">
                  <Link href={`/products/${p.slug}`} className="btn btn-outline product-card-btn">
                    {p.name} in detail
                    <span className="arrow" aria-hidden="true">→</span>
                  </Link>
                  {p.liveUrl ? (
                    <a
                      href={p.liveUrl}
                      className="btn btn-ghost product-card-link"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {p.liveLabel}
                      <span className="arrow" aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="products-view-all">
            <Link href="/products" className="btn btn-solid">
              View All Products
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
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