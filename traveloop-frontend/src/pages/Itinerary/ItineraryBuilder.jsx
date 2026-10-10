import useCurrency from '../../utils/useCurrency';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTrip, createStop, reorderStops, deleteStop, searchCities } from '../../services/api';
import { Plus, Trash2, GripVertical, MapPin, Calendar, IndianRupee, Loader2, ArrowRight, CheckCircle } from 'lucide-react';

import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ItineraryCalendar from './ItineraryCalendar';
import TripWeather from './TripWeather';
import StopActivities from '../../components/itinerary/StopActivities';

function SortableSection({ stop, disabled, children }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: stop.id, disabled });
  return (
    <div
      ref={setNodeRef}
      className="glass shadow-soft hover:shadow-lg relative group"
      style={{ borderRadius: "24px", padding: "32px", border: "1px solid rgba(120,90,60,0.08)", transform: CSS.Transform.toString(transform), transition, position: 'relative', zIndex: isDragging ? 10 : undefined, opacity: isDragging ? 0.8 : 1 }}
    >
      {children(
        <button ref={setActivatorNodeRef} {...attributes} {...listeners} disabled={disabled}
          aria-label={`Reorder ${stop.section_title}`} title="Drag to reorder, or press Space and use arrow keys"
          className="p-2 rounded-xl text-amber-900/50 hover:bg-amber-100 cursor-grab active:cursor-grabbing disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-amber-700"
          style={{ touchAction: 'none' }}>
          <GripVertical size={20} />
        </button>
      )}
    </div>
  );
}

