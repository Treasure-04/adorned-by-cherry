import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

if (!getApps().length) {
  initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
}

const db = getFirestore();

const clean = (value, max) => String(value || "").trim().slice(0, max);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { reference, items, customer } = req.body || {};

    if (!reference || typeof reference !== "string" || !Array.isArray(items) || items.length === 0 || items.length > 50 || !customer) {
      return res.status(400).json({ error: "Missing order details" });
    }

    const existing = await db.collection("orders").where("reference", "==", reference).limit(1).get();
    if (!existing.empty) {
      return res.status(200).json({ ok: true });
    }

    let total = 0;
    const lines = [];
    for (const item of items) {
      const qty = Number(item.qty);
      if (!item.id || !Number.isInteger(qty) || qty < 1 || qty > 20) {
        return res.status(400).json({ error: "Invalid item" });
      }
      const snap = await db.collection("products").doc(String(item.id)).get();
      if (!snap.exists) {
        return res.status(400).json({ error: "Item not found" });
      }
      const p = snap.data();
      total += p.price * qty;
      lines.push({ id: snap.id, name: p.name, price: p.price, qty });
    }

    const verify = await fetch("https://api.paystack.co/transaction/verify/" + encodeURIComponent(reference), {
      headers: { Authorization: "Bearer " + process.env.PAYSTACK_SECRET_KEY },
    });
    const result = await verify.json();

    if (!result.status || !result.data || result.data.status !== "success") {
      return res.status(402).json({ error: "Payment not verified" });
    }
    if (result.data.currency !== "NGN" || result.data.amount !== Math.round(total * 100)) {
      return res.status(402).json({ error: "Amount does not match" });
    }

    const method = customer.method === "pickup" ? "pickup" : "delivery";

    await db.collection("orders").add({
      reference,
      items: lines,
      total,
      customer: {
        name: clean(customer.name, 80),
        phone: clean(customer.phone, 20),
        email: clean(customer.email, 100),
        method,
        address: method === "pickup" ? "" : clean(customer.address, 300),
      },
      status: "paid",
      createdAt: FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}