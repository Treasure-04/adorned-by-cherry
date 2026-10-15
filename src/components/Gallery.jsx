import { useState } from "react";
import { galleryItems } from "../data/gallery";

const categories = ["All", ...new Set(galleryItems.map((item) => item.category))];

export default function Gallery() {
  const [active, setActive] = useState("All");
  const shown = active === "All" ? galleryItems : galleryItems.filter((item) => item.category === active);

  return (
    <section id="gallery" className="bg-ink-light py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-gold tracking-[0.2em] uppercase text-xs mb-4 text-center">Gallery</p>
        <h2 className="font-display text-4xl md:text-5xl mb-10 text-center">Our work</h2>

        <div className="flex justify-center flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={"px-5 py-2 text-sm tracking-wide border transition-colors " + (active === cat ? "bg-gold text-ink border-gold" : "border-gold/30 text-ivory/80 hover:border-gold")}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {shown.map((item) => (
            <div key={item.id} className="aspect-square bg-ink border border-gold/20 overflow-hidden flex items-center justify-center group">
              {item.image ? (
                <img src={item.image} alt={item.category + " piercing"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <span className="text-ivory/30 text-sm">Photo coming soon</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}