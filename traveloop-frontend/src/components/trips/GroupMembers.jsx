import useCurrency from '../../utils/useCurrency';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getTripMembers, inviteTripMember, removeTripMember } from '../../services/api';
import { Users, X, UserPlus, Trash2, Loader2, Crown } from 'lucide-react';

const STATUS_STYLES = {
  OWNER: 'bg-amber-800 text-amber-50 border border-amber-800',
  PENDING: 'bg-orange-50 text-orange-700 border border-orange-200',
  ACCEPTED: 'bg-amber-100 text-amber-800 border border-amber-200',
  DECLINED: 'bg-stone-100 text-stone-500 border border-stone-200',
};

export default function GroupMembers({ tripId, onClose }) {
  const money = useCurrency();
  const [data, setData] = useState(null);
  const [email, setEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = async () => {
    try {
      const res = await getTripMembers(tripId);
      setData(res.data);
    } catch {}
  };

  useEffect(() => { load(); }, [tripId]);

  const handleInvite = async () => {
    if (!email.trim()) return;
    setInviting(true);
    setError('');
    setNotice('');
    try {
      await inviteTripMember(tripId, email.trim());
      setEmail('');
      setNotice('Invitation sent! They can accept it from their My Trips page.');
      load();
    } catch (e) {
      setError(e.response?.data?.detail || 'Could not send invitation');
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (memberId) => {
    try { await removeTripMember(tripId, memberId); load(); } catch {}
  };

  const isOwner = data?.my_role === 'OWNER';
  const split = data?.split;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeInUp" onClick={onClose}>
      <div className="glass shadow-soft w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto" style={{ borderRadius: '32px', padding: '36px', border: '1px solid rgba(120,90,60,0.08)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-amber-950 flex items-center gap-2"><Users size={22} className="text-amber-700" /> Trip Group</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-xl text-amber-900/50 hover:text-amber-950 hover:bg-amber-900/5 flex items-center justify-center transition-colors">
            <X size={18} />
          </button>
        </div>

        {isOwner && (
          <div className="mb-6">
            <label className="text-xs font-bold text-amber-900/60 uppercase tracking-wider">Add a friend by email</label>
            <div className="flex gap-2 mt-2">
              <input
                type="email"
                className="input-glass outline-none transition-colors flex-1"
                placeholder="friend@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleInvite()}
                style={{ height: '48px', borderRadius: '14px', padding: '0 16px', border: '1px solid rgba(120,90,60,0.12)', fontSize: '14px' }}
              />
              <button onClick={handleInvite} disabled={inviting} className="btn-primary flex items-center gap-2 shrink-0" style={{ height: '48px', borderRadius: '14px', padding: '0 18px', fontWeight: 600 }}>
                {inviting ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />} Invite
              </button>
            </div>
            {error && <p className="text-red-600 text-sm mt-2 font-medium">{error}</p>}
            {notice && <p className="text-emerald-700 text-sm mt-2 font-medium">{notice}</p>}
            <p className="text-amber-900/50 text-xs mt-2 mb-1">They need a Traveloop account with this email to accept the invite.</p>
          </div>
        )}

        {/* Members list */}
        <div className="space-y-3 mb-6">
          {(data?.members || []).map(m => (
            <div key={`${m.user_id}-${m.id}`} className="flex items-center justify-between bg-white/40 rounded-2xl border border-amber-900/10" style={{ padding: '12px 16px' }}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-800 font-bold text-sm">
                  {(m.full_name || '?').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-amber-950 font-bold text-sm truncate flex items-center gap-1.5">
                    {m.full_name} {m.is_owner && <Crown size={13} className="text-amber-600" />}
                  </div>
                  <div className="text-amber-900/50 text-xs truncate">{m.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[m.status] || ''}`}>{m.status}</span>
                {isOwner && !m.is_owner && (
                  <button onClick={() => handleRemove(m.id)} className="p-1.5 rounded-lg text-amber-900/30 hover:text-red-500 hover:bg-red-50 transition-colors" title="Remove">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Budget split */}
        {split && split.member_count > 0 && (
          <div className="bg-amber-900/5 rounded-2xl border border-amber-900/10" style={{ padding: '20px' }}>
            <div className="text-xs font-bold text-amber-900/60 uppercase tracking-wider mb-3">Equal Split ({split.member_count} {split.member_count === 1 ? 'person' : 'people'})</div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-amber-900/70 text-sm font-medium">Budget per person</span>
              <span className="text-amber-950 font-bold">{money.fmt(split.per_person_budget)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-amber-900/70 text-sm font-medium">Spent per person</span>
              <span className="text-amber-950 font-bold">{money.fmt(split.per_person_spent, 2)}</span>
            </div>
            {data?.members?.some(m => m.status === 'PENDING') && (
              <p className="text-amber-900/50 text-xs mt-3">Pending invites count once they accept.</p>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
