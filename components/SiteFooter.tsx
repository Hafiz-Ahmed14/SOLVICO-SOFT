import Link from "next/link";
import { products } from "@/content/products";
import { site } from "@/content/site";
import Image from "next/image";
import { FaFacebook, FaYoutube, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="ftr">
      <div className="wrap ftr-grid">
        {/* ---- column 1: brand + blurb + social ---- */}
        <div>
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
          <p className="ftr-blurb">
            We build our own software for universities and colleges, and keep it running.
            Based in {site.contact.locality}, {site.contact.country}.
          </p>
          <div className="ftr-social">
            <a href={site.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href={site.social.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
              <FaYoutube />
            </a>
            <a href={site.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
          </div>
        </div>

        {/* ---- column 2: products ---- */}
        <div>
          <h4>Products</h4>
          <ul className="ftr-list">
            {products.map((p) => (
              <li key={p.slug}>
                <Link href={`/products/${p.slug}`}>{p.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ---- column 3: company ---- */}
        <div>
          <h4>Company</h4>
          <ul className="ftr-list">
            <li>
              <Link href="/products">All products</Link>
            </li>
           
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        {/* ---- column 4: get in touch with icons ---- */}
        <div>
          <h4>Get in touch</h4>
          <ul className="ftr-list">
            <li>
              <FaEnvelope className="ftr-icon" />
              <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
            </li>
            <li>
              <FaPhone className="ftr-icon" />
              <a href={`tel:${site.contact.phoneHref}`}>{site.contact.phone}</a>
            </li>
            <li>
              <FaMapMarkerAlt className="ftr-icon" />
              <span>
                {site.contact.addressLines.map((line) => (
                  <span className="addr-line" key={line}>
                    {line}
                  </span>
                ))}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="wrap">
        <div className="ftr-bar">
          <span>
            Copyright © {year} All Rights Reserved by {site.legalName}
          </span>
          <span>Founded {site.founded} · {site.social.handle}</span>
        </div>
      </div>
    </footer>
  );
}