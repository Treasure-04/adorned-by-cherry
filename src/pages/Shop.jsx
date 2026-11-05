import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PaystackPop from "@paystack/inline-js";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { formatNaira } from "../data/services";
import { contact } from "../data/contact";

const PAYSTACK_PUBLIC_KEY = "pk_test_03d535fbacdc9e23cc9e311b467b7a06a994071b";
const CART_KEY = "adorned-cart";
const emptyDetails = { name: "", phone: "", email: "", address: "" };

function optimized(url) {
  return url.includes("/upload/") ? url.replace("/upload/", "/upload/w_600,q_auto,f_auto/") : url;
}

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || {};
  } catch (err) {
    return {};
  }
}

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [active, setActive] = useState("All");
  const [cart, setCart] = useState(loadCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [step, setStep] = useState("cart");
  const [details, setDetails] = useState(emptyDetails);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState("");
  const [orderRef, setOrderRef] = useState("");

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

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (err) {
      console.error(err);
    }
  }, [cart]);

  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const shown = active === "All" ? products : products.filter((p) => p.category === active);

  const cartItems = products.filter((p) => p.inStock && cart[p.id]).map((p) => ({ ...p, qty: cart[p.id] }));
  const cartCount = cartItems.reduce((n, i) => n + i.qty, 0);
  const cartTotal = cartItems.reduce((n, i) => n + i.qty * i.price, 0);

  function addToCart(id) {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  }

  function changeQty(id, delta) {
    setCart((c) => {
      const next = { ...c };
      const qty = (next[id] || 0) + delta;
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  }

  function openCart() {
    setStep("cart");
    setMessage("");
    setCartOpen(true);
  }

  function closeCart() {
    if (paying) return;
    setCartOpen(false);
    setStep("cart");
    setMessage("");
  }

  function shopNow() {
    closeCart();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateDetail(field, value) {
    setDetails((d) => ({ ...d, [field]: value }));
  }

  async function confirmOrder(reference) {
    try {
      const res = await fetch("/api/verify-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference,
          items: cartItems.map((i) => ({ id: i.id, qty: i.qty })),
          customer: details,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Could not confirm the order");
      setStep("success");
    } catch (err) {
      console.error(err);
      setStep("problem");
    }
    setOrderRef(reference);
    setCart({});
    setDetails(emptyDetails);
    setPaying(false);
  }

  function pay(e) {
    e.preventDefault();
    if (cartItems.length === 0) return;
    setMessage("");
    setPaying(true);
    const reference = "adorned-" + Date.now() + "-" + Math.floor(Math.random() * 1000000);
    try {
      const paystack = new PaystackPop();
      paystack.newTransaction({
        key: PAYSTACK_PUBLIC_KEY,
        email: details.email.trim(),
        amount: Math.round(cartTotal * 100),
        currency: "NGN",
        reference,
        onSuccess: (transaction) => confirmOrder(transaction.reference || reference),
        onCancel: () => {
          setPaying(false);
          setMessage("Payment cancelled. Your cart is still here.");
        },
        onError: (err) => {
          console.error(err);
          setPaying(false);
          setMessage("Payment could not start. Please try again.");
        },
      });
    } catch (err) {
      console.error(err);
      setPaying(false);
      setMessage("Payment could not start. Please try again.");
    }
  }

  const qtyButton = "w-9 h-9 border border-gold/40 text-gold hover:bg-gold hover:text-ink transition-colors";
  const inputClass = "w-full bg-ink-light border border-gold/20 px-4 py-3 text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-gold";
  const titles = { cart: "Your cart", details: "Checkout", success: "Thank you", problem: "One more step" };
  const problemLink = "https://wa.me/" + contact.whatsapp + "?text=" + encodeURIComponent("Hello Adorned by Cherry, I paid for an order but it did not finish saving. My payment reference is: " + orderRef);

  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-gold/20 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-ivory/70 hover:text-gold text-sm transition-colors">← Back to home</Link>
        <button onClick={openCart} className="border border-gold text-gold px-5 py-2 text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors">{"Cart (" + cartCount + ")"}</button>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 pb-32">
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
                    {!p.inStock ? (
                      <span className="border border-gold/20 text-ivory/30 px-4 py-2 text-sm tracking-wide text-center">Unavailable</span>
                    ) : cart[p.id] ? (
                      <div className="flex items-center justify-between">
                        <button onClick={() => changeQty(p.id, -1)} className={qtyButton} aria-label="Remove one">−</button>
                        <span className="text-ivory">{cart[p.id]}</span>
                        <button onClick={() => changeQty(p.id, 1)} className={qtyButton} aria-label="Add one">+</button>
                      </div>
                    ) : (
                      <button onClick={() => addToCart(p.id)} className="bg-gold text-ink px-4 py-2 text-sm tracking-wide font-medium hover:bg-gold-soft transition-colors">Add to cart</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {cartCount > 0 && !cartOpen && (
        <button onClick={openCart} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-gold text-ink px-8 py-3 text-sm tracking-wide font-medium shadow-lg hover:bg-gold-soft transition-colors">{"View cart (" + cartCount + ") · " + formatNaira(cartTotal)}</button>
      )}

      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60" onClick={closeCart}>
          <div className="w-full max-w-md bg-ink border-l border-gold/20 flex flex-col h-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gold/20">
              <h2 className="font-display text-2xl">{titles[step]}</h2>
              <button onClick={closeCart} className="text-gold text-2xl" aria-label="Close">✕</button>
            </div>

            {step === "cart" && cartItems.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-32 h-32 text-gold/60 mb-6" aria-hidden="true">
                  <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6.2" />
                  <circle cx="9.5" cy="20" r="1.3" />
                  <circle cx="17" cy="20" r="1.3" />
                </svg>
                <p className="font-display text-3xl mb-6">Your cart is empty</p>
                <button onClick={shopNow} className="bg-gold text-ink px-10 py-3 text-sm tracking-wide font-medium hover:bg-gold-soft transition-colors">Shop now</button>
              </div>
            )}

            {step === "cart" && cartItems.length > 0 && (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <div className="space-y-4">
                    {cartItems.map((i) => (
                      <div key={i.id} className="flex gap-4 border-b border-gold/10 pb-4">
                        <div className="w-16 h-16 shrink-0 bg-ink-light border border-gold/10 overflow-hidden">
                          {i.image && <img src={optimized(i.image)} alt={i.name} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-lg truncate">{i.name}</p>
                          <p className="text-gold text-sm mb-2">{formatNaira(i.price * i.qty)}</p>
                          <div className="flex items-center gap-3">
                            <button onClick={() => changeQty(i.id, -1)} className={qtyButton} aria-label="Remove one">−</button>
                            <span>{i.qty}</span>
                            <button onClick={() => changeQty(i.id, 1)} className={qtyButton} aria-label="Add one">+</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-gold/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-ivory/70">Total</span>
                    <span className="text-gold text-xl">{formatNaira(cartTotal)}</span>
                  </div>
                  <button onClick={() => setStep("details")} className="w-full bg-gold text-ink px-6 py-3 text-sm tracking-wide font-medium hover:bg-gold-soft transition-colors">Checkout</button>
                  <button onClick={() => setCart({})} className="w-full text-ivory/50 hover:text-blush-rose text-sm transition-colors">Clear cart</button>
                </div>
              </>
            )}

            {step === "details" && (
              <form onSubmit={pay} className="flex flex-col flex-1 min-h-0">
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  <button type="button" onClick={() => setStep("cart")} className="text-ivory/60 hover:text-gold text-sm transition-colors">← Back to cart</button>
                  <input required value={details.name} onChange={(e) => updateDetail("name", e.target.value)} maxLength={80} placeholder="Your name" className={inputClass} />
                  <input required type="tel" value={details.phone} onChange={(e) => updateDetail("phone", e.target.value)} maxLength={20} placeholder="Phone number" className={inputClass} />
                  <input required type="email" value={details.email} onChange={(e) => updateDetail("email", e.target.value)} maxLength={100} placeholder="Email (Paystack sends your receipt here)" className={inputClass} />
                  <textarea required value={details.address} onChange={(e) => updateDetail("address", e.target.value)} maxLength={300} rows={3} placeholder="Delivery address (or write pickup)" className={inputClass} />
                  {message && <p className="text-blush-rose text-sm">{message}</p>}
                </div>
                <div className="px-6 py-4 border-t border-gold/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-ivory/70">Total</span>
                    <span className="text-gold text-xl">{formatNaira(cartTotal)}</span>
                  </div>
                  <button type="submit" disabled={paying || cartItems.length === 0} className="w-full bg-gold text-ink px-6 py-3 text-sm tracking-wide font-medium hover:bg-gold-soft transition-colors disabled:opacity-50">{paying ? "Please wait..." : "Pay " + formatNaira(cartTotal) + " with Paystack"}</button>
                </div>
              </form>
            )}

            {step === "success" && (
              <div className="flex-1 px-6 py-10 text-center">
                <p className="text-gold text-4xl mb-4">✓</p>
                <p className="font-display text-2xl mb-3">Payment received</p>
                <p className="text-ivory/70 mb-4">Thank you for your order! We will contact you shortly about delivery.</p>
                <p className="text-ivory/40 text-xs mb-8 break-all">{"Reference: " + orderRef}</p>
                <button onClick={closeCart} className="border border-gold text-gold px-8 py-3 text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors">Continue shopping</button>
              </div>
            )}

            {step === "problem" && (
              <div className="flex-1 px-6 py-10 text-center">
                <p className="text-ivory/70 mb-4">We received your payment, but could not finish saving your order. Please do not pay again. Send us your payment reference on WhatsApp and we will sort it out.</p>
                <p className="text-ivory/40 text-xs mb-8 break-all">{"Reference: " + orderRef}</p>
                <a href={problemLink} target="_blank" rel="noreferrer" className="inline-block bg-gold text-ink px-8 py-3 text-sm tracking-wide font-medium hover:bg-gold-soft transition-colors">Message us on WhatsApp</a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}