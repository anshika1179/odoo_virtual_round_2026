import { useState, useEffect } from 'react';
import { getCommunityPosts, createCommunityPost, likePost } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Search, Heart, MessageCircle, Plus, Send, Users, Globe, Camera, Sparkles } from 'lucide-react';
import { FeedSkeleton } from '../../components/common/Skeletons';

export default function CommunityTab() {
  const { user } = useAuth();
  const toast = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', experience_text: '', image_url: '' });

  const loadPosts = () => {
    getCommunityPosts({ search: search || undefined }).then(r => { setPosts(r.data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { loadPosts(); }, [search]);

  const handleCreate = async () => {
    if (!newPost.title) return;
    await createCommunityPost(newPost);
    setNewPost({ title: '', experience_text: '', image_url: '' });
    setShowCreate(false);
    toast.success('Experience shared with the community!');
    loadPosts();
  };

  const handleLike = async (postId) => {
    await likePost(postId);
    loadPosts();
  };

  return (
    <div className="mx-auto flex flex-col items-center" style={{ maxWidth: '1440px', padding: '120px 64px 80px 64px' }}>
      <div className="animate-fadeInUp w-full" style={{ maxWidth: '800px' }}>
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 text-center sm:text-left">
          <div>
            <h1 className="text-amber-950 font-bold flex items-center justify-center sm:justify-start gap-3" style={{ fontSize: '36px' }}>
              <Users size={32} className="text-amber-700" /> Community
            </h1>
            <p className="text-amber-900/70 mt-1">Share experiences and get inspired by fellow travelers</p>
          </div>
          {user && (
            <button onClick={() => setShowCreate(!showCreate)} className="btn-primary flex items-center gap-2" style={{ padding: '0 24px', height: '48px', borderRadius: '16px' }}>
              <Plus size={18} /> Share Experience
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-10 mx-auto" style={{ width: '100%', maxWidth: '520px' }}>
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-900/40" />
          <input className="input-glass outline-none transition-colors w-full" placeholder="Search community posts..." value={search} onChange={e => setSearch(e.target.value)} 
            style={{ height: '56px', borderRadius: '18px', padding: '0 20px 0 44px', border: '1px solid rgba(120,90,60,0.12)', fontSize: '15px' }} />
        </div>

        {/* Create Post */}
        {showCreate && (
          <div className="glass shadow-soft animate-fadeInUp" style={{ borderRadius: '24px', padding: '32px', marginBottom: '40px', border: '1px solid rgba(120,90,60,0.08)' }}>
            <h3 className="text-amber-950 font-semibold mb-6 flex items-center gap-2 text-lg"><Globe size={20} className="text-amber-700" /> Share Your Trip Experience</h3>
            <div className="space-y-4">
              <input className="input-glass w-full" placeholder="Title of your experience..." value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} style={{ height: '56px', borderRadius: '16px', padding: '0 20px', border: '1px solid rgba(120,90,60,0.12)' }} />
              <textarea className="input-glass w-full" rows={5} placeholder="Tell us about your amazing trip..." value={newPost.experience_text} onChange={e => setNewPost({...newPost, experience_text: e.target.value})} style={{ borderRadius: '16px', padding: '20px', border: '1px solid rgba(120,90,60,0.12)', resize: 'none' }} />
              <input className="input-glass w-full" placeholder="Image URL (optional)" value={newPost.image_url} onChange={e => setNewPost({...newPost, image_url: e.target.value})} style={{ height: '56px', borderRadius: '16px', padding: '0 20px', border: '1px solid rgba(120,90,60,0.12)' }} />
              <div className="flex gap-3 pt-2">
                <button onClick={handleCreate} className="btn-primary flex items-center gap-2" style={{ padding: '0 28px', height: '48px', borderRadius: '16px', fontWeight: 600 }}><Send size={16} /> Post</button>
                <button onClick={() => setShowCreate(false)} className="btn-secondary" style={{ padding: '0 28px', height: '48px', borderRadius: '16px', fontWeight: 600 }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Posts Feed */}
        {loading ? (
          <FeedSkeleton count={3} />
        ) : (
          <div className="space-y-8">
            {posts.map((post, i) => (
              <div key={post.id} className="glass group hover:-translate-y-1 hover:shadow-soft transition-all duration-300 animate-fadeInUp flex flex-col" 
                   style={{ borderRadius: '28px', overflow: 'hidden', border: '1px solid rgba(120,90,60,0.08)', animationDelay: `${i * 0.05}s` }}>
                {post.image_url && (
                  <div className="relative overflow-hidden shrink-0" style={{ height: '320px' }}>
                    <img src={post.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={e => { e.target.style.display = 'none'; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />
                  </div>
                )}
                <div style={{ padding: '32px' }}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-orange-50 flex items-center justify-center text-amber-950 font-bold border border-amber-900/10">
                      {post.user_name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <h4 className="text-amber-950 font-semibold">{post.user_name || 'Anonymous'}</h4>
                      <p className="text-amber-900/50 text-sm">{new Date(post.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <h3 className="text-amber-950 font-bold text-2xl mb-3">{post.title}</h3>
                  {post.experience_text && <p className="text-amber-900/70 leading-relaxed whitespace-pre-wrap">{post.experience_text}</p>}
                  <div className="flex items-center gap-8 mt-6 pt-6 border-t border-amber-900/10">
                    <button onClick={() => handleLike(post.id)} className="flex items-center gap-2 text-sm text-amber-900/60 hover:text-red-500 transition-colors font-medium">
                      <Heart size={20} className={post.likes_count > 0 ? 'text-red-500 fill-red-500' : ''} /> {post.likes_count || 0}
                    </button>
                    <span className="flex items-center gap-2 text-sm text-amber-900/60 font-medium"><MessageCircle size={20} /> Inspire</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center animate-fadeInUp" style={{ maxWidth: '700px', margin: '0 auto', paddingTop: '100px', textAlign: 'center' }}>
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-amber-100 to-orange-50 flex items-center justify-center mb-8 shadow-sm border border-amber-900/5">
              <Camera size={48} className="text-amber-700/50" />
            </div>
            <h3 className="text-amber-950 font-bold" style={{ fontSize: '32px', marginBottom: '16px' }}>Share your travel stories</h3>
            <p className="text-amber-900/70" style={{ fontSize: '18px', lineHeight: 1.6, marginBottom: '8px' }}>Be the first to share! Post your travel experiences, tips, and photos to inspire fellow travelers.</p>
            <p className="text-amber-900/50 text-sm flex items-center justify-center gap-2 mb-8">
              <Sparkles size={16} className="text-amber-500" /> Your story could inspire someone's next adventure
            </p>
            {user && (
              <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2" style={{ marginTop: '32px', height: '56px', padding: '0 36px', borderRadius: '18px', fontSize: '16px', fontWeight: 600 }}>
                <Plus size={20} /> Share Your First Experience
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
