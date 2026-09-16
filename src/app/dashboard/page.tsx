"use client";

import Link from "next/link";
import {
  BarChart3,
  Box,
  Check,
  ChevronDown,
  CircleDollarSign,
  LayoutDashboard,
  PackagePlus,
  Search,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  catalogStorageKey,
  deliveryStatuses,
  ordersStorageKey,
  products,
  starterOrders,
  type DeliveryStatus,
  type Order,
  type Product,
} from "@/lib/catalog";
import { productCategories } from "@/lib/categories";
import "./dashboard.css";
import "./dashboard-extras.css";

type DashboardTab = "overview" | "inventory" | "orders";
type ProductDraft = Omit<Product, "id" | "visual"> & { visual: string };

const emptyDraft: ProductDraft = {
  name: "",
  category: "Audio",
  price: 0,
  oldPrice: undefined,
  visual: "◉",
  badge: "NEW",
  detail: "",
};

function readProducts() {
  if (typeof window === "undefined") return products;
  const saved = window.localStorage.getItem(catalogStorageKey);
  if (!saved) return products;
  try {
    return JSON.parse(saved) as Product[];
  } catch {
    return products;
  }
}

function readOrders() {
  if (typeof window === "undefined") return starterOrders;
  const saved = window.localStorage.getItem(ordersStorageKey);
  if (!saved) return starterOrders;
  try {
    return JSON.parse(saved) as Order[];
  } catch {
    return starterOrders;
  }
}

