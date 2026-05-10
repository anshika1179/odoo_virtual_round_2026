import { useState, useEffect, useRef } from 'react';
import { getAdminStats, getAdminUsers, getAdminGrowth } from '../../services/api';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, Map, Globe, TrendingUp, LayoutDashboard, Clock, UserPlus, Plane as PlaneIcon } from 'lucide-react';
import { StatSkeleton, TableSkeleton } from '../../components/common/Skeletons';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

/* Animated counter hook */
function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    if (typeof target !== 'number' || target === 0) { setCount(target); return; }
    let start = 0;
    const step = Math.max(1, Math.ceil(target / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function AnimatedStat({ card }) {
  const displayValue = useCountUp(card.value);
  return (
    <div className="glass rounded-2xl p-6 glass-hover">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-amber-900 mb-3`}>{card.icon}</div>
      <p className="text-3xl font-bold text-amber-900">{displayValue}</p>
      <p className="text-amber-700 text-sm">{card.label}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminStats(), getAdminUsers(), getAdminGrowth()])
      .then(([s, u, g]) => { setStats(s.data); setUsers(u.data); setGrowthData(g.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="pt-20 pb-12 max-w-7xl mx-auto px-4">
      <div className="animate-fadeInUp">
        <div className="h-8 skeleton rounded-lg w-64 mb-2" />
        <div className="h-5 skeleton rounded-lg w-80 mb-8" />
        <StatSkeleton count={4} />
        <div className="mt-8"><TableSkeleton rows={5} cols={5} /></div>
      </div>
    </div>
  );

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
    { label: 'Total Users', value: stats?.total_users || 0, icon: <Users size={24} />, color: 'from-amber-700 to-indigo-600' },
    { label: 'Total Trips', value: stats?.total_trips || 0, icon: <Map size={24} />, color: 'from-purple-500 to-amber-900' },
    { label: 'Cities', value: stats?.total_cities || 0, icon: <Globe size={24} />, color: 'from-amber-500 to-amber-600' },
    { label: 'Activities', value: stats?.total_activities || 0, icon: <TrendingUp size={24} />, color: 'from-green-500 to-green-600' },
  ];

  // Generate mock activity feed from users data
  const activityFeed = users.slice(0, 5).map((u, i) => ({
    id: i,
    icon: i % 3 === 0 ? <UserPlus size={16} /> : i % 3 === 1 ? <PlaneIcon size={16} /> : <Globe size={16} />,
    iconColor: i % 3 === 0 ? 'from-amber-700 to-blue-600' : i % 3 === 1 ? 'from-purple-500 to-pink-600' : 'from-amber-500 to-orange-600',
    text: i % 3 === 0 ? `${u.full_name} joined Traveloop` : i % 3 === 1 ? `${u.full_name} created a new trip` : `${u.full_name} explored destinations`,
    time: u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Recently',
  }));

  return (
    <div className="pt-20 pb-12 max-w-7xl mx-auto px-4">
      <div className="animate-fadeInUp">
        <h1 className="text-3xl font-bold text-amber-900 mb-2 flex items-center gap-3"><LayoutDashboard size={32} className="text-amber-700" /> Admin Dashboard</h1>
        <p className="text-amber-700 mb-8">Overview of the Traveloop platform</p>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(card => (
            <AnimatedStat key={card.label} card={card} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="glass rounded-2xl p-6">
            <h3 className="text-amber-900 font-semibold mb-4">Trip Status Distribution</h3>
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
            <h3 className="text-amber-900 font-semibold mb-4">Platform Overview</h3>
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
            <h3 className="text-amber-900 font-semibold mb-4">Growth Trend <span className="text-amber-600 text-xs font-normal">(last 12 months)</span></h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 11 }} interval={1} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#e2e8f0' }}
                  formatter={(value, name) => [value, name === 'cumulative_users' ? 'Users' : 'Trips']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} formatter={(val) => val === 'cumulative_users' ? 'Users' : 'Trips'} />
                <Line type="monotone" dataKey="cumulative_users" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="cumulative_trips" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Users Table */}
          <div className="lg:col-span-2 glass rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-700/15 to-orange-600/15 px-6 py-4">
              <h3 className="text-amber-900 font-semibold">Registered Users</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-amber-700 border-b border-amber-200">
                    <th className="text-left p-4 font-medium">Name</th>
                    <th className="text-left p-4 font-medium">Email</th>
                    <th className="text-left p-4 font-medium">Location</th>
                    <th className="text-center p-4 font-medium">Trips</th>
                    <th className="text-left p-4 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-amber-100 hover:bg-white/[0.02]">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-amber-900 text-xs font-bold">
                            {u.full_name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <span className="text-amber-900 font-medium">{u.full_name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-amber-700">{u.email}</td>
                      <td className="p-4 text-amber-700">{u.city ? `${u.city}, ${u.country}` : '-'}</td>
                      <td className="p-4 text-center"><span className="badge badge-upcoming">{u.trip_count}</span></td>
                      <td className="p-4 text-amber-600 text-xs">{u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-6 py-4">
              <h3 className="text-amber-900 font-semibold flex items-center gap-2"><Clock size={16} /> Recent Activity</h3>
            </div>
            <div className="p-4 space-y-1">
              {activityFeed.map((a, i) => (
                <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition-colors animate-fadeInUp" style={{animationDelay: `${i * 0.1}s`}}>
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${a.iconColor} flex items-center justify-center text-amber-900 shrink-0 mt-0.5`}>
                    {a.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-amber-800 text-sm">{a.text}</p>
                    <p className="text-amber-500 text-xs mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
              {activityFeed.length === 0 && (
                <div className="text-center py-8 text-amber-600 text-sm">No recent activity</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
