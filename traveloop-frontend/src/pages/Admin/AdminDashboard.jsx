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
    <div className="glass hover:-translate-y-1 hover:shadow-soft transition-all duration-300" style={{ borderRadius: '24px', padding: '28px', height: '140px', border: '1px solid rgba(120,90,60,0.08)' }}>
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-amber-950 shrink-0 shadow-sm`}>{card.icon}</div>
        <div>
          <p className="text-3xl font-bold text-amber-950">{displayValue}</p>
          <p className="text-amber-900/70 text-sm font-medium">{card.label}</p>
        </div>
      </div>
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
    <div className="admin-page">
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
    <div className="admin-page">
      <div className="animate-fadeInUp">
        <h1 className="text-amber-950 font-bold mb-2 flex items-center gap-3" style={{ fontSize: '36px' }}><LayoutDashboard size={32} className="text-amber-700" /> Admin Dashboard</h1>
        <p className="text-amber-900/70 mb-10">Overview of the Traveloop platform</p>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: '28px', marginBottom: '40px' }}>
          {statCards.map(card => (
            <AnimatedStat key={card.label} card={card} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: '32px', marginBottom: '40px' }}>
          <div className="glass" style={{ borderRadius: '24px', padding: '32px', border: '1px solid rgba(120,90,60,0.08)' }}>
            <h3 className="text-amber-950 font-bold text-lg mb-6">Trip Status Distribution</h3>
            <div style={{ minHeight: '360px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={tripData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value">
                    {tripData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid rgba(120,90,60,0.1)', borderRadius: '16px', color: '#451a03', boxShadow: '0 10px 25px rgba(120,90,60,0.1)' }} />
                  <Legend wrapperStyle={{ color: '#78350f', fontSize: '14px', fontWeight: 500 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass" style={{ borderRadius: '24px', padding: '32px', border: '1px solid rgba(120,90,60,0.08)' }}>
            <h3 className="text-amber-950 font-bold text-lg mb-6">Platform Overview</h3>
            <div style={{ minHeight: '360px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={overviewData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,90,60,0.1)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#78350f', fontSize: 13 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#78350f', fontSize: 13 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid rgba(120,90,60,0.1)', borderRadius: '16px', color: '#451a03', boxShadow: '0 10px 25px rgba(120,90,60,0.1)' }} cursor={{fill: 'rgba(120,90,60,0.04)'}} />
                  <Bar dataKey="value" fill="#d97706" radius={[8, 8, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass" style={{ borderRadius: '24px', padding: '32px', border: '1px solid rgba(120,90,60,0.08)' }}>
            <h3 className="text-amber-950 font-bold text-lg mb-6">Growth Trend <span className="text-amber-900/50 text-sm font-medium ml-2">(last 12 months)</span></h3>
            <div style={{ minHeight: '360px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,90,60,0.1)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: '#78350f', fontSize: 12 }} axisLine={false} tickLine={false} interval={1} />
                  <YAxis tick={{ fill: '#78350f', fontSize: 13 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#fff', border: '1px solid rgba(120,90,60,0.1)', borderRadius: '16px', color: '#451a03', boxShadow: '0 10px 25px rgba(120,90,60,0.1)' }}
                    formatter={(value, name) => [value, name === 'cumulative_users' ? 'Users' : 'Trips']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend wrapperStyle={{ color: '#78350f', fontSize: '14px', fontWeight: 500 }} formatter={(val) => val === 'cumulative_users' ? 'Users' : 'Trips'} />
                  <Line type="monotone" dataKey="cumulative_users" stroke="#d97706" strokeWidth={4} dot={{ r: 5, fill: '#d97706', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="cumulative_trips" stroke="#10b981" strokeWidth={4} dot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="admin-grid">
          {/* Users Table */}
          <div className="users-card glass" style={{ border: '1px solid rgba(120,90,60,0.08)' }}>
            <div className="px-8 py-6 border-b border-amber-900/10 bg-white/40">
              <h3 className="text-amber-950 font-bold text-lg">Registered Users</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="users-table text-sm">
                <thead>
                  <tr className="text-amber-900/50 border-b border-amber-900/10">
                    <th className="text-left p-6 font-semibold uppercase tracking-wider text-xs">Name</th>
                    <th className="text-left p-6 font-semibold uppercase tracking-wider text-xs">Email</th>
                    <th className="text-left p-6 font-semibold uppercase tracking-wider text-xs">Location</th>
                    <th className="text-center p-6 font-semibold uppercase tracking-wider text-xs">Trips</th>
                    <th className="text-left p-6 font-semibold uppercase tracking-wider text-xs">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-amber-900/5 hover:bg-amber-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="user-info">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-orange-50 border border-amber-900/10 flex items-center justify-center text-amber-950 text-sm font-bold shadow-sm">
                            {u.full_name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <span className="text-amber-950 font-bold">{u.full_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-amber-900/70 font-medium">{u.email}</td>
                      <td className="px-6 py-4 text-amber-900/70 font-medium">{u.city ? `${u.city}, ${u.country}` : '-'}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1.5 rounded-full bg-amber-900/5 text-amber-900 text-xs font-bold">{u.trip_count}</span>
                      </td>
                      <td className="px-6 py-4 text-amber-900/60 text-sm font-medium">{u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="activity-card glass" style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(120,90,60,0.08)' }}>
            <div className="px-8 py-6 border-b border-amber-900/10 bg-white/40">
              <h3 className="text-amber-950 font-bold text-lg flex items-center gap-2"><Clock size={20} className="text-amber-700" /> Recent Activity</h3>
            </div>
            <div style={{ padding: '24px' }} className="space-y-2">
              {activityFeed.map((a, i) => (
                <div key={a.id} className="activity-item p-4 rounded-2xl hover:bg-amber-50/50 transition-colors animate-fadeInUp" style={{animationDelay: `${i * 0.1}s`}}>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-50 border border-amber-900/5 flex items-center justify-center text-amber-900 shrink-0 shadow-sm`}>
                    {a.icon}
                  </div>
                  <div className="activity-text flex-1 min-w-0 pt-0.5">
                    <p className="text-amber-950 font-semibold text-sm">{a.text}</p>
                    <p className="text-amber-900/50 text-xs font-medium mt-1">{a.time}</p>
                  </div>
                </div>
              ))}
              {activityFeed.length === 0 && (
                <div className="text-center py-8 text-amber-900/50 text-sm font-medium">No recent activity</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