export default function DashboardPage() {
  useEffect(() => {
    if (window.localStorage.getItem("mustafa-admin-session") !== "true")
      window.location.replace("/admin");
  }, []);
  const [tab, setTab] = useState<DashboardTab>("overview");
  const [catalog, setCatalog] = useState<Product[]>(readProducts);
  const [orders, setOrders] = useState<Order[]>(readOrders);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState("");

  const saveCatalog = (nextCatalog: Product[]) => {
    setCatalog(nextCatalog);
    window.localStorage.setItem(catalogStorageKey, JSON.stringify(nextCatalog));
  };

  const filteredProducts = useMemo(
    () =>
      catalog.filter((item) =>
        `${item.name} ${item.category}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [catalog, query],
  );
  const activeProducts = catalog.filter((item) => !item.sold).length;
  const saleProducts = catalog.filter(
    (item) => item.oldPrice && item.oldPrice > item.price,
  ).length;
  const pendingOrders = orders.filter(
    (order) => order.status === "Pending",
  ).length;

  const openNewProduct = () => {
    setEditingId(null);
    setDraft(emptyDraft);
    setShowForm(true);
  };
  const openEditProduct = (product: Product) => {
    setEditingId(product.id);
    setDraft({
      name: product.name,
      category: product.category,
      price: product.price,
      oldPrice: product.oldPrice,
      visual: product.visual,
      badge: product.badge,
      detail: product.detail,
    });
    setShowForm(true);
  };
  const saveProduct = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.name.trim() || !draft.price || !draft.detail.trim()) return;
    const nextProduct: Product = {
      ...draft,
      id: editingId ?? Date.now(),
      name: draft.name.trim(),
      detail: draft.detail.trim(),
      price: Number(draft.price),
      oldPrice: draft.oldPrice ? Number(draft.oldPrice) : undefined,
    };
    saveCatalog(
      editingId
        ? catalog.map((item) =>
            item.id === editingId ? { ...item, ...nextProduct } : item,
          )
        : [nextProduct, ...catalog],
    );
    setShowForm(false);
    setNotice(editingId ? "Product updated." : "Product added to inventory.");
  };
  const deleteProduct = (id: number) => {
    saveCatalog(catalog.filter((item) => item.id !== id));
    setNotice("Product deleted.");
  };
  const toggleSold = (id: number | Product) => {
    const productId = typeof id === "number" ? id : id.id;
    saveCatalog(
      catalog.map((item) =>
        item.id === productId
          ? {
              ...item,
              sold: !item.sold,
              badge: item.sold ? item.badge : "SOLD OUT",
            }
          : item,
      ),
    );
    setNotice("Stock status updated.");
  };
  const toggleSale = (product: Product) => {
    const onSale = Boolean(
      product.oldPrice && product.oldPrice > product.price,
    );
    saveCatalog(
      catalog.map((item) =>
        item.id === product.id
          ? {
              ...item,
              oldPrice: onSale ? undefined : Math.round(item.price * 1.2),
              badge: onSale ? "" : "SALE",
            }
          : item,
      ),
    );
    setNotice(onSale ? "Sale removed." : "Product marked on sale.");
  };
  const updateOrder = (id: string, status: DeliveryStatus) => {
    const nextOrders = orders.map((order) =>
      order.id === id ? { ...order, status } : order,
    );
    setOrders(nextOrders);
    window.localStorage.setItem(ordersStorageKey, JSON.stringify(nextOrders));
    setNotice(`Order ${id} moved to ${status}.`);
  };
  const logout = () => {
    window.localStorage.removeItem("mustafa-admin-session");
    window.location.replace("/admin");
  };

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <Link href="/" className="dashboard-brand">
          <span>ME</span>
          <strong>
            Mustafa
            <br />
            Electronics
          </strong>
        </Link>
        <nav className="dashboard-nav">
          <button
            className={tab === "overview" ? "active" : ""}
            onClick={() => setTab("overview")}
          >
            <LayoutDashboard size={17} /> Overview
          </button>
          <button
            className={tab === "inventory" ? "active" : ""}
            onClick={() => setTab("inventory")}
          >
            <Box size={17} /> Inventory
          </button>
          <button
            className={tab === "orders" ? "active" : ""}
            onClick={() => setTab("orders")}
          >
            <Truck size={17} /> Orders <b>{pendingOrders}</b>
          </button>
        </nav>
        <div className="dashboard-sidebar-actions">
          <Link href="/" className="back-store">
            ← View storefront
          </Link>
          <button className="logout-button" onClick={logout}>
            Log out
          </button>
        </div>
      </aside>
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-kicker">MUSTAFA ELECTRONICS / ADMIN</p>
            <h1>
              {tab === "overview"
                ? "Good morning, Mustafa."
                : tab === "inventory"
                  ? "Inventory"
                  : "Orders & delivery"}
            </h1>
            <p className="dashboard-subtitle">
              Manage products, promotions, stock, and customer deliveries in one
              place.
            </p>
          </div>
          <button className="dashboard-primary" onClick={openNewProduct}>
            <PackagePlus size={17} /> Add product
          </button>
        </header>
        {notice && (
          <div className="dashboard-notice">
            <Check size={16} /> {notice}
            <button
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {tab === "overview" && (
          <>
            <section className="metric-grid">
              <div className="metric-card">
                <span>
                  <CircleDollarSign size={18} /> Sales this month
                </span>
                <strong>Rs. 248,450</strong>
                <small>+18.4% from last month</small>
              </div>
              <div className="metric-card">
                <span>
                  <ShoppingBag size={18} /> Active products
                </span>
                <strong>{activeProducts}</strong>
                <small>{catalog.length - activeProducts} sold out</small>
              </div>
              <div className="metric-card">
                <span>
                  <BarChart3 size={18} /> On sale
                </span>
                <strong>{saleProducts}</strong>
                <small>Ready to promote</small>
              </div>
              <div className="metric-card">
                <span>
                  <Truck size={18} /> Open orders
                </span>
                <strong>{orders.length}</strong>
                <small>{pendingOrders} need attention</small>
              </div>
            </section>
            <section className="dashboard-section split-section">
              <div>
                <div className="section-top">
                  <div>
                    <p className="dashboard-kicker">QUICK ACTIONS</p>
                    <h2>Run your store</h2>
                  </div>
                </div>
                <div className="quick-actions">
                  <button onClick={openNewProduct}>
                    <PackagePlus size={20} />
                    <strong>Add new product</strong>
                    <small>Create an item with price and sale details</small>
                  </button>
                  <button onClick={() => setTab("inventory")}>
                    <CircleDollarSign size={20} />
                    <strong>Manage sales</strong>
                    <small>Mark products down or end promotions</small>
                  </button>
                  <button onClick={() => setTab("orders")}>
                    <Truck size={20} />
                    <strong>Update delivery</strong>
                    <small>Move orders from pending to delivered</small>
                  </button>
                </div>
              </div>
              <div className="recent-orders">
                <div className="section-top">
                  <div>
                    <p className="dashboard-kicker">RECENT ACTIVITY</p>
                    <h2>Orders to watch</h2>
                  </div>
                  <button
                    className="plain-link"
                    onClick={() => setTab("orders")}
                  >
                    View all →
                  </button>
                </div>
                {orders.slice(0, 3).map((order) => (
                  <div className="mini-order" key={order.id}>
                    <span>{order.id}</span>
                    <strong>{order.customer}</strong>
                    <em className={`status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </em>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {tab === "inventory" && (
          <section className="dashboard-section">
            <div className="toolbar">
              <label className="dashboard-search">
                <Search size={16} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search products or categories"
                />
              </label>
              <span>{filteredProducts.length} products</span>
            </div>
            <div className="inventory-table">
              <div className="table-head">
                <span>Product</span>
                <span>Category</span>
                <span>Price</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
              {filteredProducts.map((product) => (
                <div className="table-row" key={product.id}>
                  <div className="product-cell">
                    <span className="table-icon">{product.visual}</span>
                    <div>
                      <strong>{product.name}</strong>
                      <small>{product.detail}</small>
                    </div>
                  </div>
                  <span>{product.category}</span>
                  <span>
                    <strong>Rs. {product.price.toLocaleString()}</strong>
                    {product.oldPrice && (
                      <small className="old-price">
                        Rs. {product.oldPrice.toLocaleString()}
                      </small>
                    )}
                  </span>
                  <span>
                    <em className={`status ${product.sold ? "sold" : "live"}`}>
                      {product.sold
                        ? "Sold out"
                        : product.oldPrice
                          ? "On sale"
                          : "Live"}
                    </em>
                  </span>
                  <div className="row-actions">
                    <button onClick={() => toggleSale(product)}>
                      {product.oldPrice ? "End sale" : "Sale"}
                    </button>
                    <button onClick={() => toggleSold(product)}>
                      {product.sold ? "Restock" : "Mark sold"}
                    </button>
                    <button onClick={() => openEditProduct(product)}>
                      Edit
                    </button>
                    <button
                      className="danger"
                      onClick={() => deleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === "orders" && (
          <section className="dashboard-section">
            <div className="order-filters">
              <span>All orders</span>
              <span>{pendingOrders} pending</span>
              <span>
                {orders.filter((order) => order.status === "Shipped").length}{" "}
                shipped
              </span>
            </div>
            <div className="order-list">
              {orders.map((order) => (
                <article className="order-card" key={order.id}>
                  <div className="order-main">
                    <span className="order-number">{order.id}</span>
                    <strong>{order.customer}</strong>
                    <small>
                      {order.items} items · {order.placed}
                    </small>
                  </div>
                  <strong>Rs. {order.total.toLocaleString()}</strong>
                  <label
                    className={`order-status ${order.status.toLowerCase()}`}
                  >
                    <ChevronDown size={14} />
                    <select
                      value={order.status}
                      onChange={(event) =>
                        updateOrder(
                          order.id,
                          event.target.value as DeliveryStatus,
                        )
                      }
                      aria-label={`Update ${order.id} delivery status`}
                    >
                      {deliveryStatuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </label>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      {showForm && (
        <div className="modal-backdrop">
          <form className="product-form" onSubmit={saveProduct}>
            <div className="form-heading">
              <div>
                <p className="dashboard-kicker">
                  {editingId ? "EDIT PRODUCT" : "NEW PRODUCT"}
                </p>
                <h2>{editingId ? "Update product" : "Add product"}</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                <X size={19} />
              </button>
            </div>
            <label>
              Product name
              <input
                required
                value={draft.name}
                onChange={(event) =>
                  setDraft({ ...draft, name: event.target.value })
                }
                placeholder="e.g. MagSafe power bank"
              />
            </label>
            <div className="form-grid">
              <label>
                Category
                <select
                  value={draft.category}
                  onChange={(event) =>
                    setDraft({ ...draft, category: event.target.value })
                  }
                >
                  {productCategories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label>
                Badge
                <input
                  value={draft.badge ?? ""}
                  onChange={(event) =>
                    setDraft({ ...draft, badge: event.target.value })
                  }
                  placeholder="NEW or BESTSELLER"
                />
              </label>
            </div>
            <div className="form-grid">
              <label>
                Sale price (Rs.)
                <input
                  required
                  type="number"
                  min="1"
                  value={draft.price || ""}
                  onChange={(event) =>
                    setDraft({ ...draft, price: Number(event.target.value) })
                  }
                />
              </label>
              <label>
                Original price (Rs.)
                <input
                  type="number"
                  min="0"
                  value={draft.oldPrice || ""}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      oldPrice: Number(event.target.value) || undefined,
                    })
                  }
                />
              </label>
            </div>
            <label>
              Short specs
              <input
                required
                value={draft.detail}
                onChange={(event) =>
                  setDraft({ ...draft, detail: event.target.value })
                }
                placeholder="65W GaN - USB-C PD"
              />
            </label>
            <div className="form-actions">
              <button
                type="button"
                className="plain-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button className="dashboard-primary" type="submit">
                {editingId ? "Save changes" : "Add product"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
