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
    <div
      className="mx-auto flex flex-col items-center"
      style={{ maxWidth: "1440px", padding: "120px 64px 80px 64px" }}
    >
      <div className="animate-fadeInUp w-full" style={{ maxWidth: "1200px" }}>
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4 text-center sm:text-left">
          <div>
            <h1
              className="text-amber-950 font-bold flex items-center justify-center sm:justify-start gap-3"
              style={{ fontSize: "36px" }}
            >
              Expense Invoice
            </h1>
            <p className="text-amber-900/70 mt-2 text-lg">
              {trip?.title}
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleDownload} 
              className="btn-secondary flex items-center gap-2"
              style={{ height: "48px", borderRadius: "14px", padding: "0 20px", fontWeight: 600 }}
            >
              <Download size={18} /> Download TXT
            </button>
            <button 
              onClick={handleExportPdf} 
              disabled={pdfLoading} 
              className="btn-primary flex items-center gap-2"
              style={{ height: "48px", borderRadius: "14px", padding: "0 20px", fontWeight: 600 }}
            >
              {pdfLoading ? <><Loader2 size={18} className="animate-spin" /> Generating...</> : pdfSuccess ? <><CheckCircle size={18} /> Downloaded!</> : <><FileText size={18} /> Export PDF</>}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Expense Table */}
          <div className="lg:col-span-2">
            <div 
              className="glass shadow-soft overflow-hidden"
              style={{ borderRadius: "24px", border: "1px solid rgba(120,90,60,0.08)" }}
            >
              <div className="bg-gradient-to-r from-amber-700/10 to-orange-600/10 px-8 py-5 flex items-center justify-between border-b border-amber-900/10">
                <h2 className="text-amber-950 font-bold text-xl">Line Items</h2>
                <button 
                  onClick={() => setShowAdd(!showAdd)} 
                  className="btn-primary flex items-center gap-2"
                  style={{ height: "36px", borderRadius: "10px", padding: "0 16px", fontSize: "14px", fontWeight: 600 }}
                >
                  <Plus size={16} /> Add Expense
                </button>
              </div>

              {showAdd && (
                <div className="p-6 border-b border-amber-900/10 bg-amber-900/5">
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                    <select 
                      className="input-glass col-span-1 sm:col-span-1" 
                      value={newExp.category} 
                      onChange={e => setNewExp({...newExp, category: e.target.value})}
                      style={{ height: "48px", borderRadius: "12px", padding: "0 12px", border: "1px solid rgba(120,90,60,0.12)", fontSize: "14px", outline: "none", backgroundColor: "rgba(255,255,255,0.5)" }}
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input 
                      className="input-glass col-span-1 sm:col-span-2" 
                      placeholder="Description" 
                      value={newExp.description} 
                      onChange={e => setNewExp({...newExp, description: e.target.value})} 
                      style={{ height: "48px", borderRadius: "12px", padding: "0 16px", border: "1px solid rgba(120,90,60,0.12)", fontSize: "14px", outline: "none" }}
                    />
                    <input 
                      type="number" 
                      className="input-glass col-span-1 sm:col-span-1" 
                      placeholder="Qty" 
                      value={newExp.quantity} 
                      onChange={e => setNewExp({...newExp, quantity: e.target.value})} 
                      style={{ height: "48px", borderRadius: "12px", padding: "0 16px", border: "1px solid rgba(120,90,60,0.12)", fontSize: "14px", outline: "none" }}
                    />
                    <div className="flex gap-2 col-span-1 sm:col-span-2">
                      <input 
                        type="number" 
                        className="input-glass flex-1" 
                        placeholder="Cost" 
                        value={newExp.unit_cost} 
                        onChange={e => setNewExp({...newExp, unit_cost: e.target.value})} 
                        style={{ height: "48px", borderRadius: "12px", padding: "0 16px", border: "1px solid rgba(120,90,60,0.12)", fontSize: "14px", outline: "none" }}
                      />
                      <button 
                        onClick={handleAdd} 
                        className="btn-primary flex items-center justify-center shrink-0"
                        style={{ height: "48px", width: "48px", borderRadius: "12px" }}
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-amber-900/60 uppercase tracking-wider text-xs border-b border-amber-900/10 bg-amber-900/[0.02]">
                      <th className="text-left p-5 font-bold">Category</th>
                      <th className="text-left p-5 font-bold">Description</th>
                      <th className="text-center p-5 font-bold">Qty</th>
                      <th className="text-right p-5 font-bold">Unit Cost</th>
                      <th className="text-right p-5 font-bold">Amount</th>
                      <th className="p-5"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice?.expenses?.map(exp => (
                      <tr key={exp.id} className="border-b border-amber-900/5 hover:bg-white/40 transition-colors">
                        <td className="p-5"><span className="badge bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold px-2 py-1">{exp.category}</span></td>
                        <td className="p-5 text-amber-950 font-medium">{exp.description}</td>
                        <td className="p-5 text-center text-amber-900/70 font-medium">{exp.quantity}</td>
                        <td className="p-5 text-right text-amber-900/70 font-medium">${exp.unit_cost}</td>
                        <td className="p-5 text-right text-emerald-700 font-bold">${exp.total_amount}</td>
                        <td className="p-5 text-right">
                          <button onClick={() => handleDelete(exp.id)} className="p-2 rounded-lg text-amber-900/40 hover:text-red-500 hover:bg-red-50 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!invoice?.expenses || invoice.expenses.length === 0) && (
                      <tr><td colSpan={6} className="p-12 text-center text-amber-900/50 font-medium text-base">No expenses added yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Budget Summary Sidebar */}
          <div className="space-y-6">
            {isOverBudget && (
              <div 
                className="glass shadow-soft animate-fadeInUp"
                style={{ borderRadius: "24px", padding: "24px", border: "1px solid rgba(239,68,68,0.2)", backgroundColor: "rgba(254,226,226,0.5)" }}
              >
                <div className="flex items-center gap-2 text-red-600 font-bold text-lg mb-1"><AlertTriangle size={20} /> Over Budget!</div>
                <p className="text-red-800/70 text-sm font-medium">You've exceeded your budget by <span className="font-bold text-red-600">${Math.abs(invoice.budget_summary.remaining).toFixed(2)}</span></p>
              </div>
            )}

            <div 
              className="glass shadow-soft"
              style={{ borderRadius: "24px", padding: "32px", border: "1px solid rgba(120,90,60,0.08)" }}
            >
              <h3 className="text-amber-950 font-bold text-xl mb-6">Budget Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center"><span className="text-amber-900/70 font-medium">Total Budget</span><span className="text-amber-950 font-bold text-lg">${invoice?.budget_summary?.total_budget || 0}</span></div>
                <div className="flex justify-between items-center"><span className="text-amber-900/70 font-medium">Total Spent</span><span className="text-orange-600 font-bold text-lg">${invoice?.budget_summary?.total_spent?.toFixed(2) || 0}</span></div>
                <div className="h-px bg-amber-900/10 my-2" />
                <div className="flex justify-between items-center"><span className="text-amber-900/70 font-medium">Remaining</span><span className={`font-black text-xl ${isOverBudget ? 'text-red-600' : 'text-emerald-600'}`}>${invoice?.budget_summary?.remaining?.toFixed(2) || 0}</span></div>
              </div>

              {/* Progress bar */}
              <div className="mt-8">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold text-amber-900/60 uppercase tracking-wider">Usage</span>
                  <span className="text-xs font-bold text-amber-900/60">{((invoice?.budget_summary?.total_spent || 0) / (invoice?.budget_summary?.total_budget || 1) * 100).toFixed(0)}%</span>
                </div>
                <div className="h-3 rounded-full bg-amber-900/10 overflow-hidden shadow-inner">
                  <div className={`h-full rounded-full transition-all duration-1000 ease-out ${isOverBudget ? 'bg-gradient-to-r from-red-500 to-red-400' : 'bg-gradient-to-r from-amber-500 to-emerald-400'}`}
                    style={{ width: `${Math.min(100, ((invoice?.budget_summary?.total_spent || 0) / (invoice?.budget_summary?.total_budget || 1)) * 100)}%` }} />
                </div>
              </div>
            </div>

            {/* Pie Chart */}
            {pieData.length > 0 && (
              <div 
                className="glass shadow-soft"
                style={{ borderRadius: "24px", padding: "32px", border: "1px solid rgba(120,90,60,0.08)" }}
              >
                <h3 className="text-amber-950 font-bold text-xl mb-6">Expense Breakdown</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#FAF7F2', border: '1px solid rgba(120,90,60,0.1)', borderRadius: '16px', color: '#451a03', boxShadow: '0 10px 25px -5px rgba(120,90,60,0.1)' }} itemStyle={{ color: '#78350f', fontWeight: '600' }} />
                    <Legend wrapperStyle={{ color: '#78350f', fontSize: '13px', fontWeight: '500' }} />
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
