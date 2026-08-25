import type { ProductStatus } from "@/content/products";

type Props = { status: ProductStatus; label: string };

/** Mint is reserved for "running in production". Nothing else earns it. */
export default function StatusPill({ status, label }: Props) {
  const live = status === "live";
  return (
    <span className={live ? "status status-live" : "status"}>
      <span className="status-dot" aria-hidden="true" />
      {label}
    </span>
  );
}