export default function ItineraryBuilder() {
  const money = useCurrency();
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [cityResults, setCityResults] = useState([]);
  const [newStop, setNewStop] = useState({ section_title: '', description: '', arrival_date: '', departure_date: '', section_budget: '', city_id: null });
  const [view, setView] = useState('list');
  const [reordering, setReordering] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');
  const reorderLock = useRef(false);
  const addSectionRef = useRef(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    getTrip(id).then(r => { setTrip(r.data); setStops(r.data.stops || []); setLoading(false); })
      .catch(() => { navigate('/trips'); });
  }, [id]);

  useEffect(() => {
    if (citySearch.length > 1) searchCities({ q: citySearch }).then(r => setCityResults(r.data)).catch(() => {});
    else setCityResults([]);
  }, [citySearch]);

  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id || reorderLock.current || saving) return;
    const oldIndex = stops.findIndex(s => s.id === active.id);
    const newIndex = stops.findIndex(s => s.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const previous = stops;
    const reordered = arrayMove(stops, oldIndex, newIndex).map((stop, idx) => ({ ...stop, stop_order: idx }));
    reorderLock.current = true;
    setReordering(true);
    setOrderMessage('Saving order...');
    setStops(reordered);
    try {
      await reorderStops(id, { stop_ids: reordered.map(s => s.id) });
      setOrderMessage('Order saved');
    } catch (err) {
      setStops(previous);
      setOrderMessage('Could not save order. Your previous order has been restored. Please try again.');
      console.error(err);
    } finally {
      reorderLock.current = false;
      setReordering(false);
    }
  };

  const addOnDate = (date) => {
    setNewStop(current => ({ ...current, arrival_date: date, departure_date: date }));
    addSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    addSectionRef.current?.querySelector('input')?.focus({ preventScroll: true });
  };

  const addSection = async () => {
    if (reorderLock.current || saving) return;
    if (!newStop.section_title) return;
    setSaving(true);
    try {
      // Safely parse dates to ISO format
      const arrDate = newStop.arrival_date ? new Date(newStop.arrival_date) : null;
      const depDate = newStop.departure_date ? new Date(newStop.departure_date) : null;
      
      const payload = {
        ...newStop,
        arrival_date: arrDate && !isNaN(arrDate.getTime()) ? arrDate.toISOString() : null,
        departure_date: depDate && !isNaN(depDate.getTime()) ? depDate.toISOString() : null,
        section_budget: money.toUsd(newStop.section_budget),
      };

      const res = await createStop(id, payload);
      setStops([...stops, res.data]);
      setNewStop({ section_title: '', description: '', arrival_date: '', departure_date: '', section_budget: '', city_id: null });
      setCitySearch('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) { 
      console.error(err); 
      alert(err.response?.data?.detail || "Failed to add section. Please try again.");
    }
    finally { setSaving(false); }
  };

  const removeStop = async (stopId) => {
    if (reorderLock.current || saving) return;
    setSaving(true);
    try {
      await deleteStop(stopId);
      setStops(stops.filter(s => s.id !== stopId));
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="pt-20 flex justify-center"><Loader2 size={32} className="animate-spin text-amber-700" /></div>;

  return (
    <div
      className="mx-auto flex flex-col items-center"
      style={{ maxWidth: "1440px", padding: "120px 64px 80px 64px" }}
    >
      <div className="animate-fadeInUp w-full" style={{ maxWidth: "1000px" }}>
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4 text-center sm:text-left">
          <div>
            <h1
              className="text-amber-950 font-bold flex items-center justify-center sm:justify-start gap-3"
              style={{ fontSize: "36px" }}
            >
              Build Itinerary
            </h1>
            <p className="text-amber-900/70 mt-2 text-lg">
              {trip?.title}
            </p>
          </div>
          <button 
            onClick={() => navigate(`/trips/${id}/view`)} 
            className="btn-primary flex items-center gap-2"
            style={{ height: "56px", borderRadius: "18px", padding: "0 28px", fontSize: "16px", fontWeight: 600 }}
          >
            View Itinerary <ArrowRight size={18} />
          </button>
        </div>

        <div style={{ marginBottom: "24px", gap: "12px" }} className="flex flex-wrap items-center">
          <div style={{ gap: "8px" }} className="flex" role="group" aria-label="Itinerary view">
            {['list', 'calendar', 'weather'].map(option => (
              <button key={option} onClick={() => setView(option)} aria-pressed={view === option}
                style={{ padding: "8px 16px" }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold ${view === option ? 'bg-amber-100 text-amber-950' : 'text-amber-900/60 hover:bg-amber-50'}`}>
                {option === 'list' ? 'List view' : option === 'calendar' ? 'Calendar view' : 'Weather & packing'}
              </button>
            ))}
          </div>
          <p role="status" className="text-sm text-amber-700">{orderMessage}</p>
        </div>

        {view === 'calendar' ? (
          <div style={{ marginBottom: "40px" }}><ItineraryCalendar trip={trip} stops={stops} onAddDate={addOnDate} /></div>
        ) : view === 'weather' ? (
          <div style={{ marginBottom: "40px" }}><TripWeather tripId={id} stops={stops} /></div>
        ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={stops.map(s => s.id)} strategy={verticalListSortingStrategy}>
        {/* Existing Sections */}
        <div className="space-y-6 mb-10">
          {stops.map((stop, idx) => (
            <SortableSection key={stop.id} stop={stop} disabled={reordering || saving}>
              {handle => <>
              <div className="absolute top-0 left-0 w-2 h-full bg-amber-600/60 rounded-l-2xl"></div>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 font-bold text-lg shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="text-amber-950 font-bold text-xl">{stop.section_title}</h3>
                    {stop.city_name && (
                      <p className="text-amber-700 font-medium text-sm mt-1 flex items-center gap-1.5">
                        <MapPin size={16} />{stop.city_name}
                      </p>
                    )}
                    {stop.description && (
                      <p className="text-amber-900/70 text-sm mt-3 leading-relaxed max-w-2xl">{stop.description}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-4 mt-4">
                      {stop.arrival_date && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/40 border border-amber-900/10 text-xs font-semibold text-amber-900">
                          <Calendar size={14} className="text-amber-600" />
                          <span>
                            {new Date(stop.arrival_date).toLocaleDateString()} 
                            {stop.departure_date ? ` - ${new Date(stop.departure_date).toLocaleDateString()}` : ''}
                          </span>
                        </div>
                      )}
                      {stop.section_budget > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/50 text-xs font-semibold text-emerald-700">
                          <IndianRupee size={14} />
                          <span>{money.fmt(stop.section_budget)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                {handle}
                <button 
                  disabled={reordering || saving}
                  onClick={() => removeStop(stop.id)} 
                  className="p-3 rounded-xl text-amber-900/40 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                  title="Remove Section"
                >
                  <Trash2 size={20} />
                </button>
                </div>
              </div>
              <StopActivities stop={stop} />
              </>}
            </SortableSection>
          ))}
        </div>
          </SortableContext>
        </DndContext>
        )}

        {/* Add New Section */}
        <div 
          ref={addSectionRef}
          className="glass scroll-mt-24"
          style={{ 
            borderRadius: "24px", 
            padding: "40px", 
            border: "2px dashed rgba(120,90,60,0.2)",
            backgroundColor: "rgba(255,255,255,0.3)"
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <Plus size={20} className="text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-amber-950">
              Add Another Section
            </h3>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-amber-950 mb-2">Section Title *</label>
                <input 
                  className="input-glass w-full outline-none transition-colors" 
                  placeholder="e.g., Day 1-3 in Paris"
                  value={newStop.section_title} 
                  onChange={e => setNewStop({...newStop, section_title: e.target.value})}
                  style={{ height: "56px", borderRadius: "16px", padding: "0 20px", border: "1px solid rgba(120,90,60,0.12)", fontSize: "15px" }}
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-semibold text-amber-950 mb-2">City</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-900/40" />
                  <input 
                    className="input-glass w-full outline-none transition-colors" 
                    placeholder="Search city..." 
                    value={citySearch} 
                    onChange={e => setCitySearch(e.target.value)}
                    style={{ height: "56px", borderRadius: "16px", padding: "0 20px 0 44px", border: "1px solid rgba(120,90,60,0.12)", fontSize: "15px" }}
                  />
                </div>
                {cityResults.length > 0 && (
                  <div className="mt-3 glass absolute z-10 w-full shadow-lg" style={{ borderRadius: "16px", padding: "8px", maxHeight: "200px", overflowY: "auto", border: "1px solid rgba(120,90,60,0.08)" }}>
                    {cityResults.slice(0, 4).map(c => (
                      <button 
                        key={c.id} 
                        onClick={() => { setNewStop({...newStop, city_id: c.id, section_title: newStop.section_title || c.name}); setCitySearch(c.name); setCityResults([]); }}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-amber-900/5 transition-colors text-sm text-amber-950 font-medium flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                          <MapPin size={14} className="text-amber-700" />
                        </div>
                        <div>
                          <div>{c.name}</div>
                          <div className="text-xs text-amber-900/50">{c.country}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-950 mb-2">Description</label>
              <textarea 
                className="input-glass w-full outline-none transition-colors" 
                rows={2} 
                placeholder="What will you do here?"
                value={newStop.description} 
                onChange={e => setNewStop({...newStop, description: e.target.value})}
                style={{ borderRadius: "16px", padding: "20px", border: "1px solid rgba(120,90,60,0.12)", fontSize: "15px", resize: "none" }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-amber-950 mb-2 flex items-center gap-2"><Calendar size={16} className="text-amber-700"/> Arrival</label>
                <input 
                  type="date" 
                  className="input-glass w-full outline-none transition-colors" 
                  value={newStop.arrival_date} 
                  onChange={e => setNewStop({...newStop, arrival_date: e.target.value})} 
                  style={{ height: "56px", borderRadius: "16px", padding: "0 20px", border: "1px solid rgba(120,90,60,0.12)", fontSize: "15px", color: newStop.arrival_date ? "inherit" : "rgba(120,90,60,0.5)" }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-amber-950 mb-2 flex items-center gap-2"><Calendar size={16} className="text-amber-700"/> Departure</label>
                <input 
                  type="date" 
                  className="input-glass w-full outline-none transition-colors" 
                  value={newStop.departure_date} 
                  onChange={e => setNewStop({...newStop, departure_date: e.target.value})} 
                  style={{ height: "56px", borderRadius: "16px", padding: "0 20px", border: "1px solid rgba(120,90,60,0.12)", fontSize: "15px", color: newStop.departure_date ? "inherit" : "rgba(120,90,60,0.5)" }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-amber-950 mb-2 flex items-center gap-2"><IndianRupee size={16} className="text-amber-700"/> Budget ({money.code})</label>
                <input 
                  type="number" 
                  className="input-glass w-full outline-none transition-colors" 
                  placeholder="500" 
                  value={newStop.section_budget} 
                  onChange={e => setNewStop({...newStop, section_budget: e.target.value})} 
                  style={{ height: "56px", borderRadius: "16px", padding: "0 20px", border: "1px solid rgba(120,90,60,0.12)", fontSize: "15px" }}
                />
              </div>
            </div>

            <div className="pt-4 flex flex-col md:flex-row items-center gap-4">
              <button 
                onClick={addSection} 
                disabled={saving || reordering || !newStop.section_title}
                className={`btn-primary w-full md:w-auto flex items-center justify-center gap-2 transition-all ${showSuccess ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30' : ''}`}
                style={{ height: "56px", borderRadius: "16px", padding: "0 32px", fontSize: "16px", fontWeight: 600 }}
              >
                {saving ? <Loader2 size={20} className="animate-spin" /> : showSuccess ? <CheckCircle size={20} /> : <Plus size={20} />} 
                {showSuccess ? "Section Added!" : "Add Section"}
              </button>
              
              {showSuccess && (
                <span className="text-emerald-600 font-bold flex items-center gap-2 animate-fadeIn">
                  <CheckCircle size={20} /> Successfully added to itinerary!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
