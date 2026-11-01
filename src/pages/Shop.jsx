import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { formatNaira } from "../data/services";
import { contact } from "../data/contact";

function optimized(url) {
  return url.includes("/upload/") ? url.replace("/upload/", "/upload/w_600,q_auto,f_auto/") : url;
}

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [active, setActive] = useState("All");

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(query(collection(db, "products"), orderBy("createdAt", "desc")));
        setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
        setError(true);
      }
      setLoading(false);
    }
    load();
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const shown = active === "All" ? products : products.filter((p) => p.category === active);

  function orderLink(p) {
    return "https://wa.me/" + contact.whatsapp + "?text=" + encodeURIComponent("Hello Adorned by Cherry, I would like to order the " + p.name + " (" + formatNaira(p.price) + ").");
  }

  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-gold/20 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-ivory/70 hover:text-gold text-sm transition-colors">← Back to home</Link>
        <p className="font-display text-xl">Adorned by <span className="text-gold">Cherry</span></p>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-gold tracking-[0.2em] uppercase text-xs mb-4 text-center">Jewelry</p>
        <h1 className="font-display text-4xl md:text-6xl mb-10 text-center">The collection</h1>

        {loading ? (
          <p className="text-ivory/50 text-center">Loading...</p>
        ) : error ? (
          <p className="text-ivory/50 text-center">We could not load the jewelry right now. Please try again shortly.</p>
        ) : products.length === 0 ? (
          <p className="text-ivory/50 text-center">New pieces are on their way. Check back soon.</p>
        ) : (
          <>
            <div className="flex justify-center flex-wrap gap-3 mb-12">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setActive(cat)} className={"px-5 py-2 text-sm tracking-wide border transition-colors " + (active === cat ? "bg-gold text-ink border-gold" : "border-gold/30 text-ivory/80 hover:border-gold")}>{cat}</button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {shown.map((p) => (
                <div key={p.id} className="border border-gold/20 bg-ink-light flex flex-col">
                  <div className="relative aspect-square bg-ink overflow-hidden flex items-center justify-center">
                    {p.image ? (
                      <img src={optimized(p.image)} alt={p.name} className={"w-full h-full object-cover " + (p.inStock ? "" : "opacity-40")} />
                    ) : (
                      <span className="text-ivory/30 text-sm">No photo</span>
                    )}
                    {!p.inStock && <span className="absolute top-3 left-3 bg-ink/90 border border-blush-rose text-blush-rose text-xs tracking-[0.15em] uppercase px-3 py-1">Out of stock</span>}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-ivory/40 text-xs mb-1">{p.category}</p>
                    <p className="font-display text-xl mb-1">{p.name}</p>
                    {p.description && <p className="text-ivory/60 text-sm mb-3">{p.description}</p>}
                    <p className="text-gold mb-4 mt-auto">{formatNaira(p.price)}</p>
                    {p.inStock ? (
                      <a href={orderLink(p)} target="_blank" rel="noreferrer" className="bg-gold text-ink px-4 py-2 text-sm tracking-wide font-medium text-center hover:bg-gold-soft transition-colors">Order on WhatsApp</a>
                    ) : (
                      <span className="border border-gold/20 text-ivory/30 px-4 py-2 text-sm tracking-wide text-center">Unavailable</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}