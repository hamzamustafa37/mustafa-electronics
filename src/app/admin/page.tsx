"use client";

import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { useState } from "react";
import "./admin.css";

const adminUsername = "admin";
const adminPassword = "mustafa123";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const signIn = (event: React.FormEvent) => {
    event.preventDefault();
    if (username.trim() === adminUsername && password === adminPassword) {
      window.localStorage.setItem("mustafa-admin-session", "true");
      window.location.replace("/dashboard");
      return;
    }
    setError("That username or password is not correct.");
  };

  return (
    <main className="admin-login-shell">
      <div className="admin-login-art"><span>ME</span><p>Tech today.<br /><strong>Better tomorrow.</strong></p></div>
      <section className="admin-login-card"><Link href="/" className="admin-login-brand">Mustafa <strong>Electronics</strong></Link><div className="admin-login-heading"><span className="admin-lock"><LockKeyhole size={19} /></span><p className="dashboard-kicker">PRIVATE AREA</p><h1>Welcome back.</h1><p>Sign in to manage products, sales, and deliveries.</p></div><form onSubmit={signIn}><label>Username<input required value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" placeholder="Enter username" /></label><label>Password<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" placeholder="Enter password" /></label>{error && <p className="admin-login-error">{error}</p>}<button className="admin-login-button" type="submit">Sign in to dashboard <ArrowRight size={17} /></button></form><Link href="/" className="admin-back-link">← Back to storefront</Link></section>
    </main>
  );
}
