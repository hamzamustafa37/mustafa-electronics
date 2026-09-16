export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  visual: string;
  badge?: string;
  detail: string;
  sold?: boolean;
};

export const products: Product[] = [
  { id: 1, name: "Pulse wireless headphones", category: "Audio", price: 8900, oldPrice: 10900, visual: "◉", badge: "BESTSELLER", detail: "Deep sound - 40h battery" },
  { id: 2, name: "Arc mechanical keyboard", category: "Accessories", price: 7400, visual: "▤", badge: "NEW", detail: "Tactile switches - USB-C" },
  { id: 3, name: "Nova desk monitor light", category: "Smart home", price: 4900, oldPrice: 5900, visual: "⌁", detail: "Warm glow - Touch control" },
  { id: 4, name: "Orbit USB-C hub", category: "Computers", price: 3900, visual: "▣", badge: "NEW", detail: "7 ports - 4K HDMI" },
  { id: 5, name: "Flow portable speaker", category: "Audio", price: 6400, visual: "◒", detail: "Room-filling - IPX7" },
  { id: 6, name: "Slate laptop stand", category: "Accessories", price: 4500, oldPrice: 5500, visual: "△", badge: "-18%", detail: "Aluminum - Foldable" },
  { id: 7, name: "Halo smart plug", category: "Smart home", price: 2200, visual: "⌂", detail: "App control - 2 pack" },
  { id: 8, name: "Core webcam pro", category: "Computers", price: 9900, visual: "◉", detail: "1080p - Auto focus" },
];

export const catalogStorageKey = "mustafa-products";
export const ordersStorageKey = "mustafa-orders";

export const deliveryStatuses = ["Pending", "Packed", "Shipped", "Delivered", "Cancelled"] as const;
export type DeliveryStatus = (typeof deliveryStatuses)[number];

export type Order = {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: DeliveryStatus;
  placed: string;
};

export const starterOrders: Order[] = [
  { id: "ME-1048", customer: "Ayesha Khan", items: 2, total: 12900, status: "Packed", placed: "Today, 10:42" },
  { id: "ME-1047", customer: "Hamza Malik", items: 1, total: 8900, status: "Shipped", placed: "Yesterday" },
  { id: "ME-1046", customer: "Sara Ahmed", items: 3, total: 17600, status: "Pending", placed: "Yesterday" },
];
