import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { serviceCategories, formatNaira } from "../data/services";

const times = ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

const emptyForm = { name: "", phone: "", email: "", piercing: "", date: "", time: "", notes: "" };

export default function Booking() {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("idle");
  const today = new Date().toISOString().split("T")[0];

  function update(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function submit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      await addDoc(collection(db, "bookings"), {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        piercing: form.piercing,
        date: form.date,
        time: form.time,
        notes: form.notes.trim(),
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setForm(emptyForm);
      setStatus("sent");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  const inputClass = "w-full bg-ink border border-gold/20 px-4 py-3 text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-gold";

  return (
    <section id="booking" className="bg-ink-light py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <p className="text-gold tracking-[0.2em] uppercase text-xs mb-4 text-center">Booking</p>
        <h2 className="font-display text-4xl md:text-5xl mb-4 text-center">Book an appointment</h2>
        <p className="text-ivory/60 text-center mb-12">Choose your piercing and a time that suits you. We will confirm your appointment by phone or WhatsApp.</p>

        {status === "sent" ? (
          <div className="border border-gold/30 p-8 text-center">
            <p className="font-display text-2xl text-gold mb-2">Request received</p>
            <p className="text-ivory/70 mb-6">Thank you! We will contact you shortly to confirm your appointment. It is not confirmed until you hear from us.</p>
            <button onClick={() => setStatus("idle")} className="border border-gold text-gold px-6 py-2 text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors">Make another booking</button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input required value={form.name} onChange={(e) => update("name", e.target.value)} maxLength={60} placeholder="Your name" className={inputClass} />
              <input required type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} maxLength={20} placeholder="Phone number" className={inputClass} />
            </div>
            <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} maxLength={100} placeholder="Email (optional)" className={inputClass} />

            <select required value={form.piercing} onChange={(e) => update("piercing", e.target.value)} className={inputClass}>
              <option value="">Choose your piercing</option>
              {serviceCategories.map((category) => (
                <optgroup key={category.id} label={category.label}>
                  {category.items.map((item) => (
                    <option key={item.name} value={category.label + ": " + item.name}>{item.name + " - " + formatNaira(item.price)}</option>
                  ))}
                </optgroup>
              ))}
            </select>

            <div className="grid sm:grid-cols-2 gap-4">
              <input required type="date" min={today} value={form.date} onChange={(e) => update("date", e.target.value)} className={inputClass} />
              <select required value={form.time} onChange={(e) => update("time", e.target.value)} className={inputClass}>
                <option value="">Choose a time</option>
                {times.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} maxLength={500} rows={3} placeholder="Anything we should know? (optional)" className={inputClass} />

            <button type="submit" disabled={status === "sending"} className="w-full bg-gold text-ink px-8 py-3 text-sm tracking-wide font-medium hover:bg-gold-soft transition-colors disabled:opacity-50">{status === "sending" ? "Sending..." : "Request Appointment"}</button>
            {status === "error" && <p className="text-blush-rose text-sm text-center">Something went wrong. Please try again.</p>}
          </form>
        )}
      </div>
    </section>
  );
}