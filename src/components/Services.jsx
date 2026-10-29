import { useState } from "react";
import { serviceCategories, formatNaira } from "../data/services";
import PiercingReviews from "./PiercingReviews";

export default function Services() {
  const [openKey, setOpenKey] = useState(null);

  return (
    <section id="services" className="bg-ink py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-gold tracking-[0.2em] uppercase text-xs mb-4 text-center">Services & Pricing</p>
        <h2 className="font-display text-4xl md:text-5xl mb-16 text-center">Piercing Price List</h2>

        {serviceCategories.map((category) => (
          <div key={category.id} className="mb-14 last:mb-0">
            <h3 className="font-display text-3xl text-gold mb-6">{category.label}</h3>
            <div className="border-t border-gold/20">
              {category.items.map((item) => {
                const key = category.id + "-" + item.name;
                const isOpen = openKey === key;
                return (
                  <div key={key} className="border-b border-gold/20">
                    <button
                      onClick={() => setOpenKey(isOpen ? null : key)}
                      className="w-full flex items-center justify-between py-4 text-left hover:text-gold transition-colors"
                    >
                      <span className="text-lg">{item.name}</span>
                      <span className="flex items-center gap-4">
                        <span className="text-gold">{formatNaira(item.price)}</span>
                        <span className="text-gold text-xl">{isOpen ? "−" : "+"}</span>
                      </span>
                    </button>

                    {isOpen && (
                      <div className="pb-8">
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div className="aspect-square bg-ink-light border border-gold/20 overflow-hidden flex items-center justify-center">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-ivory/30 text-sm">Photo coming soon</span>
                            )}
                          </div>
                          <div className="flex flex-col justify-center">
                            <h4 className="font-display text-2xl mb-2">{item.name}</h4>
                            <p className="text-ivory/60 mb-4">{item.description || category.description}</p>
                            <p className="text-gold mb-6">{formatNaira(item.price)}</p>
                            <a href="#booking" className="bg-gold text-ink px-6 py-3 text-sm tracking-wide font-medium text-center hover:bg-gold-soft transition-colors">Book This Piercing</a>
                          </div>
                        </div>
                        <PiercingReviews piercing={key} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}