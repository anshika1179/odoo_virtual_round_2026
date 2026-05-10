import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getChecklist, createChecklistItem, updateChecklistItem, deleteChecklistItem, resetChecklist, loadChecklistDefaults } from '../../services/api';
import { CheckSquare, Square, Plus, Trash2, RotateCcw, Search, Printer, Loader2, PackagePlus } from 'lucide-react';

const CATEGORIES = ['DOCUMENTS', 'CLOTHING', 'ELECTRONICS', 'TOILETRIES', 'MEDICINE', 'OTHER'];
const CAT_ICONS = { DOCUMENTS: '📄', CLOTHING: '👕', ELECTRONICS: '🔌', TOILETRIES: '🧴', MEDICINE: '💊', OTHER: '📦' };

export default function PackingChecklist() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [newItem, setNewItem] = useState({ item_name: '', category: 'CLOTHING' });
  const [showAdd, setShowAdd] = useState(false);

  const loadItems = () => {
    getChecklist(id).then(r => { setItems(r.data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { loadItems(); }, [id]);

  const handleAdd = async () => {
    if (!newItem.item_name) return;
    await createChecklistItem(id, newItem);
    setNewItem({ item_name: '', category: 'CLOTHING' });
    setShowAdd(false);
    loadItems();
  };

  const handleToggle = async (item) => {
    await updateChecklistItem(item.id, { is_packed: !item.is_packed });
    loadItems();
  };

  const handleDelete = async (itemId) => { await deleteChecklistItem(itemId); loadItems(); };

  const handleReset = async () => { await resetChecklist(id); loadItems(); };

  const handlePrint = () => {
    const text = items.map(i => `${i.is_packed ? '✅' : '⬜'} [${i.category}] ${i.item_name}`).join('\n');
    const w = window.open('', '_blank');
    w.document.write(`<pre style="font-size:14px;font-family:monospace">${text}</pre>`);
    w.print();
  };

  const filtered = items.filter(i => (!search || i.item_name.toLowerCase().includes(search.toLowerCase())) && (!filterCat || i.category === filterCat));
  const grouped = CATEGORIES.reduce((acc, cat) => { acc[cat] = filtered.filter(i => i.category === cat); return acc; }, {});
  const packedCount = items.filter(i => i.is_packed).length;

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
              Packing Checklist
            </h1>
            <p className="text-amber-900/70 mt-2 text-lg font-medium">
              <span className="text-emerald-600 font-bold">{packedCount}</span> / {items.length} items packed
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
            {items.length === 0 && (
              <button 
                onClick={async () => { await loadChecklistDefaults(id); loadItems(); }} 
                className="btn-primary flex items-center gap-2"
                style={{ height: "48px", borderRadius: "14px", padding: "0 20px", fontWeight: 600 }}
              >
                <PackagePlus size={18} /> Load Essentials
              </button>
            )}
            <button 
              onClick={handlePrint} 
              className="btn-secondary flex items-center gap-2 bg-white/50"
              style={{ height: "48px", borderRadius: "14px", padding: "0 20px", fontWeight: 600 }}
            >
              <Printer size={18} /> Print All
            </button>
            <button 
              onClick={handleReset} 
              className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              style={{ height: "48px", borderRadius: "14px", padding: "0 20px", fontWeight: 600 }}
            >
              <RotateCcw size={18} /> Reset
            </button>
          </div>
        </div>

        {/* Progress */}
        <div 
          className="glass shadow-soft mb-8"
          style={{ borderRadius: "24px", padding: "32px", border: "1px solid rgba(120,90,60,0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-amber-900/60 uppercase tracking-wider">Packing Progress</span>
            <span className="text-lg font-black text-amber-950">{items.length > 0 ? Math.round(packedCount / items.length * 100) : 0}%</span>
          </div>
          <div className="h-4 rounded-full bg-amber-900/10 overflow-hidden shadow-inner">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-700 ease-out"
              style={{ width: `${items.length > 0 ? (packedCount / items.length * 100) : 0}%` }} />
          </div>
        </div>

        {/* Search + Filter + Add */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-900/40" />
            <input 
              className="input-glass w-full text-amber-950 font-medium placeholder:text-amber-900/40" 
              placeholder="Search items..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              style={{ height: "56px", borderRadius: "16px", padding: "0 20px 0 48px", border: "1px solid rgba(120,90,60,0.12)", fontSize: "16px", outline: "none" }}
            />
          </div>
          <select 
            className="input-glass w-full sm:w-48 text-amber-950 font-medium" 
            value={filterCat} 
            onChange={e => setFilterCat(e.target.value)}
            style={{ height: "56px", borderRadius: "16px", padding: "0 20px", border: "1px solid rgba(120,90,60,0.12)", fontSize: "16px", outline: "none", backgroundColor: "rgba(255,255,255,0.5)" }}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button 
            onClick={() => setShowAdd(!showAdd)} 
            className="btn-primary flex shrink-0 items-center justify-center gap-2 whitespace-nowrap"
            style={{ height: "56px", borderRadius: "16px", padding: "0 32px", fontSize: "16px", fontWeight: 600 }}
          >
            <Plus size={20} /> Add Item
          </button>
        </div>

        {showAdd && (
          <div 
            className="glass animate-fadeInUp mb-8"
            style={{ borderRadius: "24px", padding: "32px", border: "2px dashed rgba(120,90,60,0.15)", backgroundColor: "rgba(255,255,255,0.3)" }}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <select 
                className="input-glass w-full sm:w-48 shrink-0 text-amber-950 font-medium" 
                value={newItem.category} 
                onChange={e => setNewItem({...newItem, category: e.target.value})}
                style={{ height: "56px", borderRadius: "16px", padding: "0 20px", border: "1px solid rgba(120,90,60,0.12)", fontSize: "16px", outline: "none", backgroundColor: "rgba(255,255,255,0.5)" }}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input 
                className="input-glass flex-1 min-w-0 text-amber-950 font-medium placeholder:text-amber-900/40" 
                placeholder="What do you need to pack?" 
                value={newItem.item_name} 
                onChange={e => setNewItem({...newItem, item_name: e.target.value})}
                onKeyDown={e => e.key === 'Enter' && handleAdd()} 
                style={{ height: "56px", borderRadius: "16px", padding: "0 20px", border: "1px solid rgba(120,90,60,0.12)", fontSize: "16px", outline: "none" }}
              />
              <button 
                onClick={handleAdd} 
                className="btn-primary shrink-0 flex items-center justify-center"
                style={{ height: "56px", width: "56px", borderRadius: "16px" }}
              >
                <Plus size={24} />
              </button>
            </div>
          </div>
        )}

        {/* Grouped Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATEGORIES.filter(cat => grouped[cat]?.length > 0).map(cat => (
            <div 
              key={cat} 
              className="glass shadow-soft overflow-hidden"
              style={{ borderRadius: "24px", border: "1px solid rgba(120,90,60,0.08)" }}
            >
              <div className="bg-gradient-to-r from-amber-700/10 to-orange-500/10 px-6 py-4 flex items-center gap-3 border-b border-amber-900/10">
                <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center shadow-sm text-xl border border-amber-900/5">{CAT_ICONS[cat]}</div>
                <h3 className="text-amber-950 font-bold text-lg">{cat}</h3>
                <span className="badge bg-amber-100 text-amber-800 border border-amber-200 ml-auto font-bold px-2 py-1">
                  {grouped[cat].filter(i => i.is_packed).length}/{grouped[cat].length}
                </span>
              </div>
              <div className="divide-y divide-amber-900/5">
                {grouped[cat].map(item => (
                  <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/40 transition-colors group cursor-pointer" onClick={() => handleToggle(item)}>
                    <div className="shrink-0 text-amber-500 hover:text-emerald-500 transition-colors">
                      {item.is_packed ? <CheckSquare size={24} className="text-emerald-600" /> : <Square size={24} />}
                    </div>
                    <span className={`flex-1 text-base font-medium transition-colors ${item.is_packed ? 'text-amber-900/40 line-through' : 'text-amber-950'}`}>{item.item_name}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} 
                      className="p-2 rounded-lg text-amber-900/30 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div 
            className="glass flex flex-col items-center justify-center text-center mt-6"
            style={{ borderRadius: "24px", padding: "80px 40px", border: "2px dashed rgba(120,90,60,0.15)" }}
          >
            <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mb-6 shadow-inner">
              <CheckSquare size={48} className="text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-amber-950 mb-2">No items yet</h3>
            <p className="text-amber-900/60 mb-8 max-w-md">Add items manually or load our travel essentials to get started with your packing list.</p>
            <button 
              onClick={async () => { await loadChecklistDefaults(id); loadItems(); }} 
              className="btn-primary flex items-center gap-2" 
              style={{ height: "56px", borderRadius: "16px", padding: "0 32px", fontSize: "16px", fontWeight: 700 }}
            >
              <PackagePlus size={20} /> Load Essentials
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
