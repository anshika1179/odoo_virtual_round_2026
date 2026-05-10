import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProfile, updateProfile, getTrips } from '../../services/api';
import { User, Mail, Phone, MapPin, Save, Loader2, Calendar, Eye, Edit3 } from 'lucide-react';

export default function UserProfile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({});
  const [trips, setTrips] = useState([]);
  const [prevTrips, setPrevTrips] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

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

  const set = (key) => (e) => setForm({...form, [key]: e.target.value});

  return (
    <div className="pt-20 pb-12 max-w-5xl mx-auto px-4">
      <div className="animate-fadeInUp">
        {/* Profile Header */}
        <div className="glass rounded-2xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shrink-0">
              {user?.full_name?.[0]?.toUpperCase() || '?'}
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
