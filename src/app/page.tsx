"use client";

import Image from "next/image";
import { ArrowLeftRight, Headphones, House, Keyboard, Laptop, Package, Tv, Wrench, type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { products } from "@/lib/catalog";
import { productCategories } from "@/lib/categories";
import "./category-directory.css";
import "./tv-services.css";

const categories = [
  { name: "Audio", detail: "Hear more, carry less" },
  { name: "Computers", detail: "Work in your flow" },
  { name: "Accessories", detail: "Little upgrades, big impact" },
  { name: "Smart home", detail: "Make space smarter" },
  { name: "LED TVs", detail: "Watch, upgrade, enjoy" },
];

const categoryIcons: Record<string, LucideIcon> = {
  Audio: Headphones,
  Computers: Laptop,
  Accessories: Keyboard,
  "Smart home": House,
  "LED TVs": Tv,
  "LED TVs & Television Accessories": Tv,
};

const promotions = [
  { label: "POWER WEEK", title: "Charge faster. Carry less.", detail: "Save up to 25% on fast chargers and USB-C essentials.", action: "Shop chargers", visual: "⚡", tone: "mint" },
  { label: "DESK RESET", title: "Build a setup you love.", detail: "Smart upgrades for focused work, play, and everything between.", action: "Explore desk tech", visual: "▤", tone: "blue" },
  { label: "WEEKEND AUDIO", title: "Bring the good sound.", detail: "Portable speakers and headphones picked for every plan.", action: "Shop audio", visual: "◉", tone: "peach" },
];

export default function Home() {
  const router = useRouter();
  const [cart] = useState<typeof products>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [activePromotion, setActivePromotion] = useState(0);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "light";
    const savedTheme = window.localStorage.getItem("mustafa-theme");
    return savedTheme === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("mustafa-theme", theme);
  }, [theme]);

  const chooseCategory = (category: string) => {
    router.push(`/shop?category=${encodeURIComponent(category)}`);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const promotion = promotions[activePromotion];
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Mustafa Electronics",
    description: "Buy electronics, mobile accessories, chargers, audio, computer accessories and smart gadgets in Pakistan.",
    potentialAction: { "@type": "SearchAction", target: "https://mustafa-electronics.pk/?search={search_term_string}", "query-input": "required name=search_term_string" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="announcement">Free delivery on orders over Rs. 3,000 <span>•</span> Cash on delivery available nationwide <a href="#shop">Shop deals ↗</a></div>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Mustafa Electronics home">
          <Image src="/resources/hamza.... (2).png" alt="" width={40} height={40} priority />
          <span>Mustafa <strong>Electronics</strong></span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a className="active" href="/shop">Shop</a>
          <a href="#categories">Categories</a>
          <a href="#shop">Chargers</a>
          <a href="#shop">Phone accessories</a>
          <a href="#tv-led">LED TVs</a>
          <a href="#why-us">Why us</a>
        </nav>
        <div className="top-actions">
          <button className="icon-button" aria-label="Focus product search" onClick={() => document.querySelector<HTMLInputElement>("#product-search")?.focus()}>⌕</button>
          <button className="theme-button" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}><span>{theme === "dark" ? "☼" : "☾"}</span><small>{theme === "dark" ? "Light" : "Dark"}</small></button>
          <button className="cart-button" onClick={() => setCartOpen(true)}>Cart <span className="cart-count">{cart.length}</span></button>
        </div>
      </header>
      <div className="trust-strip"><span>✓ Original products</span><span>▣ Official warranty</span><span>↗ Fast delivery across Pakistan</span><span>◌ Easy returns</span></div>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Mustafa Electronics promotions</p>
            <h1>Good tech.<br /><em>Better offers.</em></h1>
            <p className="hero-text">Fresh picks, practical upgrades, and limited-time deals for the way you live and work.</p>
            <div className="hero-actions"><a className="button primary" href="/shop">Shop all deals <span>↗</span></a><a className="text-link" href="#categories">Browse categories <span>↓</span></a></div>
            <div className="hero-proof"><span>✓</span> Cash on delivery <span>•</span> Official warranty <span>•</span> Nationwide delivery</div>
          </div>
          <div className={`hero-promotion ${promotion.tone}`}>
            <div className="promo-copy"><span className="promo-label">{promotion.label}</span><h2>{promotion.title}</h2><p>{promotion.detail}</p><a className="promo-link" href="#shop">{promotion.action} <span>↗</span></a></div>
            <div className="promo-visual" aria-hidden="true"><span>{promotion.visual}</span><small>LIMITED<br />OFFER</small></div>
            <div className="slider-controls"><button onClick={() => setActivePromotion((activePromotion + promotions.length - 1) % promotions.length)} aria-label="Previous promotion">←</button>{promotions.map((item, index) => <button className={index === activePromotion ? "active" : ""} onClick={() => setActivePromotion(index)} aria-label={`Show promotion ${index + 1}`} key={item.label} />)}<button onClick={() => setActivePromotion((activePromotion + 1) % promotions.length)} aria-label="Next promotion">→</button></div>
          </div>
        </section>

        <section className="promotion-row" aria-label="Current promotions">
          <div><span className="promo-icon">▣</span><strong>Free delivery</strong><small>On orders over Rs. 3,000</small></div>
          <div><span className="promo-icon">%</span><strong>Weekly price drops</strong><small>New deals every Friday</small></div>
          <div><span className="promo-icon">↺</span><strong>Shop with confidence</strong><small>30-day easy returns</small></div>
        </section>

        <section className="tv-led-section" id="tv-led" aria-labelledby="tv-led-heading">
          <div className="tv-led-intro"><p className="eyebrow"><span /> Mustafa TV & LED center</p><h2 id="tv-led-heading">Buy it. Sell it.<br /><em>Repair it.</em></h2><p>From your next screen to a trusted repair, our LED lab helps you get more from your home entertainment setup.</p><a className="button primary" href="#shop">Shop TV accessories <span>↗</span></a></div>
          <div className="tv-led-services"><article><span className="tv-service-icon"><Tv size={25} /></span><h3>Buy LED TV</h3><p>Find the right screen, cables, mounts, and setup essentials.</p><button onClick={() => chooseCategory("LED TVs & Television Accessories")}>Browse TV category <span>→</span></button></article><article><span className="tv-service-icon"><ArrowLeftRight size={25} /></span><h3>Sell or upgrade</h3><p>Bring your old LED TV for a fair evaluation and upgrade path.</p><a href="mailto:sales@mustafa-electronics.pk">Request evaluation <span>→</span></a></article><article><span className="tv-service-icon"><Wrench size={25} /></span><h3>LED repair lab</h3><p>Panel, power, backlight, HDMI, and display troubleshooting by appointment.</p><a href="tel:+923000000000">Book a repair <span>→</span></a></article></div>
        </section>

        <section className="category-section" id="categories">
          <div className="section-heading"><div><p className="eyebrow">Find your next favorite</p><h2>Shop by category</h2></div><a className="text-link" href="#shop">View all <span>↗</span></a></div>
          <div className="category-grid">{categories.map(({ name, detail }) => { const Icon = categoryIcons[name]; return <button className={`category-card ${name === "Audio" ? "teal-card" : ""}`} key={name} onClick={() => chooseCategory(name)}><span className="category-icon"><Icon size={34} strokeWidth={1.8} /></span><strong>{name}</strong><small>{detail}</small><span className="category-arrow">↗</span></button>; })}</div>
        </section>

        <section className="category-directory" aria-labelledby="all-categories-heading">
          <div className="section-heading"><div><p className="eyebrow">Browse the full catalogue</p><h2 id="all-categories-heading">All product categories</h2></div><span className="category-count">{productCategories.length} categories</span></div>
          <div className="category-directory-grid">{productCategories.map((category) => { const Icon = categoryIcons[category] ?? Package; return <button className="directory-link" key={category} onClick={() => chooseCategory(category)}><Icon size={17} /><span>{category}</span><small>→</small></button>; })}</div>
        </section>

        <section className="shop-summary" id="shop">
          <div><p className="eyebrow">Good stuff, no guesswork</p><h2>Fresh in the shop</h2><p>Browse chargers, audio, computers, LED TVs, mobile accessories, and 30+ more categories in the full catalogue.</p></div>
          <div className="shop-summary-actions"><span><strong>{productCategories.length}</strong> categories</span><span><strong>PKR</strong> clear pricing</span><a className="button primary" href="/shop">View full catalogue <span>↗</span></a></div>
        </section>

        <section className="brand-section" id="why-us"><div className="brand-image"><Image src="/resources/bf540b2c-c4fd-4264-8fd1-035ece7117f3.png" alt="Mustafa Electronics logo" fill sizes="(max-width: 800px) 90vw, 40vw" /></div><div className="brand-copy"><p className="eyebrow">A better way to buy tech</p><h2>Great gear should feel <em>simple.</em></h2><p>We choose practical, well-made tech and keep the experience human. Clear specs. Fair prices. Help from people who actually know the difference.</p><div className="brand-stats"><div><strong>4.9/5</strong><span>customer rating</span></div><div><strong>24h</strong><span>dispatch promise</span></div><div><strong>30</strong><span>day returns</span></div></div></div></section>

      </main>

      <footer><a className="brand footer-brand" href="#top"><Image src="/resources/hamza.... (2).png" alt="" width={32} height={32} /><span>Mustafa <strong>Electronics</strong></span></a><span>Tech today - Better tomorrow</span><span>© 2026 Mustafa Electronics</span></footer>

      <aside className={`cart-drawer ${cartOpen ? "open" : ""}`} aria-label="Shopping cart" aria-hidden={!cartOpen}><div className="drawer-header"><div><p className="eyebrow">Your picks</p><h2>Your cart</h2></div><button className="close-button" onClick={() => setCartOpen(false)} aria-label="Close cart">×</button></div><div className="cart-items">{cart.length ? cart.map((item, index) => <div className="cart-item" key={`${item.id}-${index}`}><span className="cart-item-visual">{item.visual}</span><div className="cart-item-info"><strong>{item.name}</strong><small>{item.category} - Rs. {item.price.toLocaleString()}</small></div></div>) : <p className="empty-cart">Your cart is waiting for something good.</p>}</div><div className="cart-footer"><div><span>Subtotal</span><strong>Rs. {total.toLocaleString()}</strong></div><button className="button primary" onClick={() => window.alert("Thanks for trying the demo. Checkout is ready to connect.")}>Checkout <span>↗</span></button></div></aside><button className={`drawer-backdrop ${cartOpen ? "open" : ""}`} aria-label="Close cart" onClick={() => setCartOpen(false)} />
    </>
  );
}
