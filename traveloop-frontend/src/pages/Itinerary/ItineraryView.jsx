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
    <div
      className="mx-auto flex flex-col items-center"
      style={{ maxWidth: "1440px", padding: "120px 64px 80px 64px" }}
    >
      <div className="animate-fadeInUp w-full" style={{ maxWidth: "1000px" }}>
        {/* Trip Header */}
        <div 
          className="glass shadow-soft relative overflow-hidden mb-12"
          style={{ borderRadius: "32px", padding: "48px", border: "1px solid rgba(120,90,60,0.08)" }}
        >
          <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-amber-500 to-orange-500"></div>
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            <div className="flex-1">
              <span className={`badge ${badgeClass} mb-4 inline-block px-4 py-1.5 text-sm font-bold tracking-wide uppercase`}>{trip.status}</span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-amber-950 tracking-tight leading-tight mb-4">{trip.title}</h1>
              {trip.description && <p className="text-amber-900/80 text-lg leading-relaxed max-w-2xl">{trip.description}</p>}
              
              <div className="flex flex-wrap gap-6 mt-8">
                <div className="flex items-center gap-3 bg-white/40 px-4 py-2.5 rounded-xl border border-amber-900/10">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center"><Calendar size={20} className="text-amber-700" /></div>
                  <div>
                    <div className="text-xs text-amber-900/60 font-semibold uppercase tracking-wider">Dates</div>
                    <div className="text-sm font-bold text-amber-950">{new Date(trip.start_date).toLocaleDateString()} — {new Date(trip.end_date).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-emerald-50/50 px-4 py-2.5 rounded-xl border border-emerald-200/50">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center"><DollarSign size={20} className="text-emerald-700" /></div>
                  <div>
                    <div className="text-xs text-emerald-700/60 font-semibold uppercase tracking-wider">Budget</div>
                    <div className="text-sm font-bold text-emerald-900">${trip.total_budget}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-orange-50/50 px-4 py-2.5 rounded-xl border border-orange-200/50">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center"><MapPin size={20} className="text-orange-700" /></div>
                  <div>
                    <div className="text-xs text-orange-700/60 font-semibold uppercase tracking-wider">Stops</div>
                    <div className="text-sm font-bold text-orange-900">{stops.length} Locations</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap md:flex-col gap-3 shrink-0">
              <Link to={`/trips/${id}/builder`} className="btn-secondary flex items-center gap-2 justify-center" style={{ height: "48px", borderRadius: "14px", padding: "0 24px", fontWeight: 600 }}>
                <Edit size={18} /> Edit Plan
              </Link>
              <Link to={`/trips/${id}/budget`} className="btn-secondary flex items-center gap-2 justify-center" style={{ height: "48px", borderRadius: "14px", padding: "0 24px", fontWeight: 600 }}>
                <DollarSign size={18} /> Budget
              </Link>
              <Link to={`/trips/${id}/checklist`} className="btn-secondary flex items-center gap-2 justify-center" style={{ height: "48px", borderRadius: "14px", padding: "0 24px", fontWeight: 600 }}>
                <CheckSquare size={18} /> Checklist
              </Link>
              <Link to={`/trips/${id}/notes`} className="btn-secondary flex items-center gap-2 justify-center" style={{ height: "48px", borderRadius: "14px", padding: "0 24px", fontWeight: 600 }}>
                <StickyNote size={18} /> Notes
              </Link>
            </div>
          </div>
        </div>

        {/* Day-wise Itinerary */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-amber-950">Itinerary</h2>
        </div>

        {stops.length === 0 ? (
          <div 
            className="glass flex flex-col items-center justify-center text-center"
            style={{ borderRadius: "24px", padding: "80px 40px", border: "2px dashed rgba(120,90,60,0.15)" }}
          >
            <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mb-6 shadow-inner">
              <MapPin size={48} className="text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-amber-950 mb-2">No stops added yet</h3>
            <p className="text-amber-900/60 mb-8 max-w-md">Start building your perfect trip by adding destinations, dates, and budgets for each leg of your journey.</p>
            <Link to={`/trips/${id}/builder`} className="btn-primary flex items-center gap-2" style={{ height: "56px", borderRadius: "16px", padding: "0 32px", fontSize: "16px", fontWeight: 700 }}>
              <Edit size={20} /> Build Itinerary
            </Link>
          </div>
        ) : (
          <div className="space-y-16">
            {days.map((day, dayIdx) => (
              <div key={day.dayNum} className="animate-fadeInUp relative" style={{animationDelay: `${dayIdx * 0.1}s`}}>
                {/* Day Header */}
                <div className="flex items-center gap-5 mb-8 sticky top-20 z-10 bg-[#FAF7F2]/90 backdrop-blur-md py-4 rounded-2xl -mx-4 px-4">
                  <div className="shrink-0 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-700 flex flex-col items-center justify-center text-white shadow-lg" style={{ minWidth: '60px', minHeight: '60px', padding: '8px 16px' }}>
                    <span className="text-[10px] font-semibold uppercase tracking-widest opacity-80 leading-none">Day</span>
                    <span className="font-black leading-none mt-1" style={{ fontSize: String(day.dayNum).length > 4 ? '13px' : String(day.dayNum).length > 3 ? '16px' : '22px' }}>{day.dayNum}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-amber-900/60 font-semibold uppercase tracking-widest text-sm">{day.date.toLocaleDateString('en-US', { weekday: 'long' })}</p>
                    <h3 className="text-xl font-bold text-amber-950 truncate">{day.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h3>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-amber-900/20 to-transparent ml-4 hidden sm:block" />
                </div>

                {/* Stops for this day */}
                <div className="space-y-8 pl-4">
                  {day.stops.map((stop, idx) => (
                    <div key={stop.id} className="glass shadow-soft hover:shadow-lg transition-all duration-300 relative group" style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(120,90,60,0.08)' }}>
                      
                      <div className="bg-white/40 px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-900/5">
                        <div className="flex-1">
                          <h4 className="text-amber-950 font-bold text-xl">{stop.section_title}</h4>
                          {stop.city_name && (
                            <p className="text-amber-700 font-medium mt-1 flex items-center gap-1.5 text-sm">
                              <MapPin size={16} className="text-amber-500" /> {stop.city_name}
                            </p>
                          )}
                        </div>
                        {stop.section_budget > 0 && (
                          <span className="shrink-0 bg-emerald-100 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5">
                            <DollarSign size={16} />{stop.section_budget} Budget
                          </span>
                        )}
                      </div>

                      <div className="p-8">
                        {stop.description && <p className="text-amber-900/80 text-base leading-relaxed mb-6">{stop.description}</p>}
                        
                        {stop.arrival_date && (
                          <div className="inline-flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 text-amber-800 text-sm font-semibold mb-6">
                            <Clock size={16} className="text-amber-600" /> 
                            {new Date(stop.arrival_date).toLocaleDateString()} 
                            {stop.departure_date ? ` — ${new Date(stop.departure_date).toLocaleDateString()}` : ''}
                          </div>
                        )}

                        {activitiesMap[stop.id]?.length > 0 && (
                          <div className="bg-white/50 rounded-2xl p-5 border border-amber-900/5">
                            <h5 className="text-amber-950 font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                              <CheckSquare size={16} className="text-amber-600" /> Activities
                            </h5>
                            <div className="space-y-3">
                              {activitiesMap[stop.id].map(a => (
                                <div key={a.id} className="flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-white transition-colors border border-transparent hover:border-amber-900/10">
                                  <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                                    <span className="text-amber-900 font-medium">{a.activity_name || a.custom_name}</span>
                                  </div>
                                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-lg text-sm">${a.actual_cost}</span>
                                </div>
                              ))}
                            </div>
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
