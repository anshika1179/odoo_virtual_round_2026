import { useState, useEffect } from 'react';
import { getAdminStats, getAdminUsers } from '../../services/api';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, Map, Globe, TrendingUp, Loader2, LayoutDashboard } from 'lucide-react';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminStats(), getAdminUsers()])
      .then(([s, u]) => { setStats(s.data); setUsers(u.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="pt-20 flex justify-center"><Loader2 size={32} className="animate-spin text-indigo-400" /></div>;

  const tripData = [
    { name: 'Ongoing', value: stats?.ongoing_trips || 0 },
    { name: 'Upcoming', value: stats?.upcoming_trips || 0 },
    { name: 'Completed', value: stats?.completed_trips || 0 },
  ];

  const overviewData = [
    { name: 'Users', value: stats?.total_users || 0 },
    { name: 'Trips', value: stats?.total_trips || 0 },
    { name: 'Cities', value: stats?.total_cities || 0 },
    { name: 'Activities', value: stats?.total_activities || 0 },
    { name: 'Posts', value: stats?.community_posts || 0 },
  ];

  const statCards = [
    { label: 'Total Users', value: stats?.total_users || 0, icon: <Users size={24} />, color: 'from-indigo-500 to-indigo-600' },
    { label: 'Total Trips', value: stats?.total_trips || 0, icon: <Map size={24} />, color: 'from-purple-500 to-purple-600' },
    { label: 'Cities', value: stats?.total_cities || 0, icon: <Globe size={24} />, color: 'from-amber-500 to-amber-600' },
    { label: 'Activities', value: stats?.total_activities || 0, icon: <TrendingUp size={24} />, color: 'from-green-500 to-green-600' },
  ];

  return (
    <div className="pt-20 pb-12 max-w-7xl mx-auto px-4">
      <div className="animate-fadeInUp">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3"><LayoutDashboard size={32} className="text-indigo-400" /> Admin Dashboard</h1>
        <p className="text-slate-400 mb-8">Overview of the Traveloop platform</p>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(card => (
            <div key={card.label} className="glass rounded-2xl p-6 glass-hover">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-3`}>{card.icon}</div>
              <p className="text-3xl font-bold text-white">{card.value}</p>
              <p className="text-slate-400 text-sm">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="glass rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">Trip Status Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={tripData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={5} dataKey="value">
                  {tripData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#e2e8f0' }} />
                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">Platform Overview</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={overviewData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#e2e8f0' }} />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">Growth Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={[
                { month: 'Jan', users: 10 }, { month: 'Feb', users: 25 }, { month: 'Mar', users: 40 },
                { month: 'Apr', users: 65 }, { month: 'May', users: stats?.total_users || 80 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#e2e8f0' }} />
                <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={3} dot={{ r: 5, fill: '#6366f1' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Users Table */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 px-6 py-4">
            <h3 className="text-white font-semibold">Registered Users</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left p-4 font-medium">Name</th>
                  <th className="text-left p-4 font-medium">Email</th>
                  <th className="text-left p-4 font-medium">Location</th>
                  <th className="text-center p-4 font-medium">Trips</th>
                  <th className="text-left p-4 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-slate-800 hover:bg-white/[0.02]">
                    <td className="p-4 text-white font-medium">{u.full_name}</td>
                    <td className="p-4 text-slate-400">{u.email}</td>
                    <td className="p-4 text-slate-400">{u.city ? `${u.city}, ${u.country}` : '-'}</td>
                    <td className="p-4 text-center"><span className="badge badge-upcoming">{u.trip_count}</span></td>
                    <td className="p-4 text-slate-500 text-xs">{u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
