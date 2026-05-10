import { useState, useEffect } from 'react';
import { getCommunityPosts, createCommunityPost, likePost } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Search, Heart, MessageCircle, Plus, Send, Loader2, Users, Globe } from 'lucide-react';

export default function CommunityTab() {
  const { user } = useAuth();
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
    loadPosts();
  };

  const handleLike = async (postId) => {
    await likePost(postId);
    loadPosts();
  };

  return (
    <div className="pt-20 pb-12 max-w-4xl mx-auto px-4">
      <div className="animate-fadeInUp">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Users size={32} className="text-indigo-400" /> Community
            </h1>
            <p className="text-slate-400 mt-1">Share experiences and get inspired by fellow travelers</p>
          </div>
          {user && <button onClick={() => setShowCreate(!showCreate)} className="btn-primary"><Plus size={18} /> Share Experience</button>}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input className="input-glass pl-10" placeholder="Search community posts..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Create Post */}
        {showCreate && (
          <div className="glass rounded-2xl p-6 mb-6 animate-fadeInUp">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Globe size={18} className="text-indigo-400" /> Share Your Trip Experience</h3>
            <div className="space-y-4">
              <input className="input-glass" placeholder="Title of your experience..." value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} />
              <textarea className="input-glass" rows={5} placeholder="Tell us about your amazing trip..." value={newPost.experience_text} onChange={e => setNewPost({...newPost, experience_text: e.target.value})} />
              <input className="input-glass" placeholder="Image URL (optional)" value={newPost.image_url} onChange={e => setNewPost({...newPost, image_url: e.target.value})} />
              <div className="flex gap-2">
                <button onClick={handleCreate} className="btn-primary"><Send size={16} /> Post</button>
                <button onClick={() => setShowCreate(false)} className="btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Posts Feed */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-indigo-400" /></div>
        ) : (
          <div className="space-y-6">
            {posts.map((post, i) => (
              <div key={post.id} className="glass rounded-2xl overflow-hidden glass-hover animate-fadeInUp" style={{animationDelay: `${i * 0.05}s`}}>
                {post.image_url && (
                  <div className="h-52 overflow-hidden">
                    <img src={post.image_url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      onError={e => { e.target.style.display = 'none'; }} />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {post.user_name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm">{post.user_name || 'Anonymous'}</h4>
                      <p className="text-slate-500 text-xs">{new Date(post.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">{post.title}</h3>
                  {post.experience_text && <p className="text-slate-400 text-sm whitespace-pre-wrap">{post.experience_text}</p>}
                  <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-800">
                    <button onClick={() => handleLike(post.id)} className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition-colors">
                      <Heart size={18} className={post.likes_count > 0 ? 'text-red-400 fill-red-400' : ''} /> {post.likes_count || 0}
                    </button>
                    <span className="flex items-center gap-2 text-sm text-slate-400"><MessageCircle size={18} /> Inspire</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <Users size={48} className="mx-auto mb-4 text-slate-600" />
            <p>No community posts yet. Be the first to share!</p>
          </div>
        )}
      </div>
    </div>
  );
}
