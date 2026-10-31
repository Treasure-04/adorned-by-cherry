import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, ADMIN_EMAIL } from "../firebase";
import AdminBookings from "./AdminBookings";
import AdminReviews from "./AdminReviews";
import AdminProducts from "./AdminProducts";

const tabs = ["Bookings", "Reviews", "Products"];

export default function Admin() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState("Bookings");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecking(false);
    });
    return unsub;
  }, []);

  async function login(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setError("Wrong email or password.");
    }
    setBusy(false);
  }

  const inputClass = "w-full bg-ink border border-gold/20 px-4 py-3 text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-gold";

  if (checking) {
    return <div className="min-h-screen bg-ink flex items-center justify-center text-ivory/50">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-6">
        <form onSubmit={login} className="w-full max-w-sm space-y-4 border border-gold/20 p-8 bg-ink-light">
          <h1 className="font-display text-3xl text-center mb-2">Admin login</h1>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={inputClass} />
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className={inputClass} />
          <button type="submit" disabled={busy} className="w-full bg-gold text-ink px-8 py-3 text-sm tracking-wide font-medium hover:bg-gold-soft transition-colors disabled:opacity-50">{busy ? "Signing in..." : "Sign in"}</button>
          {error && <p className="text-blush-rose text-sm text-center">{error}</p>}
        </form>
      </div>
    );
  }

  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-ink flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-ivory/70">This account does not have access.</p>
        <button onClick={() => signOut(auth)} className="border border-gold text-gold px-6 py-2 text-sm hover:bg-gold hover:text-ink transition-colors">Sign out</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-gold/20 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl">Adorned by Cherry <span className="text-gold">Admin</span></h1>
        <div className="flex items-center gap-4">
          <a href="/" className="text-ivory/60 hover:text-gold text-sm transition-colors">View website</a>
          <button onClick={() => signOut(auth)} className="border border-gold text-gold px-5 py-2 text-sm hover:bg-gold hover:text-ink transition-colors">Sign out</button>
        </div>
      </header>

      <div className="border-b border-gold/10 px-6">
        <div className="max-w-5xl mx-auto flex gap-8">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={"py-4 text-sm tracking-wide border-b-2 transition-colors " + (tab === t ? "border-gold text-gold" : "border-transparent text-ivory/60 hover:text-ivory")}>{t}</button>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {tab === "Bookings" && <AdminBookings />}
        {tab === "Reviews" && <AdminReviews />}
        {tab === "Products" && <AdminProducts />}
      </main>
    </div>
  );
}