"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Headphones,
  House,
  Keyboard,
  Laptop,
  Package,
  Search,
  SlidersHorizontal,
  Tv,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { catalogStorageKey, products, type Product } from "@/lib/catalog";
import { productCategories as catalogCategories } from "@/lib/categories";
import "./shop.css";

const categoryIcons: Record<string, LucideIcon> = {
  Audio: Headphones,
  Computers: Laptop,
  Accessories: Keyboard,
  "Smart home": House,
  "LED TVs": Tv,
  "LED TVs & Television Accessories": Tv,
};
const productCategories = Array.from(
  new Set([
    ...products.map((product) => product.category),
    ...catalogCategories,
  ]),
);

function readProducts(): Product[] {
  if (typeof window === "undefined") return products;
  const saved = window.localStorage.getItem(catalogStorageKey);
  if (!saved) return products;
  try {
    return JSON.parse(saved) as Product[];
  } catch {
    return products;
  }
}

export default function ShopPage() {
  const [catalog] = useState<Product[]>(readProducts);
  const [category, setCategory] = useState(() => {
    if (typeof window === "undefined") return "All";
    const requestedCategory = new URLSearchParams(window.location.search).get(
      "category",
    );
    return requestedCategory && productCategories.includes(requestedCategory)
      ? requestedCategory
      : "All";
  });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [onlySale, setOnlySale] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("focus") === "search")
      document
        .querySelector<HTMLInputElement>(
          'input[placeholder="Search products, specs, categories"]',
        )
        ?.focus();
  }, []);

  const visibleProducts = useMemo(() => {
    const filtered = catalog.filter((product) => {
      const categoryMatch = category === "All" || product.category === category;
      const searchMatch =
        `${product.name} ${product.detail} ${product.category}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const saleMatch =
        !onlySale ||
        Boolean(product.oldPrice && product.oldPrice > product.price);
      return !product.sold && categoryMatch && searchMatch && saleMatch;
    });
    if (sort === "low") filtered.sort((a, b) => a.price - b.price);
    if (sort === "high") filtered.sort((a, b) => b.price - a.price);
    if (sort === "sale")
      filtered.sort(
        (a, b) => Number(Boolean(b.oldPrice)) - Number(Boolean(a.oldPrice)),
      );
    return filtered;
  }, [catalog, category, search, sort, onlySale]);

  return (
    <main className="shop-page">
      <header className="shop-page-header">
        <Link href="/" className="shop-back">
          <ArrowLeft size={16} /> Storefront
        </Link>
        <div className="shop-brand">
          <span>ME</span>
          <strong>Mustafa Electronics</strong>
        </div>
      </header>
      <section className="shop-page-intro">
        <p className="shop-kicker">MUSTAFA ELECTRONICS / CATALOGUE</p>
        <h1>
          Find your next
          <br />
          <em>favorite.</em>
        </h1>
        <p>
          Browse our complete electronics catalogue with practical specs, clear
          prices, and delivery across Pakistan.
        </p>
      </section>
      <section className="shop-workspace">
        <aside className="shop-sidebar">
          <div className="sidebar-title">
            <strong>Categories</strong>
            <span>{productCategories.length}</span>
          </div>
          <button
            className={category === "All" ? "active" : ""}
            onClick={() => setCategory("All")}
          >
            All products
          </button>
          {productCategories.map((item) => {
            const Icon = categoryIcons[item] ?? Package;
            return (
              <button
                className={category === item ? "active" : ""}
                key={item}
                onClick={() => setCategory(item)}
              >
                <Icon size={16} />
                {item}
              </button>
            );
          })}
        </aside>
        <div className="shop-results">
          <div className="shop-toolbar">
            <label className="shop-search">
              <Search size={17} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products, specs, categories"
              />
            </label>
            <div className="shop-sort">
              <button
                className={onlySale ? "sale-filter active" : "sale-filter"}
                onClick={() => setOnlySale(!onlySale)}
              >
                Sale items
              </button>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                aria-label="Sort products"
              >
                <option value="featured">Featured</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
                <option value="sale">On sale first</option>
              </select>
            </div>
          </div>
          <div className="shop-result-heading">
            <span>{visibleProducts.length} products</span>
            {category !== "All" && (
              <button onClick={() => setCategory("All")}>
                Clear category ×
              </button>
            )}
          </div>
          <div className="shop-product-grid">
            {visibleProducts.length ? (
              visibleProducts.map((product) => {
                const Icon = categoryIcons[product.category] ?? Package;
                return (
                  <article className="shop-product-card" key={product.id}>
                    <div className="shop-product-art">
                      <Icon size={92} strokeWidth={1.2} />
                      {product.badge && <span>{product.badge}</span>}
                    </div>
                    <div className="shop-product-info">
                      <p>{product.category}</p>
                      <h2>{product.name}</h2>
                      <small>{product.detail}</small>
                      <div className="shop-product-bottom">
                        <strong>Rs. {product.price.toLocaleString()}</strong>
                        {product.oldPrice && (
                          <del>Rs. {product.oldPrice.toLocaleString()}</del>
                        )}
                        <button aria-label={`View ${product.name}`}>
                          View product <span>→</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="shop-empty">
                <SlidersHorizontal size={30} />
                <h2>No products found</h2>
                <p>Try another category or search term.</p>
                <button
                  onClick={() => {
                    setCategory("All");
                    setSearch("");
                    setOnlySale(false);
                  }}
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      <footer className="shop-page-footer">
        <span>Original products</span>
        <span>Cash on delivery</span>
        <span>Official warranty</span>
        <span>Delivery across Pakistan</span>
      </footer>
    </main>
  );
}
