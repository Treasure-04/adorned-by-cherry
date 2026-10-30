import { useState } from "react";
import { faqs } from "../data/faq";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="bg-ink py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-gold tracking-[0.2em] uppercase text-xs mb-4 text-center">FAQ</p>
        <h2 className="font-display text-4xl md:text-5xl mb-16 text-center">Questions, answered</h2>

        <div className="border-t border-gold/20">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question} className="border-b border-gold/20">
                <button onClick={() => setOpenIndex(isOpen ? null : index)} className="w-full flex items-center justify-between gap-4 py-5 text-left hover:text-gold transition-colors">
                  <span className="text-lg">{item.question}</span>
                  <span className="text-gold text-xl">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && <p className="text-ivory/60 pb-6 max-w-2xl">{item.answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}