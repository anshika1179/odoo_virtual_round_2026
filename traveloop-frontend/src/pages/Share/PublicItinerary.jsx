import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getShared } from '../../services/api';
import { Globe, Calendar, DollarSign, MapPin, Loader2, Eye } from 'lucide-react';

export default function PublicItinerary() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getShared(token).then(r => { setData(r.data); setLoading(false); })
      .catch(() => { setError('Itinerary not found or link expired'); setLoading(false); });
  }, [token]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 size={32} className="animate-spin text-indigo-400" /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-400">{error}</div>;

  return (
    <div className="min-h-screen py-12 px-4 max-w-4xl mx-auto">
      <div className="animate-fadeInUp">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm mb-4">
            <Eye size={16} /> Shared Itinerary
          </div>
          <h1 className="text-4xl font-bold text-white">{data?.trip?.title}</h1>
          <p className="text-slate-400 mt-2">{data?.trip?.description}</p>
          <div className="flex justify-center gap-6 mt-4 text-sm text-slate-400">
            <span className="flex items-center gap-1"><Calendar size={16} /> {data?.trip?.start_date} — {data?.trip?.end_date}</span>
            <span className="flex items-center gap-1"><DollarSign size={16} /> ${data?.trip?.total_budget}</span>
          </div>
          <p className="text-slate-500 text-sm mt-2">Shared by {data?.owner}</p>
        </div>

        <div className="space-y-4">
          {data?.stops?.map((stop, idx) => (
            <div key={stop.id} className="glass rounded-2xl p-6 animate-fadeInUp" style={{animationDelay: `${idx * 0.1}s`}}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">{idx + 1}</div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{stop.section_title}</h3>
                  {stop.description && <p className="text-slate-400 text-sm">{stop.description}</p>}
                </div>
                {stop.section_budget > 0 && <span className="ml-auto badge badge-upcoming">${stop.section_budget}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
