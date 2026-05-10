import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTrip, getStops, getStopActivities } from '../../services/api';
import { Calendar, DollarSign, MapPin, Loader2, Edit, CheckSquare, StickyNote, Clock } from 'lucide-react';

export default function ItineraryView() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [activitiesMap, setActivitiesMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, [id]);

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

  // Group stops by day
  const groupByDay = () => {
    if (!trip || stops.length === 0) return [];
    const startDate = new Date(trip.start_date);
    const dayMap = {};

    stops.forEach(stop => {
      let dayNum = 1;
      if (stop.arrival_date) {
        const arrival = new Date(stop.arrival_date);
        dayNum = Math.max(1, Math.floor((arrival - startDate) / (1000 * 60 * 60 * 24)) + 1);
      }
      if (!dayMap[dayNum]) {
        const dayDate = new Date(startDate);
        dayDate.setDate(dayDate.getDate() + dayNum - 1);
        dayMap[dayNum] = { dayNum, date: dayDate, stops: [] };
      }
      dayMap[dayNum].stops.push(stop);
    });

    return Object.values(dayMap).sort((a, b) => a.dayNum - b.dayNum);
  };

  if (loading) return <div className="pt-20 flex justify-center"><Loader2 size={32} className="animate-spin text-amber-700" /></div>;
  if (!trip) return <div className="pt-20 text-center text-amber-700">Trip not found</div>;

  const badgeClass = trip.status === 'ONGOING' ? 'badge-ongoing' : trip.status === 'UPCOMING' ? 'badge-upcoming' : 'badge-completed';
  const days = groupByDay();

  return (
    <div className="pt-20 pb-12 max-w-5xl mx-auto px-4">
      <div className="animate-fadeInUp">
        {/* Trip Header */}
        <div className="glass rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <span className={`badge ${badgeClass} mb-3 inline-block`}>{trip.status}</span>
              <h1 className="text-2xl md:text-3xl font-bold text-amber-900">{trip.title}</h1>
              <p className="text-amber-700 mt-2">{trip.description}</p>
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-amber-600">
                <span className="flex items-center gap-1"><Calendar size={16} className="text-amber-700" /> {new Date(trip.start_date).toLocaleDateString()} — {new Date(trip.end_date).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><DollarSign size={16} className="text-emerald-600" /> Budget: ${trip.total_budget}</span>
                <span className="flex items-center gap-1"><MapPin size={16} className="text-orange-600" /> {stops.length} stops</span>
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
        <h2 className="text-2xl font-bold text-amber-900 mb-6">Itinerary</h2>
        {stops.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <MapPin size={48} className="mx-auto text-amber-400 mb-4" />
            <p className="text-amber-700 mb-4">No stops added yet</p>
            <Link to={`/trips/${id}/builder`} className="btn-primary"><Edit size={18} /> Build Itinerary</Link>
          </div>
        ) : (
          <div className="space-y-8">
            {days.map((day, dayIdx) => (
              <div key={day.dayNum} className="animate-fadeInUp" style={{animationDelay: `${dayIdx * 0.1}s`}}>
                {/* Day Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    D{day.dayNum}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-amber-900">Day {day.dayNum}</h3>
                    <p className="text-sm text-amber-600">{day.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-amber-300 to-transparent ml-4" />
                </div>

                {/* Stops for this day */}
                <div className="ml-5 border-l-2 border-amber-200 pl-6 space-y-4">
                  {day.stops.map((stop, idx) => (
                    <div key={stop.id} className="glass rounded-2xl overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-700/15 to-orange-600/15 px-5 py-3 flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-600 ring-4 ring-amber-100 -ml-[1.85rem]" />
                        <div className="flex-1">
                          <h4 className="text-amber-900 font-semibold">{stop.section_title}</h4>
                          {stop.city_name && <p className="text-amber-600 text-sm">{stop.city_name}</p>}
                        </div>
                        {stop.section_budget > 0 && <span className="badge badge-upcoming">${stop.section_budget}</span>}
                      </div>

                      <div className="p-5">
                        {stop.description && <p className="text-amber-700 text-sm mb-3">{stop.description}</p>}
                        {stop.arrival_date && (
                          <p className="text-xs text-amber-600 mb-3 flex items-center gap-1">
                            <Clock size={12} /> {new Date(stop.arrival_date).toLocaleDateString()} — {stop.departure_date ? new Date(stop.departure_date).toLocaleDateString() : '...'}
                          </p>
                        )}

                        {activitiesMap[stop.id]?.length > 0 && (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="text-amber-600 border-b border-amber-200">
                                  <th className="text-left pb-2 font-medium">Activity</th>
                                  <th className="text-right pb-2 font-medium">Cost</th>
                                </tr>
                              </thead>
                              <tbody>
                                {activitiesMap[stop.id].map(a => (
                                  <tr key={a.id} className="border-b border-amber-100">
                                    <td className="py-2.5 text-amber-800">{a.activity_name || a.custom_name}</td>
                                    <td className="py-2.5 text-right text-emerald-600 font-medium">${a.actual_cost}</td>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
