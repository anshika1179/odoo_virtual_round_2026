import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProfile, updateProfile, getTrips, uploadProfilePhoto, deleteProfilePhoto } from '../../services/api';
import { User, Mail, Phone, MapPin, Save, Loader2, Calendar, Eye, Edit3, Camera, Trash2, CheckCircle } from 'lucide-react';

export default function UserProfile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({});
  const [trips, setTrips] = useState([]);
  const [prevTrips, setPrevTrips] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    if (user) {
      setForm({ full_name: user.full_name, phone: user.phone || '', city: user.city || '', country: user.country || '', additional_info: user.additional_info || '' });
      getTrips({ status: 'UPCOMING' }).then(r => setTrips(r.data.slice(0, 4))).catch(() => {});
      getTrips({ status: 'COMPLETED' }).then(r => setPrevTrips(r.data.slice(0, 4))).catch(() => {});
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateProfile(form);
      setUser(res.data);
      setEditing(false);
    } catch {} finally { setSaving(false); }
  };

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadMsg('Please select a valid image (JPG, PNG, GIF, WEBP)');
      setTimeout(() => setUploadMsg(''), 3000);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadMsg('Image must be under 5 MB');
      setTimeout(() => setUploadMsg(''), 3000);
      return;
    }

    setUploading(true);
    setUploadMsg('');
    try {
      const res = await uploadProfilePhoto(file);
      setUser(res.data);
      setUploadMsg('Photo updated!');
      setTimeout(() => setUploadMsg(''), 3000);
    } catch (err) {
      setUploadMsg(err.response?.data?.detail || 'Upload failed');
      setTimeout(() => setUploadMsg(''), 4000);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleRemovePhoto = async () => {
    if (!user?.profile_photo_url) return;
    setUploading(true);
    try {
      const res = await deleteProfilePhoto();
      setUser(res.data);
      setUploadMsg('Photo removed');
      setTimeout(() => setUploadMsg(''), 3000);
    } catch {} finally { setUploading(false); }
  };

  const set = (key) => (e) => setForm({...form, [key]: e.target.value});

  // Photo URL — served via Vite's /static proxy to the backend
  const photoSrc = user?.profile_photo_url || null;

  return (
    <div className="pt-20 pb-12 max-w-5xl mx-auto px-4">
      <div className="animate-fadeInUp">
        {/* Profile Header */}
        <div className="glass rounded-2xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar with Upload */}
            <div className="relative group shrink-0">
              {photoSrc ? (
                <img
                  src={photoSrc}
                  alt={user?.full_name}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-500/30"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
              ) : null}
              <div
                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold"
                style={{ display: photoSrc ? 'none' : 'flex' }}
              >
                {user?.full_name?.[0]?.toUpperCase() || '?'}
              </div>

              {/* Camera overlay */}
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              >
                {uploading ? (
                  <Loader2 size={24} className="text-white animate-spin" />
                ) : (
                  <Camera size={24} className="text-white" />
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handlePhotoSelect}
                className="hidden"
              />

              {/* Remove photo button */}
              {photoSrc && !uploading && (
                <button
                  onClick={handleRemovePhoto}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-400"
                  title="Remove photo"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-white">{user?.full_name}</h1>
                <button onClick={() => setEditing(!editing)} className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
                  <Edit3 size={18} />
                </button>
              </div>
              <p className="text-slate-400 flex items-center gap-2"><Mail size={16} /> {user?.email}</p>
              {user?.city && <p className="text-slate-500 text-sm flex items-center gap-2 mt-1"><MapPin size={14} /> {user.city}, {user.country}</p>}

              {/* Upload status message */}
              {uploadMsg && (
                <p className={`text-sm mt-2 flex items-center gap-1 ${uploadMsg.includes('failed') || uploadMsg.includes('Please') || uploadMsg.includes('must') ? 'text-red-400' : 'text-green-400'}`}>
                  {uploadMsg.includes('failed') || uploadMsg.includes('Please') || uploadMsg.includes('must') ? null : <CheckCircle size={14} />}
                  {uploadMsg}
                </p>
              )}
            </div>
          </div>

          {editing && (
            <div className="mt-6 pt-6 border-t border-slate-700 space-y-4 animate-fadeInUp">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Full Name</label>
                  <input className="input-glass" value={form.full_name} onChange={set('full_name')} />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Phone</label>
                  <input className="input-glass" value={form.phone} onChange={set('phone')} />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">City</label>
                  <input className="input-glass" value={form.city} onChange={set('city')} />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Country</label>
                  <input className="input-glass" value={form.country} onChange={set('country')} />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">About</label>
                <textarea className="input-glass" rows={3} value={form.additional_info} onChange={set('additional_info')} />
              </div>
              <button onClick={handleSave} disabled={saving} className="btn-primary">
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Trips Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Upcoming Trips</h2>
            {trips.length > 0 ? (
              <div className="space-y-3">
                {trips.map(t => (
                  <div key={t.id} className="glass rounded-xl p-4 flex items-center justify-between glass-hover">
                    <div>
                      <h3 className="text-white font-medium">{t.title}</h3>
                      <p className="text-slate-500 text-xs flex items-center gap-1"><Calendar size={12} /> {new Date(t.start_date).toLocaleDateString()}</p>
                    </div>
                    <Link to={`/trips/${t.id}/view`} className="btn-secondary text-xs py-1.5 px-3"><Eye size={14} /> View</Link>
                  </div>
                ))}
              </div>
            ) : <div className="glass rounded-xl p-8 text-center text-slate-500">No upcoming trips</div>}
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">Previous Trips</h2>
            {prevTrips.length > 0 ? (
              <div className="space-y-3">
                {prevTrips.map(t => (
                  <div key={t.id} className="glass rounded-xl p-4 flex items-center justify-between glass-hover">
                    <div>
                      <h3 className="text-white font-medium">{t.title}</h3>
                      <p className="text-slate-500 text-xs flex items-center gap-1"><Calendar size={12} /> {new Date(t.start_date).toLocaleDateString()}</p>
                    </div>
                    <Link to={`/trips/${t.id}/view`} className="btn-secondary text-xs py-1.5 px-3"><Eye size={14} /> View</Link>
                  </div>
                ))}
              </div>
            ) : <div className="glass rounded-xl p-8 text-center text-slate-500">No previous trips</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
