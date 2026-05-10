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
    await createNote(id, { ...newNote, note_date: newNote.note_date ? new Date(newNote.note_date).toISOString() : null });
    setNewNote({ title: '', content: '', filter_type: 'ALL', note_date: '' });
    setShowAdd(false);
    loadNotes();
  };

  const handleToggle = async (note) => {
    await updateNote(note.id, { is_active: !note.is_active });
    loadNotes();
  };

  const handleDelete = async (noteId) => { await deleteNote(noteId); loadNotes(); };

  const filters = ['ALL', 'BY_DAY', 'BY_STOP'];

  if (loading) return <div className="pt-20 flex justify-center"><Loader2 size={32} className="animate-spin text-amber-700" /></div>;

  return (
    <div className="pt-20 pb-12 max-w-4xl mx-auto px-4">
      <div className="animate-fadeInUp">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-amber-900">Trip Notes</h1>
            <p className="text-amber-700">Journal your experiences and reminders</p>
          </div>
          <button onClick={() => setShowAdd(!showAdd)} className="btn-primary"><Plus size={18} /> New Note</button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-amber-700/15 text-amber-600 border border-amber-700/30' : 'text-amber-700 hover:text-amber-900 hover:bg-white/5'}`}>
              {f === 'ALL' ? 'All' : f === 'BY_DAY' ? 'By Day' : 'By Stop'}
            </button>
          ))}
        </div>

        {/* Add Note Form */}
        {showAdd && (
          <div className="glass rounded-2xl p-6 mb-6 animate-fadeInUp">
            <div className="space-y-4">
              <input className="input-glass" placeholder="Note title..." value={newNote.title} onChange={e => setNewNote({...newNote, title: e.target.value})} />
              <textarea className="input-glass" rows={4} placeholder="Write your note..." value={newNote.content} onChange={e => setNewNote({...newNote, content: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="date" className="input-glass" value={newNote.note_date} onChange={e => setNewNote({...newNote, note_date: e.target.value})} />
                <select className="input-glass" value={newNote.filter_type} onChange={e => setNewNote({...newNote, filter_type: e.target.value})}>
                  {filters.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <button onClick={handleAdd} className="btn-primary"><Plus size={18} /> Add Note</button>
            </div>
          </div>
        )}

        {/* Notes List */}
        <div className="space-y-4">
          {notes.map((note, i) => (
            <div key={note.id} className={`glass rounded-2xl p-6 glass-hover animate-fadeInUp ${!note.is_active ? 'opacity-50' : ''}`} style={{animationDelay: `${i * 0.05}s`}}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <StickyNote size={18} className="text-amber-400" />
                    <h3 className="text-amber-900 font-semibold">{note.title}</h3>
                    <span className="badge badge-upcoming text-xs">{note.filter_type}</span>
                  </div>
                  {note.content && <p className="text-amber-700 text-sm whitespace-pre-wrap ml-8">{note.content}</p>}
                  <div className="flex gap-4 mt-3 ml-8 text-xs text-amber-600">
                    {note.note_date && <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(note.note_date).toLocaleDateString()}</span>}
                    <span>{new Date(note.created_at).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <button onClick={() => handleToggle(note)} className="p-1 text-amber-700 hover:text-amber-700 transition-colors">
                    {note.is_active ? <ToggleRight size={22} className="text-emerald-600" /> : <ToggleLeft size={22} />}
                  </button>
                  <button onClick={() => handleDelete(note.id)} className="p-1 text-amber-600 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {notes.length === 0 && (
          <div className="text-center py-16 text-amber-600">
            <StickyNote size={48} className="mx-auto mb-4 text-amber-500" />
            <p>No notes yet. Start journaling your trip!</p>
          </div>
        )}
      </div>
    </div>
  );
}
