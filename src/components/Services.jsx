import { serviceCategories, formatNaira } from "../data/services";

export default function Services() {
  return (
    <section id="services" className="bg-ink py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-gold tracking-[0.2em] uppercase text-xs mb-4 text-center">Services & Pricing</p>
        <h2 className="font-display text-4xl md:text-5xl mb-16 text-center">Crafted for you</h2>

        {serviceCategories.map((category) => (
          <div key={category.id} className="mb-16 last:mb-0">
            <div className="mb-8">
              <h3 className="font-display text-3xl text-gold mb-2">{category.label}</h3>
              <p className="text-ivory/60">{category.tagline}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {category.items.map((item) => (
                <div key={item.id} className="border border-gold/20 p-6 hover:border-gold/50 transition-colors">
                  <h4 className="font-display text-xl mb-2">{item.name}</h4>
                  <p className="text-ivory/60 text-sm mb-4">{item.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gold/10">
                    <span className="text-gold font-medium">{formatNaira(item.price)}</span>
                    <span className="text-ivory/40 text-xs">{item.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}