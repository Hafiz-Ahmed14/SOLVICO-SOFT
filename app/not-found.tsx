import Link from "next/link";
import Eyebrow from "@/components/Eyebrow";
import ProductRegister from "@/components/ProductRegister";
import { site } from "@/content/site";

export default function NotFound() {
  return (
    <section className="band">
      <div className="wrap hero-grid">
        <div>
          <Eyebrow>404</Eyebrow>
          <h1>Nothing at that address</h1>
          <p className="lead">
            The page you asked for isn&rsquo;t here. {site.name} only has three products, so the
            register on the right is very close to the whole site.
          </p>
          <div className="actions btn-row">
            <Link href="/" className="btn btn-solid">
              Back to the start
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </Link>
            <Link href="/contact" className="btn btn-outline">
              Tell us what you were looking for
            </Link>
          </div>
        </div>

        <ProductRegister />
      </div>
    </section>
  );
}