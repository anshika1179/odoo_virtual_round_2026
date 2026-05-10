import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTrip, getStops, getStopActivities } from '../../services/api';
import { Calendar, DollarSign, MapPin, Activity, Loader2, Edit, Share2, FileText, CheckSquare, StickyNote } from 'lucide-react';

export default function ItineraryView() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [activitiesMap, setActivitiesMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const tripRes = await getTrip(id);
      setTrip(tripRes.data);
      const stopsRes = await getStops(id);
      setStops(stopsRes.data);
      const aMap = {};
      for (const s of stopsRes.data) {
        try { const aRes = await getStopActivities(s.id); aMap[s.id] = aRes.data; } catch { aMap[s.id] = []; }
      }
      setActivitiesMap(aMap);
    } catch {} finally { setLoading(false); }
  };

  if (loading) return <div className="pt-20 flex justify-center"><Loader2 size={32} className="animate-spin text-indigo-400" /></div>;
  if (!trip) return <div className="pt-20 text-center text-slate-400">Trip not found</div>;

  const badgeClass = trip.status === 'ONGOING' ? 'badge-ongoing' : trip.status === 'UPCOMING' ? 'badge-upcoming' : 'badge-completed';

  return (
    <div className="pt-20 pb-12 max-w-5xl mx-auto px-4">
      <div className="animate-fadeInUp">
        {/* Trip Header */}
        <div className="glass rounded-2xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <span className={`badge ${badgeClass} mb-3 inline-block`}>{trip.status}</span>
              <h1 className="text-3xl font-bold text-white">{trip.title}</h1>
              <p className="text-slate-400 mt-2">{trip.description}</p>
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-400">
                <span className="flex items-center gap-1"><Calendar size={16} className="text-indigo-400" /> {new Date(trip.start_date).toLocaleDateString()} — {new Date(trip.end_date).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><DollarSign size={16} className="text-green-400" /> Budget: ${trip.total_budget}</span>
                <span className="flex items-center gap-1"><MapPin size={16} className="text-purple-400" /> {stops.length} stops</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to={`/trips/${id}/builder`} className="btn-secondary text-sm"><Edit size={16} /> Edit</Link>
              <Link to={`/trips/${id}/budget`} className="btn-secondary text-sm"><DollarSign size={16} /> Budget</Link>
              <Link to={`/trips/${id}/checklist`} className="btn-secondary text-sm"><CheckSquare size={16} /> Checklist</Link>
              <Link to={`/trips/${id}/notes`} className="btn-secondary text-sm"><StickyNote size={16} /> Notes</Link>
            </div>
          </div>
        </div>

        {/* Day-wise Itinerary */}
        <h2 className="text-2xl font-bold text-white mb-6">Itinerary</h2>
        {stops.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <MapPin size={48} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-400 mb-4">No stops added yet</p>
            <Link to={`/trips/${id}/builder`} className="btn-primary"><Edit size={18} /> Build Itinerary</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {stops.map((stop, idx) => (
              <div key={stop.id} className="glass rounded-2xl overflow-hidden animate-fadeInUp" style={{animationDelay: `${idx * 0.1}s`}}>
                <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 px-6 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/30 flex items-center justify-center text-white font-bold">{idx + 1}</div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{stop.section_title}</h3>
                    {stop.city_name && <p className="text-indigo-300 text-sm">{stop.city_name}</p>}
                  </div>
                  {stop.section_budget > 0 && <span className="badge badge-upcoming">${stop.section_budget}</span>}
                </div>

                <div className="p-6">
                  {stop.description && <p className="text-slate-400 text-sm mb-4">{stop.description}</p>}
                  {stop.arrival_date && (
                    <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
                      <Calendar size={12} /> {new Date(stop.arrival_date).toLocaleDateString()} — {stop.departure_date ? new Date(stop.departure_date).toLocaleDateString() : '...'}
                    </p>
                  )}

                  {/* Activities Table */}
                  {activitiesMap[stop.id]?.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-slate-400 border-b border-slate-700">
                            <th className="text-left pb-2 font-medium">Physical Activity</th>
                            <th className="text-right pb-2 font-medium">Expense</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activitiesMap[stop.id].map(a => (
                            <tr key={a.id} className="border-b border-slate-800">
                              <td className="py-3 text-slate-300">{a.activity_name || a.custom_name}</td>
                              <td className="py-3 text-right text-green-400">${a.actual_cost}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
