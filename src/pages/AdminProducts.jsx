import { useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { formatNaira } from "../data/services";

const CLOUD_NAME = "auvnxgsh";
const UPLOAD_PRESET = "adorned_products";

const categories = ["Earrings", "Nose jewelry", "Body jewelry", "Necklaces", "Bracelets", "Rings"];

const emptyForm = { name: "", price: "", category: categories[0], description: "", image: "", inStock: true };

async function uploadImage(file) {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", UPLOAD_PRESET);
  const res = await fetch("https://api.cloudinary.com/v1_1/" + CLOUD_NAME + "/image/upload", { method: "POST", body: data });
  if (!res.ok) throw new Error("Upload failed");
  const json = await res.json();
  return json.secure_url;
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setMessage("Could not load products.");
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function startAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setMessage("");
  }

  function startEdit(p) {
    setForm({ name: p.name, price: String(p.price), category: p.category, description: p.description || "", image: p.image || "", inStock: p.inStock });
    setEditingId(p.id);
    setShowForm(true);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancel() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setMessage("");
    try {
      const url = await uploadImage(file);
      setForm((f) => ({ ...f, image: url }));
    } catch (err) {
      console.error(err);
      setMessage("Photo upload failed. Try again.");
    }
    setUploading(false);
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const data = {
      name: form.name.trim(),
      price: Number(form.price),
      category: form.category,
      description: form.description.trim(),
      image: form.image,
      inStock: form.inStock,
    };
    try {
      if (editingId) {
        await updateDoc(doc(db, "products", editingId), data);
      } else {
        await addDoc(collection(db, "products"), { ...data, createdAt: serverTimestamp() });
      }
      cancel();
    } catch (err) {
      console.error(err);
      setMessage("Could not save the product.");
    }
    setSaving(false);
  }

  async function toggleStock(p) {
    try {
      await updateDoc(doc(db, "products", p.id), { inStock: !p.inStock });
    } catch (err) {
      console.error(err);
      setMessage("Could not update the product.");
    }
  }

  async function remove(p) {
    if (!window.confirm("Delete " + p.name + " for good?")) return;
    try {
      await deleteDoc(doc(db, "products", p.id));
    } catch (err) {
      console.error(err);
      setMessage("Could not delete the product.");
    }
  }

  const inputClass = "w-full bg-ink border border-gold/20 px-4 py-3 text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-gold";
  const buttonClass = "border border-gold text-gold px-4 py-2 text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="font-display text-3xl">Products</h2>
        {!showForm && <button onClick={startAdd} className="bg-gold text-ink px-6 py-2 text-sm tracking-wide font-medium hover:bg-gold-soft transition-colors">Add product</button>}
      </div>

      {message && <p className="text-gold text-sm mb-6">{message}</p>}

      {showForm && (
        <form onSubmit={save} className="border border-gold/20 bg-ink-light p-6 mb-10 space-y-4">
          <h3 className="font-display text-2xl">{editingId ? "Edit product" : "New product"}</h3>

          <input required value={form.name} onChange={(e) => update("name", e.target.value)} maxLength={80} placeholder="Product name" className={inputClass} />

          <div className="grid sm:grid-cols-2 gap-4">
            <input required type="number" min="0" step="1" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="Price in ₦" className={inputClass} />
            <select value={form.category} onChange={(e) => update("category", e.target.value)} className={inputClass}>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <textarea value={form.description} onChange={(e) => update("description", e.target.value)} maxLength={500} rows={3} placeholder="Description (material, size, etc.)" className={inputClass} />

          <div>
            <p className="text-ivory/60 text-sm mb-2">Photo</p>
            {form.image && <img src={form.image} alt="Product" className="w-32 h-32 object-cover border border-gold/20 mb-3" />}
            <input type="file" accept="image/*" onChange={handleFile} className="text-ivory/70 text-sm" />
            {uploading && <p className="text-gold text-sm mt-2">Uploading photo...</p>}
          </div>

          <label className="flex items-center gap-3 text-ivory/80">
            <input type="checkbox" checked={form.inStock} onChange={(e) => update("inStock", e.target.checked)} className="w-5 h-5 accent-[#E3A579]" />
            In stock
          </label>

          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={saving || uploading} className="bg-gold text-ink px-6 py-2 text-sm tracking-wide font-medium hover:bg-gold-soft transition-colors disabled:opacity-50">{saving ? "Saving..." : "Save product"}</button>
            <button type="button" onClick={cancel} className={buttonClass}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-ivory/50">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-ivory/50">No products yet. Click Add product to add the first one.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {products.map((p) => (
            <div key={p.id} className="border border-gold/20 bg-ink-light p-4 flex gap-4">
              <div className="w-24 h-24 shrink-0 bg-ink border border-gold/10 overflow-hidden flex items-center justify-center">
                {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <span className="text-ivory/30 text-xs text-center">No photo</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-xl truncate">{p.name}</p>
                <p className="text-ivory/50 text-xs mb-1">{p.category}</p>
                <p className="text-gold mb-2">{formatNaira(p.price)}</p>
                <p className={"text-xs tracking-[0.15em] uppercase mb-3 " + (p.inStock ? "text-ivory/70" : "text-blush-rose")}>{p.inStock ? "In stock" : "Out of stock"}</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => toggleStock(p)} className={buttonClass}>{p.inStock ? "Mark out of stock" : "Mark in stock"}</button>
                  <button onClick={() => startEdit(p)} className={buttonClass}>Edit</button>
                  <button onClick={() => remove(p)} className="border border-blush-rose text-blush-rose px-4 py-2 text-sm tracking-wide hover:bg-blush-rose hover:text-ink transition-colors">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}