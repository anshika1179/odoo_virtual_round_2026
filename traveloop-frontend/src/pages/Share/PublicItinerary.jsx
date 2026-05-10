import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getShared } from '../../services/api';
import { Calendar, DollarSign, MapPin, Loader2, Eye, Clock } from 'lucide-react';

export default function PublicItinerary() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getShared(token).then(r => { setData(r.data); setLoading(false); })
      .catch(() => { setError('Itinerary not found or link expired'); setLoading(false); });
  }, [token]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 size={32} className="animate-spin text-amber-700" /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">{error}</div>;

  const trip = data?.trip;
  const stops = data?.stops || [];

  // Group by day
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

  const days = groupByDay();
  const totalBudget = stops.reduce((sum, s) => sum + (s.section_budget || 0), 0);

  return (
    <div className="min-h-screen py-12 px-4 max-w-4xl mx-auto">
      <div className="animate-fadeInUp">
        {/* Branding Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/images/logo.png" alt="Traveloop" className="w-8 h-8 rounded-lg" />
            <span className="text-2xl brand-font gradient-text">Traveloop</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-700/10 border border-amber-700/20 text-amber-700 text-sm mb-4">
            <Eye size={16} /> Shared Itinerary
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-amber-900">{trip?.title}</h1>
          <p className="text-amber-700 mt-2">{trip?.description}</p>

          {/* Trip Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-5">
            <div className="glass rounded-xl px-4 py-3 text-center">
              <Calendar size={18} className="mx-auto text-amber-700 mb-1" />
              <p className="text-xs text-amber-600">{new Date(trip?.start_date).toLocaleDateString()} — {new Date(trip?.end_date).toLocaleDateString()}</p>
            </div>
            <div className="glass rounded-xl px-4 py-3 text-center">
              <DollarSign size={18} className="mx-auto text-emerald-600 mb-1" />
              <p className="text-xs text-amber-600">Budget: ${trip?.total_budget || totalBudget}</p>
            </div>
            <div className="glass rounded-xl px-4 py-3 text-center">
              <MapPin size={18} className="mx-auto text-orange-600 mb-1" />
              <p className="text-xs text-amber-600">{stops.length} stops</p>
            </div>
          </div>
          <p className="text-amber-500 text-sm mt-3">Shared by {data?.owner}</p>
        </div>

        {/* Day-wise View */}
        <div className="space-y-8">
          {days.map((day, dayIdx) => (
            <div key={day.dayNum} className="animate-fadeInUp" style={{animationDelay: `${dayIdx * 0.1}s`}}>
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

              <div className="ml-5 border-l-2 border-amber-200 pl-6 space-y-4">
                {day.stops.map(stop => (
                  <div key={stop.id} className="glass rounded-2xl p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-600 ring-4 ring-amber-100 -ml-[1.85rem] mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-amber-900 font-semibold text-lg">{stop.section_title}</h4>
                          {stop.section_budget > 0 && <span className="badge badge-upcoming">${stop.section_budget}</span>}
                        </div>
                        {stop.description && <p className="text-amber-700 text-sm mt-1">{stop.description}</p>}
                        {stop.arrival_date && (
                          <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                            <Clock size={12} /> {new Date(stop.arrival_date).toLocaleDateString()} — {stop.departure_date ? new Date(stop.departure_date).toLocaleDateString() : '...'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Branding */}
        <div className="text-center mt-12 pt-8 border-t border-amber-200">
          <p className="text-amber-500 text-sm">Powered by <span className="brand-font text-lg gradient-text">Traveloop</span></p>
        </div>
      </div>
    </div>
  );
}
