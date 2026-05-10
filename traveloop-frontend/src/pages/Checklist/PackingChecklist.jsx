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
    <div className="pt-20 pb-12 max-w-4xl mx-auto px-4">
      <div className="animate-fadeInUp">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-amber-900">Packing Checklist</h1>
            <p className="text-amber-700">{packedCount}/{items.length} items packed</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {items.length === 0 && (
              <button onClick={async () => { await loadChecklistDefaults(id); loadItems(); }} className="btn-primary text-sm"><PackagePlus size={16} /> Load Essentials</button>
            )}
            <button onClick={handlePrint} className="btn-secondary text-sm"><Printer size={16} /> Print All</button>
            <button onClick={handleReset} className="btn-danger text-sm"><RotateCcw size={16} /> Reset</button>
          </div>
        </div>

        {/* Progress */}
        <div className="glass rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-amber-700">Packing Progress</span>
            <span className="text-sm text-amber-600 font-medium">{items.length > 0 ? Math.round(packedCount / items.length * 100) : 0}%</span>
          </div>
          <div className="h-3 rounded-full bg-amber-200 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-700 to-green-500 transition-all duration-500"
              style={{ width: `${items.length > 0 ? (packedCount / items.length * 100) : 0}%` }} />
          </div>
        </div>

        {/* Search + Filter + Add */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600" />
            <input className="input-glass pl-10" placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input-glass max-w-[180px]" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={() => setShowAdd(!showAdd)} className="btn-primary"><Plus size={18} /> Add Item</button>
        </div>

        {showAdd && (
          <div className="glass rounded-2xl p-5 mb-6 animate-fadeInUp">
            <div className="flex gap-3">
              <select className="input-glass max-w-[160px]" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input className="input-glass flex-1" placeholder="Item name..." value={newItem.item_name} onChange={e => setNewItem({...newItem, item_name: e.target.value})}
                onKeyDown={e => e.key === 'Enter' && handleAdd()} />
              <button onClick={handleAdd} className="btn-primary"><Plus size={18} /></button>
            </div>
          </div>
        )}

        {/* Grouped Items */}
        <div className="space-y-6">
          {CATEGORIES.filter(cat => grouped[cat]?.length > 0).map(cat => (
            <div key={cat} className="glass rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-amber-700/10 to-orange-500/10 px-6 py-3 flex items-center gap-2">
                <span className="text-lg">{CAT_ICONS[cat]}</span>
                <h3 className="text-amber-900 font-semibold">{cat}</h3>
                <span className="text-xs text-amber-700 ml-auto">{grouped[cat].filter(i => i.is_packed).length}/{grouped[cat].length}</span>
              </div>
              <div className="divide-y divide-amber-100">
                {grouped[cat].map(item => (
                  <div key={item.id} className="flex items-center gap-3 px-6 py-3 hover:bg-white/[0.02] transition-colors group">
                    <button onClick={() => handleToggle(item)} className="shrink-0">
                      {item.is_packed ? <CheckSquare size={20} className="text-emerald-600" /> : <Square size={20} className="text-amber-600" />}
                    </button>
                    <span className={`flex-1 text-sm ${item.is_packed ? 'text-amber-600 line-through' : 'text-amber-800'}`}>{item.item_name}</span>
                    <button onClick={() => handleDelete(item.id)} className="p-1 rounded text-amber-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-16 text-amber-600">
            <CheckSquare size={48} className="mx-auto mb-4 text-amber-500" />
            <p>No items yet. Add your first packing item!</p>
          </div>
        )}
      </div>
    </div>
  );
}
