const routes = [
  ["/", "app/page.js", {}],
  ["/products", "app/products/page.js", {}],
  ["/about", "app/about/page.js", {}],
  ["/contact", "app/contact/page.js", {}],
  ["/404", "app/not-found.js", {}],
  ...productSlugs.map((s) => [`/products/${s}`, "app/products/[slug]/page.js", { slug: s }]),
  ["/products/does-not-exist", "app/products/[slug]/page.js", { slug: "does-not-exist" }],
];