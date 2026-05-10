import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getNotes, createNote, updateNote, deleteNote } from '../../services/api';
import { StickyNote, Plus, Trash2, Edit3, Calendar, MapPin, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';

export default function TripNotes() {
  const { id } = useParams();
  const [notes, setNotes] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', filter_type: 'ALL', note_date: '' });

  const loadNotes = () => {
    getNotes(id, filter).then(r => { setNotes(r.data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { loadNotes(); }, [id, filter]);

  const handleAdd = async () => {
    if (!newNote.title) return;
    
    let formattedDate = null;
    if (newNote.note_date) {
      const d = new Date(newNote.note_date);
      // Ensure date is valid and year is reasonable before toISOString
      if (!isNaN(d.getTime()) && d.getFullYear() < 10000) {
        formattedDate = d.toISOString();
      }
    }
    
    try {
      await createNote(id, { ...newNote, note_date: formattedDate });
      setNewNote({ title: '', content: '', filter_type: 'ALL', note_date: '' });
      setShowAdd(false);
      loadNotes();
    } catch (e) {
      console.error("Failed to add note", e);
    }
  };

  const handleToggle = async (note) => {
    await updateNote(note.id, { is_active: !note.is_active });
    loadNotes();
  };

  const handleDelete = async (noteId) => { await deleteNote(noteId); loadNotes(); };

  const filters = ['ALL', 'BY_DAY', 'BY_STOP'];

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
              Trip Notes
            </h1>
            <p className="text-amber-900/70 mt-2 text-lg font-medium">
              Journal your experiences and reminders
            </p>
          </div>
          <button 
            onClick={() => setShowAdd(!showAdd)} 
            className="btn-primary flex items-center justify-center gap-2"
            style={{ height: "48px", borderRadius: "14px", padding: "0 24px", fontWeight: 600 }}
          >
            <Plus size={20} /> New Note
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {filters.map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${filter === f ? 'bg-amber-100 text-amber-800 border border-amber-200 shadow-md transform -translate-y-0.5' : 'bg-white/40 text-amber-900/60 border border-amber-900/10 hover:text-amber-900 hover:bg-white/60 hover:shadow-md'}`}
            >
              {f === 'ALL' ? 'All Notes' : f === 'BY_DAY' ? 'By Day' : 'By Stop'}
            </button>
          ))}
        </div>

        {/* Add Note Form */}
        {showAdd && (
          <div 
            className="glass animate-fadeInUp mb-10"
            style={{ borderRadius: "24px", padding: "32px", border: "2px dashed rgba(120,90,60,0.15)", backgroundColor: "rgba(255,255,255,0.3)" }}
          >
            <div className="space-y-5">
              <input 
                className="input-glass w-full" 
                placeholder="Note title..." 
                value={newNote.title} 
                onChange={e => setNewNote({...newNote, title: e.target.value})} 
                style={{ height: "56px", borderRadius: "16px", padding: "0 20px", border: "1px solid rgba(120,90,60,0.12)", fontSize: "16px", outline: "none", backgroundColor: "rgba(255,255,255,0.6)", fontWeight: "600", color: "#451a03" }}
              />
              <textarea 
                className="input-glass w-full" 
                rows={4} 
                placeholder="Write your note..." 
                value={newNote.content} 
                onChange={e => setNewNote({...newNote, content: e.target.value})} 
                style={{ borderRadius: "16px", padding: "20px", border: "1px solid rgba(120,90,60,0.12)", fontSize: "16px", outline: "none", backgroundColor: "rgba(255,255,255,0.6)", resize: "none", color: "#78350f" }}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input 
                  type="date" 
                  className="input-glass w-full" 
                  value={newNote.note_date} 
                  onChange={e => setNewNote({...newNote, note_date: e.target.value})} 
                  style={{ height: "56px", borderRadius: "16px", padding: "0 20px", border: "1px solid rgba(120,90,60,0.12)", fontSize: "16px", outline: "none", backgroundColor: "rgba(255,255,255,0.6)", color: newNote.note_date ? "#451a03" : "rgba(120,90,60,0.5)" }}
                />
                <select 
                  className="input-glass w-full" 
                  value={newNote.filter_type} 
                  onChange={e => setNewNote({...newNote, filter_type: e.target.value})}
                  style={{ height: "56px", borderRadius: "16px", padding: "0 20px", border: "1px solid rgba(120,90,60,0.12)", fontSize: "16px", outline: "none", backgroundColor: "rgba(255,255,255,0.6)" }}
                >
                  {filters.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div className="pt-2">
                <button 
                  onClick={handleAdd} 
                  className="btn-primary flex items-center justify-center gap-2"
                  style={{ height: "56px", borderRadius: "16px", padding: "0 32px", fontSize: "16px", fontWeight: 700 }}
                >
                  <Plus size={20} /> Add Note
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notes List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notes.map((note, i) => (
            <div 
              key={note.id} 
              className={`glass shadow-soft hover:shadow-lg transition-all duration-300 animate-fadeInUp relative overflow-hidden group ${!note.is_active ? 'opacity-60 grayscale-[0.3]' : ''}`} 
              style={{ borderRadius: "24px", padding: "32px", border: "1px solid rgba(120,90,60,0.08)", animationDelay: `${i * 0.05}s` }}
            >
              <div className={`absolute top-0 left-0 w-2 h-full rounded-l-2xl ${note.is_active ? 'bg-amber-500/60' : 'bg-slate-400/40'}`}></div>
              
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shadow-inner shrink-0">
                    <StickyNote size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-xl ${note.is_active ? 'text-amber-950' : 'text-amber-900/60 line-through'}`}>{note.title}</h3>
                    <span className="badge bg-amber-50 text-amber-700 border border-amber-200 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 mt-1 block w-fit">{note.filter_type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 bg-white/40 rounded-xl p-1 shadow-sm border border-amber-900/5">
                  <button onClick={() => handleToggle(note)} className="p-1.5 rounded-lg text-amber-900/40 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title={note.is_active ? "Archive Note" : "Unarchive Note"}>
                    {note.is_active ? <ToggleRight size={22} className="text-emerald-500" /> : <ToggleLeft size={22} />}
                  </button>
                  <button onClick={() => handleDelete(note.id)} className="p-1.5 rounded-lg text-amber-900/40 hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete Note">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              {note.content && (
                <div className="bg-white/40 rounded-2xl p-5 mb-5 border border-amber-900/5">
                  <p className={`text-base leading-relaxed whitespace-pre-wrap ${note.is_active ? 'text-amber-900/80' : 'text-amber-900/50'}`}>{note.content}</p>
                </div>
              )}
              
              <div className="flex flex-wrap gap-4 items-center">
                {note.note_date && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-100">
                    <Calendar size={14} className="text-amber-500" /> 
                    {new Date(note.note_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
                <span className="text-xs font-medium text-amber-900/40">
                  Added {new Date(note.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {notes.length === 0 && (
          <div 
            className="glass flex flex-col items-center justify-center text-center mt-6"
            style={{ borderRadius: "24px", padding: "80px 40px", border: "2px dashed rgba(120,90,60,0.15)" }}
          >
            <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mb-6 shadow-inner">
              <StickyNote size={48} className="text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-amber-950 mb-2">No notes yet</h3>
            <p className="text-amber-900/60 mb-8 max-w-md">Start journaling your trip, write down important reminders, or save essential addresses.</p>
            <button 
              onClick={() => setShowAdd(true)} 
              className="btn-primary flex items-center gap-2" 
              style={{ height: "56px", borderRadius: "16px", padding: "0 32px", fontSize: "16px", fontWeight: 700 }}
            >
              <Plus size={20} /> Create Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
