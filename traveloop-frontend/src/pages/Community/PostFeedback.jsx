import { useState } from 'react';
import { MessageCircle, Send, Trash2, Loader2 } from 'lucide-react';
import { getPostComments, createPostComment, deletePostComment } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function PostFeedback({ post }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [count, setCount] = useState(post.comments_count || 0);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadComments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getPostComments(post.id);
      setComments(res.data);
      setCount(res.data.length);
    } catch { setError('Could not load feedback. Please try again.'); }
    finally { setLoading(false); }
  };
  const toggle = () => {
    if (!open) loadComments();
    setOpen(!open);
  };
  const submit = async event => {
    event.preventDefault();
    if (!content.trim() || saving) return;
    setSaving(true);
    setError('');
    try {
      const res = await createPostComment(post.id, { content: content.trim() });
      setComments(current => [...current, res.data]);
      setCount(current => current + 1);
      setContent('');
    } catch { setError('Could not post feedback. Your message is still here. Please try again.'); }
    finally { setSaving(false); }
  };
  const remove = async commentId => {
    if (saving) return;
    setSaving(true);
    setError('');
    try {
      await deletePostComment(post.id, commentId);
      setComments(current => current.filter(c => c.id !== commentId));
      setCount(current => current - 1);
    } catch { setError('Could not delete feedback. Please try again.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="w-full">
      <button onClick={toggle} aria-expanded={open} aria-controls={`feedback-${post.id}`} className="flex items-center gap-2 text-sm text-amber-900/60 font-medium hover:text-amber-700"><MessageCircle size={20} />Feedback ({count})</button>
      {open && <div id={`feedback-${post.id}`} style={{ marginTop: '16px' }}>
        {error && <p role="alert" className="text-sm text-red-600" style={{ marginBottom: '12px' }}>{error} <button onClick={loadComments} disabled={loading || saving} className="underline">Reload feedback</button></p>}
        {loading ? <p role="status" className="text-sm text-amber-700 flex gap-2"><Loader2 size={16} className="animate-spin" />Loading feedback...</p> : <>
          {!comments.length && <p className="text-sm text-amber-900/60">No feedback yet. Share a helpful tip or ask about this visit.</p>}
          {comments.map(comment => <div key={comment.id} className="rounded-xl bg-white/50" style={{ padding: '12px', marginBottom: '8px' }}>
            <div className="flex justify-between gap-2 items-start">
              <div><span className="text-sm font-semibold text-amber-950">{comment.user_name || 'Traveller'}</span><p className="text-xs text-amber-900/50">{new Date(comment.created_at).toLocaleString()}</p></div>
              {comment.user_id === user?.id && <button onClick={() => remove(comment.id)} disabled={saving} aria-label="Delete my feedback" className="text-amber-900/40 hover:text-red-500 disabled:opacity-40"><Trash2 size={16} /></button>}
            </div>
            <p className="text-sm text-amber-900/80 whitespace-pre-wrap break-words" style={{ marginTop: '8px' }}>{comment.content}</p>
          </div>)}
          <form onSubmit={submit} style={{ marginTop: '12px' }}>
            <label htmlFor={`feedback-input-${post.id}`} className="block text-sm font-semibold text-amber-950">Your feedback</label>
            <textarea id={`feedback-input-${post.id}`} maxLength={2000} rows={3} placeholder="Share feedback about this visit..." value={content} onChange={e => setContent(e.target.value)} disabled={saving} className="input-glass w-full" style={{ padding: '12px', borderRadius: '12px', marginTop: '8px', resize: 'vertical' }} />
            <button type="submit" disabled={saving || !content.trim()} className="btn-primary disabled:opacity-40" style={{ padding: '10px 16px', marginTop: '8px' }}>{saving ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}Post feedback</button>
          </form>
        </>}
      </div>}
    </div>
  );
}
