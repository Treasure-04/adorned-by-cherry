import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const filters = ["pending", "approved", "all"];

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setReviews(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setMessage("Could not load reviews.");
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  async function setApproved(r, value) {
    setBusyId(r.id);
    setMessage("");
    try {
      await updateDoc(doc(db, "reviews", r.id), { approved: value });
    } catch (err) {
      console.error(err);
      setMessage("Could not update the review.");
    }
    setBusyId(null);
  }

  async function removeReview(r) {
    if (!window.confirm("Delete this review for good?")) return;
    setBusyId(r.id);
    setMessage("");
    try {
      await deleteDoc(doc(db, "reviews", r.id));
    } catch (err) {
      console.error(err);
      setMessage("Could not delete the review.");
    }
    setBusyId(null);
  }

  const counts = {
    pending: reviews.filter((r) => !r.approved).length,
    approved: reviews.filter((r) => r.approved).length,
    all: reviews.length,
  };
  const shown = filter === "all" ? reviews : reviews.filter((r) => (filter === "approved" ? r.approved : !r.approved));

  const buttonClass = "border border-gold text-gold px-5 py-2 text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors disabled:opacity-50";

  return (
    <div>
      <h2 className="font-display text-3xl mb-6">Reviews</h2>

      <div className="flex flex-wrap gap-3 mb-8">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={"px-5 py-2 text-sm tracking-wide border capitalize transition-colors " + (filter === f ? "bg-gold text-ink border-gold" : "border-gold/30 text-ivory/80 hover:border-gold")}>
            {f + " (" + counts[f] + ")"}
          </button>
        ))}
      </div>

      {message && <p className="text-gold text-sm mb-6">{message}</p>}

      {loading ? (
        <p className="text-ivory/50">Loading reviews...</p>
      ) : shown.length === 0 ? (
        <p className="text-ivory/50">No {filter === "all" ? "" : filter + " "}reviews.</p>
      ) : (
        <div className="space-y-4">
          {shown.map((r) => (
            <div key={r.id} className="border border-gold/20 bg-ink-light p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-gold tracking-widest">{"★".repeat(r.rating)}</p>
                  <p className="font-display text-xl">{r.name}</p>
                  <p className="text-ivory/50 text-sm">{r.piercing}</p>
                </div>
                <span className={"text-xs tracking-[0.15em] uppercase border px-3 py-1 " + (r.approved ? "border-ivory/40 text-ivory" : "border-gold text-gold")}>{r.approved ? "approved" : "pending"}</span>
              </div>

              <p className="text-ivory/80 mb-4 whitespace-pre-line">{r.text}</p>
              <p className="text-ivory/30 text-xs mb-4">{r.createdAt ? r.createdAt.toDate().toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" }) : ""}</p>

              <div className="flex flex-wrap gap-3">
                {r.approved ? (
                  <button disabled={busyId === r.id} onClick={() => setApproved(r, false)} className={buttonClass}>Hide from website</button>
                ) : (
                  <button disabled={busyId === r.id} onClick={() => setApproved(r, true)} className="bg-gold text-ink px-5 py-2 text-sm tracking-wide font-medium hover:bg-gold-soft transition-colors disabled:opacity-50">Approve</button>
                )}
                <button disabled={busyId === r.id} onClick={() => removeReview(r)} className="border border-blush-rose text-blush-rose px-5 py-2 text-sm tracking-wide hover:bg-blush-rose hover:text-ink transition-colors disabled:opacity-50">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}