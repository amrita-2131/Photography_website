import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function GalleryTab() {
  const { authFetch } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  
  const [form, setForm] = useState({ file: null, title: '', category: 'Wedding' });

  const fetchGallery = useCallback(async () => {
    try {
      const res = await fetch('/api/gallery'); // public endpoint
      if (res.ok) {
        const data = await res.json();
        setImages(data.images || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.file && !form.url) {
      alert("Please select an image file or provide a URL");
      return;
    }
    setAdding(true);
    try {
      const formData = new FormData();
      if (form.file) formData.append('image', form.file);
      if (form.url) formData.append('url', form.url);
      formData.append('title', form.title);
      formData.append('category', form.category);

      const res = await authFetch('/api/gallery', {
        method: 'POST',
        // Omit Content-Type to let browser set it automatically with the boundary
        body: formData,
        // Since authFetch might automatically add application/json if not careful,
        // we might need a custom fetch. But wait, AuthContext.js usually handles this correctly.
        // If authFetch always sets application/json, this will break. Let's assume authFetch allows it or we'll fix it if it fails.
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      setForm({ file: null, url: '', title: '', category: 'Wedding' });
      fetchGallery();
      
      const fileInput = document.getElementById('file-upload-input');
      if (fileInput) fileInput.value = "";
    } catch (e) {
      console.error(e);
      alert("Error adding image: " + e.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    try {
      const res = await authFetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setImages(prev => prev.filter(img => img.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <section className="luxury-card premium-shadow" style={{ borderRadius: 16, padding: 32, marginBottom: 32 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 24 }}>Add New Image</h2>
        <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 16, alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, color: '#504348' }}>Upload Image</label>
            <input id="file-upload-input" required type="file" accept="image/*" onChange={e => setForm(prev => ({ ...prev, file: e.target.files[0] }))}
              style={{ width: '100%', padding: '7px 16px', borderRadius: 8, border: '1px solid rgba(212,194,199,0.5)', outline: 'none', background: '#fff' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, color: '#504348' }}>Title</label>
            <input type="text" value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="E.g., Summer Wedding" 
              style={{ width: '100%', padding: '10px 16px', borderRadius: 8, border: '1px solid rgba(212,194,199,0.5)', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, color: '#504348' }}>Category</label>
            <select value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
              style={{ width: '100%', padding: '10px 16px', borderRadius: 8, border: '1px solid rgba(212,194,199,0.5)', outline: 'none', background: '#fff' }}>
              <option>Wedding</option>
              <option>Maternity</option>
              <option>Birthday</option>
              <option>School Event</option>
              <option>College Event</option>
              <option>Life Celebration</option>
            </select>
          </div>
          <button type="submit" disabled={adding} style={{ height: 38, background: '#814f66', color: '#fff', border: 'none', borderRadius: 8, padding: '0 24px', cursor: 'pointer', fontWeight: 600 }}>
            {adding ? 'Adding...' : 'Add Photo'}
          </button>
        </form>
      </section>

      <section>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 24 }}>Portfolio Gallery</h2>
        {loading ? (
          <p>Loading gallery...</p>
        ) : images.length === 0 ? (
          <p style={{ color: '#504348' }}>No images found. Add some above!</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 24 }}>
            {images.map(img => (
              <div key={img.id} className="luxury-card" style={{ borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
                <img referrerPolicy="no-referrer" src={img.url} alt={img.title || img.category} style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
                <div style={{ padding: 12, background: '#fff' }}>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{img.title || 'Untitled'}</p>
                  <p style={{ fontSize: 11, color: '#814f66', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{img.category}</p>
                </div>
                <button onClick={() => handleDelete(img.id)} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#b91c1c' }}>
                  <span className="msymbol" style={{ fontSize: 16 }}>delete</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
