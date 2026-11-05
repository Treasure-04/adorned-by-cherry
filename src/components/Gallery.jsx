import { useState } from "react";
import { galleryItems } from "../data/gallery";
import { serviceCategories } from "../data/services";

const order = ["Ear", "Facial", "Body", "Oral"];
const shortName = { ear: "Ear", facial: "Facial", body: "Body", oral: "Oral" };

const fromServices = serviceCategories.flatMap((category) =>
  category.items
    .filter((item) => item.image)
    .map((item) => ({
      id: category.id + "-" + item.name,
      category: shortName[category.id],
      image: item.image,
      label: item.name,
    }))
);

const allItems = [...galleryItems.map((g) => ({ ...g, id: "g-" + g.id })), ...fromServices];
const categories = ["All", ...order.filter((c) => allItems.some((i) => i.category === c))];

export default function Gallery() {
  const [active, setActive] = useState("All");
  const shown = active === "All" ? allItems : allItems.filter((item) => item.category === active);

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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {shown.map((item) => (
            <div key={item.id} className="relative aspect-square bg-ink border border-gold/20 overflow-hidden flex items-center justify-center group">
              {item.image ? (
                <img src={item.image} alt={(item.label || item.category) + " piercing"} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <span className="text-ivory/30 text-sm">Photo coming soon</span>
              )}
              {item.label && <span className="absolute bottom-0 left-0 right-0 bg-ink/70 text-ivory text-xs tracking-wide px-3 py-2">{item.label}</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}