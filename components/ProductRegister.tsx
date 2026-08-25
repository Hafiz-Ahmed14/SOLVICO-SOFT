import Link from "next/link";
import StatusPill from "./StatusPill";
import { products } from "@/content/products";

/**
 * The signature element. A product register rather than a hero illustration:
 * these systems exist to replace registers, so the site opens with one. The
 * status column is the honest part — one product is live, two are not.
 */
export default function ProductRegister() {
  return (
    <div className="reg">
      <div className="reg-head">
        <span>Product</span>
        <span>Status</span>
      </div>

      {products.map((p, i) => (
        <Link
          key={p.slug}
          href={`/products/${p.slug}`}
          className="reg-row reg-row-anim card-link"
          style={{ animationDelay: `${180 + i * 90}ms` }}
        >
          <span>
            <span className="reg-name">{p.name}</span>
            <span className="reg-desc">{p.oneLine}</span>
          </span>
          <StatusPill status={p.status} label={p.statusLabel} />
        </Link>
      ))}

      <div className="reg-foot">
        Three products, built and maintained by us — not built to order.
      </div>
    </div>
  );
}
