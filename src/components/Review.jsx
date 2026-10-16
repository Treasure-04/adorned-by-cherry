import { reviews } from "../data/reviews";

export default function Reviews() {
  return (
    <section id="reviews" className="bg-ink py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-gold tracking-[0.2em] uppercase text-xs mb-4 text-center">Reviews</p>
        <h2 className="font-display text-4xl md:text-5xl mb-16 text-center">What our clients say</h2>

        <div className="columns-2 md:columns-3 gap-4">
          {reviews.map((item) => (
            <div key={item.id} className="mb-4 break-inside-avoid border border-gold/20 overflow-hidden bg-ink-light">
              {item.image ? (
                <img src={item.image} alt="Client review" className="w-full h-auto" />
              ) : (
                <div className="aspect-[3/4] flex items-center justify-center text-ivory/30 text-sm">Review coming soon</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}