import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { sendBookingConfirmed } from "../emailjs";

const filters = ["pending", "confirmed", "declined", "all"];

const statusStyle = {
  pending: "border-gold text-gold",
  confirmed: "border-ivory/40 text-ivory",
  declined: "border-blush-rose text-blush-rose",
};

function formatDate(isoDate) {
  return new Date(isoDate + "T00:00:00").toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function whatsappNumber(phone) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("234")) return digits;
  if (digits.startsWith("0")) return "234" + digits.slice(1);
  return digits;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setBookings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setMessage("Could not load bookings.");
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  async function confirmBooking(b) {
    setBusyId(b.id);
    setMessage("");
    let sent = true;
    try {
      await sendBookingConfirmed(b);
    } catch (err) {
      console.error(err);
      sent = false;
    }
    try {
      await updateDoc(doc(db, "bookings", b.id), { status: "confirmed", confirmationEmailSent: sent });
      if (!sent) setMessage("Booking confirmed, but the email did not send. Message the customer on WhatsApp.");
    } catch (err) {
      console.error(err);
      setMessage("Could not update the booking.");
    }
    setBusyId(null);
  }

  async function declineBooking(b) {
    if (!window.confirm("Decline this booking?")) return;
    setBusyId(b.id);
    setMessage("");
    try {
      await updateDoc(doc(db, "bookings", b.id), { status: "declined" });
    } catch (err) {
      console.error(err);
      setMessage("Could not update the booking.");
    }
    setBusyId(null);
  }

  async function resendEmail(b) {
    setBusyId(b.id);
    setMessage("");
    try {
      await sendBookingConfirmed(b);
      await updateDoc(doc(db, "bookings", b.id), { confirmationEmailSent: true });
      setMessage("Confirmation email sent.");
    } catch (err) {
      console.error(err);
      setMessage("The email did not send. Message the customer on WhatsApp.");
    }
    setBusyId(null);
  }

  const counts = {
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    declined: bookings.filter((b) => b.status === "declined").length,
    all: bookings.length,
  };
  const shown = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const buttonClass = "border border-gold text-gold px-5 py-2 text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors disabled:opacity-50";

  return (
    <div>
      <h2 className="font-display text-3xl mb-6">Bookings</h2>

      <div className="flex flex-wrap gap-3 mb-8">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={"px-5 py-2 text-sm tracking-wide border capitalize transition-colors " + (filter === f ? "bg-gold text-ink border-gold" : "border-gold/30 text-ivory/80 hover:border-gold")}>
            {f + " (" + counts[f] + ")"}
          </button>
        ))}
      </div>

      {message && <p className="text-gold text-sm mb-6">{message}</p>}

      {loading ? (
        <p className="text-ivory/50">Loading bookings...</p>
      ) : shown.length === 0 ? (
        <p className="text-ivory/50">No {filter === "all" ? "" : filter + " "}bookings.</p>
      ) : (
        <div className="space-y-4">
          {shown.map((b) => (
            <div key={b.id} className="border border-gold/20 bg-ink-light p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <p className="font-display text-2xl">{b.name}</p>
                  <p className="text-gold">{b.piercing}</p>
                </div>
                <span className={"text-xs tracking-[0.15em] uppercase border px-3 py-1 " + (statusStyle[b.status] || "")}>{b.status}</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-2 text-sm text-ivory/70 mb-4">
                <p>Date: {formatDate(b.date)}</p>
                <p>Time: {b.time}</p>
                <p>Phone: <a href={"tel:" + b.phone} className="text-gold">{b.phone}</a></p>
                <p className="break-words">Email: {b.email}</p>
              </div>

              {b.notes && <p className="text-sm text-ivory/60 mb-4">Notes: {b.notes}</p>}
              {b.status === "confirmed" && b.confirmationEmailSent === false && <p className="text-blush-rose text-sm mb-4">The confirmation email was not sent.</p>}

              <div className="flex flex-wrap gap-3">
                <a
                  href={"https://wa.me/" + whatsappNumber(b.phone) + "?text=" + encodeURIComponent("Hello " + b.name + ", this is Adorned by Cherry about your booking for " + b.piercing + " on " + formatDate(b.date) + " at " + b.time + ".")}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-gold/40 text-ivory/80 px-5 py-2 text-sm tracking-wide hover:border-gold transition-colors"
                >
                  WhatsApp
                </a>
                {b.status === "pending" && (
                  <>
                    <button disabled={busyId === b.id} onClick={() => confirmBooking(b)} className="bg-gold text-ink px-5 py-2 text-sm tracking-wide font-medium hover:bg-gold-soft transition-colors disabled:opacity-50">{busyId === b.id ? "Working..." : "Confirm"}</button>
                    <button disabled={busyId === b.id} onClick={() => declineBooking(b)} className={buttonClass}>Decline</button>
                  </>
                )}
                {b.status === "confirmed" && (
                  <button disabled={busyId === b.id} onClick={() => resendEmail(b)} className={buttonClass}>{busyId === b.id ? "Sending..." : "Send email again"}</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}