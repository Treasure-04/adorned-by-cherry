import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { formatNaira } from "../data/services";

const filters = ["new", "delivered", "all"];

function whatsappNumber(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.startsWith("234")) return digits;
  if (digits.startsWith("0")) return "234" + digits.slice(1);
  return digits;
}

function formatWhen(createdAt) {
  if (!createdAt) return "";
  return createdAt.toDate().toLocaleString("en-NG", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("new");
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setMessage("Could not load orders.");
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  async function setStatus(o, status) {
    setBusyId(o.id);
    setMessage("");
    try {
      await updateDoc(doc(db, "orders", o.id), { status });
    } catch (err) {
      console.error(err);
      setMessage("Could not update the order.");
    }
    setBusyId(null);
  }

  async function removeOrder(o) {
    if (!window.confirm("Delete this order record for good?")) return;
    setBusyId(o.id);
    setMessage("");
    try {
      await deleteDoc(doc(db, "orders", o.id));
    } catch (err) {
      console.error(err);
      setMessage("Could not delete the order.");
    }
    setBusyId(null);
  }

  const counts = {
    new: orders.filter((o) => o.status !== "delivered").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    all: orders.length,
  };
  const shown = filter === "all" ? orders : orders.filter((o) => (filter === "delivered" ? o.status === "delivered" : o.status !== "delivered"));

  const buttonClass = "border border-gold text-gold px-5 py-2 text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors disabled:opacity-50";

  return (
    <div>
      <h2 className="font-display text-3xl mb-6">Orders</h2>

      <div className="flex flex-wrap gap-3 mb-8">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={"px-5 py-2 text-sm tracking-wide border capitalize transition-colors " + (filter === f ? "bg-gold text-ink border-gold" : "border-gold/30 text-ivory/80 hover:border-gold")}>
            {f + " (" + counts[f] + ")"}
          </button>
        ))}
      </div>

      {message && <p className="text-gold text-sm mb-6">{message}</p>}

      {loading ? (
        <p className="text-ivory/50">Loading orders...</p>
      ) : shown.length === 0 ? (
        <p className="text-ivory/50">No {filter === "all" ? "" : filter + " "}orders.</p>
      ) : (
        <div className="space-y-4">
          {shown.map((o) => {
            const customer = o.customer || {};
            const items = o.items || [];
            const delivered = o.status === "delivered";
            return (
              <div key={o.id} className="border border-gold/20 bg-ink-light p-6">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="font-display text-2xl">{customer.name}</p>
                    <p className="text-ivory/40 text-xs">{formatWhen(o.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gold text-xl">{formatNaira(o.total || 0)}</p>
                    <span className={"inline-block mt-1 text-xs tracking-[0.15em] uppercase border px-3 py-1 " + (delivered ? "border-ivory/40 text-ivory" : "border-gold text-gold")}>{delivered ? "delivered" : "new"}</span>
                  </div>
                </div>

                <div className="mb-4 space-y-1">
                  {items.map((i) => (
                    <p key={i.id} className="text-ivory/80 text-sm">{i.qty + " × " + i.name + " — " + formatNaira(i.price * i.qty)}</p>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-2 text-sm text-ivory/70 mb-4">
                  <p>Phone: <a href={"tel:" + customer.phone} className="text-gold">{customer.phone}</a></p>
                  <p className="break-words">Email: {customer.email}</p>
                  <p className="sm:col-span-2 whitespace-pre-line">{customer.method === "pickup" ? "Pickup (collecting from the studio)" : "Delivery to: " + (customer.address || "")}</p>
                </div>

                <p className="text-ivory/30 text-xs mb-4 break-all">{"Reference: " + o.reference}</p>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={"https://wa.me/" + whatsappNumber(customer.phone) + "?text=" + encodeURIComponent("Hello " + customer.name + ", this is Adorned by Cherry about your jewelry order. Thank you for your payment!")}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-gold/40 text-ivory/80 px-5 py-2 text-sm tracking-wide hover:border-gold transition-colors"
                  >
                    WhatsApp
                  </a>
                  {delivered ? (
                    <button disabled={busyId === o.id} onClick={() => setStatus(o, "paid")} className={buttonClass}>Mark as new again</button>
                  ) : (
                    <button disabled={busyId === o.id} onClick={() => setStatus(o, "delivered")} className="bg-gold text-ink px-5 py-2 text-sm tracking-wide font-medium hover:bg-gold-soft transition-colors disabled:opacity-50">{busyId === o.id ? "Working..." : "Mark as delivered"}</button>
                  )}
                  <button disabled={busyId === o.id} onClick={() => removeOrder(o)} className="border border-blush-rose text-blush-rose px-5 py-2 text-sm tracking-wide hover:bg-blush-rose hover:text-ink transition-colors disabled:opacity-50">Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}