import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getProfile, updateProfile, getTrips } from '../../services/api';
import { User, Mail, Phone, MapPin, Save, Loader2, Calendar, Eye, Edit3, Plane, Globe, DollarSign, Award } from 'lucide-react';

export default function UserProfile() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({});
  const [trips, setTrips] = useState([]);
  const [prevTrips, setPrevTrips] = useState([]);
  const [allTrips, setAllTrips] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ full_name: user.full_name, phone: user.phone || '', city: user.city || '', country: user.country || '', additional_info: user.additional_info || '' });
      getTrips({ status: 'UPCOMING' }).then(r => setTrips(r.data.slice(0, 4))).catch(() => {});
      getTrips({ status: 'COMPLETED' }).then(r => setPrevTrips(r.data.slice(0, 4))).catch(() => {});
      getTrips({}).then(r => setAllTrips(r.data)).catch(() => {});
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateProfile(form);
      setUser(res.data);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile');
    } finally { setSaving(false); }
  };

  const set = (key) => (e) => setForm({...form, [key]: e.target.value});

  // Compute stats
  const totalTrips = allTrips.length;
  const completedTrips = allTrips.filter(t => t.status === 'COMPLETED').length;
  const totalBudget = allTrips.reduce((sum, t) => sum + (t.total_budget || 0), 0);
  const uniqueCities = new Set(allTrips.map(t => t.title?.match(/to\s+(.+)/i)?.[1]).filter(Boolean)).size || completedTrips;

  const stats = [
    { label: 'Total Trips', value: totalTrips, icon: <Plane size={20} />, color: 'from-indigo-500 to-blue-600' },
    { label: 'Completed', value: completedTrips, icon: <Award size={20} />, color: 'from-emerald-500 to-green-600' },
    { label: 'Destinations', value: uniqueCities, icon: <Globe size={20} />, color: 'from-purple-500 to-pink-600' },
    { label: 'Total Budget', value: `$${totalBudget.toLocaleString()}`, icon: <DollarSign size={20} />, color: 'from-amber-500 to-orange-600' },
  ];

  return (
    <div className="pt-20 pb-12 max-w-5xl mx-auto px-4">
      <div className="animate-fadeInUp">
        {/* Profile Header */}
        <div className="glass rounded-2xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shrink-0 shadow-xl shadow-indigo-500/20">
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
              {user?.additional_info && <p className="text-slate-500 text-sm mt-2 italic">"{user.additional_info}"</p>}
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

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="glass rounded-2xl p-5 glass-hover animate-fadeInUp" style={{animationDelay: `${i * 0.1}s`}}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-3`}>{s.icon}</div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-slate-400 text-sm">{s.label}</p>
            </div>
          ))}
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
            ) : (
              <div className="glass rounded-xl p-8 text-center">
                <Plane size={32} className="mx-auto text-slate-600 mb-3" />
                <p className="text-slate-500">No upcoming trips</p>
                <Link to="/trips/new" className="text-indigo-400 text-sm hover:text-indigo-300 mt-2 inline-block">Plan one →</Link>
              </div>
            )}
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
            ) : (
              <div className="glass rounded-xl p-8 text-center">
                <Globe size={32} className="mx-auto text-slate-600 mb-3" />
                <p className="text-slate-500">No completed trips yet</p>
                <p className="text-slate-600 text-xs mt-1">Your travel history will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
