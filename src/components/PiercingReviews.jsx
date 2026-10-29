import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function PiercingReviews({ piercing }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    async function load() {
      try {
        const q = query(collection(db, "reviews"), where("piercing", "==", piercing), where("approved", "==", true));
        const snap = await getDocs(q);
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        items.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setList(items);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    load();
  }, [piercing]);

  async function submit(e) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setStatus("sending");
    try {
      await addDoc(collection(db, "reviews"), {
        piercing,
        name: name.trim(),
        rating,
        text: text.trim(),
        approved: false,
        createdAt: serverTimestamp(),
      });
      setName("");
      setText("");
      setRating(5);
      setStatus("sent");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <div className="mt-8 pt-6 border-t border-gold/10">
      <h5 className="font-display text-xl mb-4">Reviews for this piercing</h5>

      {loading ? (
        <p className="text-ivory/40 text-sm">Loading reviews...</p>
      ) : list.length === 0 ? (
        <p className="text-ivory/40 text-sm mb-6">No reviews yet. Be the first to leave one.</p>
      ) : (
        <div className="space-y-4 mb-6">
          {list.map((r) => (
            <div key={r.id} className="border border-gold/20 p-4">
              <p className="text-gold text-sm mb-1">{"★".repeat(r.rating)}</p>
              <p className="text-ivory/80 mb-2">{r.text}</p>
              <p className="text-ivory/40 text-xs">{r.name}</p>
            </div>
          ))}
        </div>
      )}

      {status === "sent" ? (
        <p className="text-gold text-sm">Thank you! Your review will appear once it has been approved.</p>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder="Your name" className="w-full bg-ink-light border border-gold/20 px-4 py-2 text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-gold" />
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => setRating(n)} className={"text-2xl " + (n <= rating ? "text-gold" : "text-ivory/20")} aria-label={n + " stars"}>★</button>
            ))}
          </div>
          <textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={600} rows={3} placeholder="Share your experience" className="w-full bg-ink-light border border-gold/20 px-4 py-2 text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-gold" />
          <button type="submit" disabled={status === "sending"} className="border border-gold text-gold px-6 py-2 text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors disabled:opacity-50">{status === "sending" ? "Sending..." : "Submit Review"}</button>
          {status === "error" && <p className="text-blush-rose text-sm">Something went wrong. Please try again.</p>}
        </form>
      )}
    </div>
  );
}