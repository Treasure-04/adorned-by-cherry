import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { reviews } from "../data/reviews";

export default function Reviews() {
  const [written, setWritten] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const q = query(collection(db, "reviews"), where("approved", "==", true));
        const snap = await getDocs(q);
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        items.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setWritten(items);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  return (
    <section id="reviews" className="bg-ink py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-gold tracking-[0.2em] uppercase text-xs mb-4 text-center">Reviews</p>
        <h2 className="font-display text-4xl md:text-5xl mb-16 text-center">What our clients say</h2>

        <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
          {reviews.map((item) => (
            <div key={item.id} className="mb-4 break-inside-avoid border border-gold/20 overflow-hidden bg-ink-light">
              {item.image ? (
                <img src={item.image} alt="Client review" className="w-full h-auto" />
              ) : (
                <div className="aspect-[3/4] flex items-center justify-center text-ivory/30 text-sm">Review coming soon</div>
              )}
            </div>
          ))}

          {written.map((r) => (
            <div key={r.id} className="mb-4 break-inside-avoid border border-gold/20 bg-ink-light p-6">
              <p className="text-gold tracking-widest mb-3">{"★".repeat(r.rating)}</p>
              <p className="text-ivory/80 mb-4">{r.text}</p>
              <p className="font-display text-lg">{r.name}</p>
              <p className="text-ivory/40 text-xs">{r.piercing.split(": ").pop()}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}