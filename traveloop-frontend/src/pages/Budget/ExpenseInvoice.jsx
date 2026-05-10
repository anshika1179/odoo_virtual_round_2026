import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getInvoice, getTrip, createExpense, deleteExpense, downloadInvoicePdf } from '../../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { DollarSign, Download, FileText, Plus, Trash2, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];
const CATEGORIES = ['HOTEL', 'FLIGHT', 'FOOD', 'ACTIVITY', 'TRANSPORT', 'MISC'];

export default function ExpenseInvoice() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newExp, setNewExp] = useState({ category: 'FOOD', description: '', quantity: 1, unit_cost: '' });
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  const loadData = async () => {
    try {
      const [invRes, tripRes] = await Promise.all([getInvoice(id), getTrip(id)]);
      setInvoice(invRes.data);
      setTrip(tripRes.data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [id]);

  const handleAdd = async () => {
    if (!newExp.description || !newExp.unit_cost) return;
    try {
      await createExpense(id, { ...newExp, unit_cost: parseFloat(newExp.unit_cost), quantity: parseInt(newExp.quantity) || 1 });
      setNewExp({ category: 'FOOD', description: '', quantity: 1, unit_cost: '' });
      setShowAdd(false);
      loadData();
    } catch {}
  };

  const handleDelete = async (expId) => {
    try { await deleteExpense(expId); loadData(); } catch {}
  };

  const handleDownload = () => {
    const content = generateInvoiceText();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `invoice_${trip?.title || 'trip'}.txt`; a.click();
  };

  const handleExportPdf = async () => {
    setPdfLoading(true);
    setPdfSuccess(false);
    try {
      const res = await downloadInvoicePdf(id);
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Traveloop_Invoice_${trip?.title?.replace(/\s+/g, '_') || 'trip'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3000);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  const generateInvoiceText = () => {
    if (!invoice || !trip) return '';
    let text = `TRAVELOOP INVOICE\n${'='.repeat(50)}\n`;
    text += `Trip: ${trip.title}\nDates: ${new Date(trip.start_date).toLocaleDateString()} - ${new Date(trip.end_date).toLocaleDateString()}\n\n`;
    text += `${'Category'.padEnd(15)} ${'Description'.padEnd(25)} ${'Qty'.padEnd(5)} ${'Unit'.padEnd(10)} ${'Amount'.padEnd(10)}\n`;
    text += `${'-'.repeat(65)}\n`;
    invoice.expenses?.forEach(e => {
      text += `${e.category.padEnd(15)} ${e.description.padEnd(25)} ${String(e.quantity).padEnd(5)} $${String(e.unit_cost).padEnd(9)} $${e.total_amount}\n`;
    });
    text += `${'-'.repeat(65)}\n`;
    text += `Total Budget: $${invoice.budget_summary?.total_budget}\nTotal Spent: $${invoice.budget_summary?.total_spent}\nRemaining: $${invoice.budget_summary?.remaining}\n`;
    return text;
  };

  if (loading) return <div className="pt-20 flex justify-center"><Loader2 size={32} className="animate-spin text-amber-700" /></div>;

  const pieData = invoice?.category_breakdown ? Object.entries(invoice.category_breakdown).map(([name, value]) => ({ name, value })) : [];
  const isOverBudget = (invoice?.budget_summary?.remaining || 0) < 0;

  return (
    <div className="pt-20 pb-12 max-w-6xl mx-auto px-4">
      <div className="animate-fadeInUp">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-amber-900">Expense Invoice</h1>
            <p className="text-amber-700">{trip?.title}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleDownload} className="btn-secondary text-sm"><Download size={16} /> Download TXT</button>
            <button onClick={handleExportPdf} disabled={pdfLoading} className="btn-primary text-sm">
              {pdfLoading ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : pdfSuccess ? <><CheckCircle size={16} /> Downloaded!</> : <><FileText size={16} /> Export as PDF</>}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Expense Table */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-amber-700/15 to-orange-600/15 px-6 py-4 flex items-center justify-between">
                <h2 className="text-amber-900 font-semibold">Line Items</h2>
                <button onClick={() => setShowAdd(!showAdd)} className="btn-primary text-xs py-1.5 px-3"><Plus size={14} /> Add</button>
              </div>

              {showAdd && (
                <div className="p-4 border-b border-amber-200/50 bg-slate-800/30">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <select className="input-glass text-sm" value={newExp.category} onChange={e => setNewExp({...newExp, category: e.target.value})}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input className="input-glass text-sm col-span-1 sm:col-span-2" placeholder="Description" value={newExp.description} onChange={e => setNewExp({...newExp, description: e.target.value})} />
                    <input type="number" className="input-glass text-sm" placeholder="Qty" value={newExp.quantity} onChange={e => setNewExp({...newExp, quantity: e.target.value})} />
                    <div className="flex gap-1">
                      <input type="number" className="input-glass text-sm flex-1" placeholder="Cost" value={newExp.unit_cost} onChange={e => setNewExp({...newExp, unit_cost: e.target.value})} />
                      <button onClick={handleAdd} className="btn-primary text-xs px-3 shrink-0"><Plus size={14} /></button>
                    </div>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-amber-700 border-b border-amber-200">
                      <th className="text-left p-4 font-medium">Category</th>
                      <th className="text-left p-4 font-medium">Description</th>
                      <th className="text-center p-4 font-medium">Qty</th>
                      <th className="text-right p-4 font-medium">Unit Cost</th>
                      <th className="text-right p-4 font-medium">Amount</th>
                      <th className="p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice?.expenses?.map(exp => (
                      <tr key={exp.id} className="border-b border-amber-100 hover:bg-white/[0.02] transition-colors">
                        <td className="p-4"><span className="badge badge-upcoming text-xs">{exp.category}</span></td>
                        <td className="p-4 text-amber-800">{exp.description}</td>
                        <td className="p-4 text-center text-amber-700">{exp.quantity}</td>
                        <td className="p-4 text-right text-amber-700">${exp.unit_cost}</td>
                        <td className="p-4 text-right text-emerald-600 font-semibold">${exp.total_amount}</td>
                        <td className="p-4">
                          <button onClick={() => handleDelete(exp.id)} className="p-1 rounded text-amber-600 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                    {(!invoice?.expenses || invoice.expenses.length === 0) && (
                      <tr><td colSpan={6} className="p-8 text-center text-amber-600">No expenses added yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Budget Summary Sidebar */}
          <div className="space-y-6">
            {isOverBudget && (
              <div className="glass rounded-2xl p-4 border border-red-500/30 bg-red-500/5">
                <div className="flex items-center gap-2 text-red-400 font-semibold text-sm"><AlertTriangle size={18} /> Over Budget!</div>
                <p className="text-red-300/70 text-xs mt-1">You've exceeded your budget by ${Math.abs(invoice.budget_summary.remaining).toFixed(2)}</p>
              </div>
            )}

            <div className="glass rounded-2xl p-6">
              <h3 className="text-amber-900 font-semibold mb-4">Budget Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-amber-700">Total Budget</span><span className="text-amber-900 font-semibold">${invoice?.budget_summary?.total_budget || 0}</span></div>
                <div className="flex justify-between"><span className="text-amber-700">Total Spent</span><span className="text-amber-400 font-semibold">${invoice?.budget_summary?.total_spent?.toFixed(2) || 0}</span></div>
                <div className="h-px bg-slate-700" />
                <div className="flex justify-between"><span className="text-amber-700">Remaining</span><span className={`font-bold ${isOverBudget ? 'text-red-400' : 'text-emerald-600'}`}>${invoice?.budget_summary?.remaining?.toFixed(2) || 0}</span></div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="h-3 rounded-full bg-slate-700 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-gradient-to-r from-red-500 to-red-400' : 'bg-gradient-to-r from-amber-700 to-orange-500'}`}
                    style={{ width: `${Math.min(100, ((invoice?.budget_summary?.total_spent || 0) / (invoice?.budget_summary?.total_budget || 1)) * 100)}%` }} />
                </div>
                <p className="text-xs text-amber-600 mt-1 text-right">{((invoice?.budget_summary?.total_spent || 0) / (invoice?.budget_summary?.total_budget || 1) * 100).toFixed(0)}% used</p>
              </div>
            </div>

            {/* Pie Chart */}
            {pieData.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <h3 className="text-amber-900 font-semibold mb-4">Expense Breakdown</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#e2e8f0' }} />
                    <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
