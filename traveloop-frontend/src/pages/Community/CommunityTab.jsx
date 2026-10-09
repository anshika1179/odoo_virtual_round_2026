import { useState, useEffect, useRef } from "react";
import {
  getCommunityPosts,
  createCommunityPost,
  likePost,
  uploadCommunityImage,
} from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  Search,
  Heart,
  Plus,
  Send,
  Users,
  Globe,
  Camera,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import PostFeedback from "./PostFeedback";
import { FeedSkeleton } from "../../components/common/Skeletons";

export default function CommunityTab() {
  const { user } = useAuth();
  const toast = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    experience_text: "",
    image_url: "",
    image_urls: [],
  });
  const [posting, setPosting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const loadPosts = () => {
    getCommunityPosts({ search: search || undefined })
      .then((r) => {
        setPosts(r.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };
  useEffect(() => {
    loadPosts();
  }, [search]);

  const handleCreate = async () => {
    if (!newPost.title.trim() || uploadingImage || posting) return;
    setPosting(true);
    try {
      await createCommunityPost(newPost);
      setNewPost({ title: "", experience_text: "", image_url: "", image_urls: [] });
      setShowCreate(false);
      toast.success("Experience shared with the community!");
      loadPosts();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Could not share your experience. Please try again.");
    } finally { setPosting(false); }
  };

  const handleLike = async (postId) => {
    await likePost(postId);
    loadPosts();
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || uploadingImage || posting) return;
    if (newPost.image_urls.length + files.length > 5) {
      toast.error("You can upload up to 5 visit photos.");
      e.target.value = "";
      return;
    }
    if (files.some(file => !['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024)) {
      toast.error("Use JPG, PNG, GIF or WebP photos, up to 5 MB each.");
      e.target.value = "";
      return;
    }
    setUploadingImage(true);
    try {
      for (const file of files) {
        const res = await uploadCommunityImage(file);
        setNewPost(current => ({ ...current, image_urls: [...current.image_urls, res.data.image_url] }));
      }
    } catch {
      toast.error("A photo could not be uploaded. Photos already uploaded are kept; try the remaining photos again.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = () => setNewPost(current => ({ ...current, image_url: "" }));
  const removePhoto = url => setNewPost(current => ({ ...current, image_urls: current.image_urls.filter(photo => photo !== url) }));

  return (
    <div className="community-page">
      <div className="animate-fadeInUp w-full">
        <div className="community-header">
          <div className="community-header-left">
            <h1
              className="text-amber-950 font-bold flex items-center gap-3"
              style={{ fontSize: "36px" }}
            >
              <Users size={32} className="text-amber-700" /> Community
            </h1>
            <p className="text-amber-900/70">
              Share experiences and get inspired by fellow travelers
            </p>
            
            {/* Search */}
            <div className="relative community-search">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-900/40"
              />
              <input
                className="input-glass outline-none transition-colors w-full"
                placeholder="Search community posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  height: "56px",
                  borderRadius: "18px",
                  padding: "0 20px 0 44px",
                  border: "1px solid rgba(120,90,60,0.12)",
                  fontSize: "15px",
                }}
              />
            </div>
          </div>
          
          <div className="community-header-right">
            {user && (
              <button
                onClick={() => setShowCreate(!showCreate)}
                className="btn-primary flex items-center gap-2"
                style={{
                  padding: "0 24px",
                  height: "48px",
                  borderRadius: "16px",
                }}
              >
                <Plus size={18} /> Share Experience
              </button>
            )}
          </div>
        </div>

        {/* Create Post */}
        {showCreate && (
          <div
            className="glass shadow-soft animate-fadeInUp"
            style={{
              borderRadius: "24px",
              padding: "32px",
              marginBottom: "40px",
              border: "1px solid rgba(120,90,60,0.08)",
            }}
          >
            <h3 className="text-amber-950 font-semibold mb-6 flex items-center gap-2 text-lg">
              <Globe size={20} className="text-amber-700" /> Share Your Trip
              Experience
            </h3>
            <div className="space-y-4">
              <input
                className="input-glass w-full"
                maxLength={300}
                placeholder="Title of your experience..."
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
                style={{
                  height: "56px",
                  borderRadius: "16px",
                  padding: "0 20px",
                  border: "1px solid rgba(120,90,60,0.12)",
                }}
              />
              <textarea
                className="input-glass w-full"
                rows={5}
                placeholder="Tell us about your amazing trip..."
                value={newPost.experience_text}
                onChange={(e) =>
                  setNewPost({ ...newPost, experience_text: e.target.value })
                }
                style={{
                  borderRadius: "16px",
                  padding: "20px",
                  border: "1px solid rgba(120,90,60,0.12)",
                  resize: "none",
                }}
              />
              {newPost.image_url && (
                <div className="relative mb-2">
                  <img
                    src={newPost.image_url}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-2xl border border-amber-200"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {newPost.image_urls.length > 0 && <div className="flex flex-wrap" style={{ gap: "12px", marginBottom: "12px" }}>
                {newPost.image_urls.map((url, index) => <div key={url} className="relative">
                  <img src={url} alt={`Visit photo preview ${index + 1}`} style={{ width: "140px", height: "110px", objectFit: "cover", borderRadius: "12px" }} />
                  <button onClick={() => removePhoto(url)} disabled={uploadingImage || posting} aria-label={`Remove visit photo ${index + 1}`} className="absolute bg-red-500 text-white rounded-lg" style={{ top: "4px", right: "4px", padding: "4px" }}><X size={14} /></button>
                </div>)}
              </div>}
              <p className="text-xs text-amber-900/60" style={{ marginBottom: "8px" }}>Visit photos: up to 5 photos, JPG/PNG/GIF/WebP, 5 MB each.</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage || posting || newPost.image_urls.length >= 5}
                  className="btn-secondary flex items-center justify-center gap-2 text-sm flex-1"
                  style={{ height: "48px", borderRadius: "16px" }}
                >
                  <Upload size={16} />{" "}
                  {uploadingImage ? "Uploading..." : `Upload Visit Photos (${newPost.image_urls.length}/5)`}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              {newPost.image_urls.length === 0 && <input
                className="input-glass w-full text-sm"
                placeholder="Or paste image URL"
                value={newPost.image_url}
                onChange={(e) =>
                  setNewPost({ ...newPost, image_url: e.target.value })
                }
                style={{
                  height: "48px",
                  borderRadius: "16px",
                  padding: "0 20px",
                  border: "1px solid rgba(120,90,60,0.12)",
                  marginTop: "8px",
                }}
              />}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCreate}
                  disabled={uploadingImage || posting || !newPost.title.trim()}
                  className="btn-primary flex items-center gap-2"
                  style={{
                    padding: "0 28px",
                    height: "48px",
                    borderRadius: "16px",
                    fontWeight: 600,
                  }}
                >
                  <Send size={16} /> {posting ? "Posting..." : "Post"}
                </button>
                <button
                  disabled={posting || uploadingImage}
                  onClick={() => setShowCreate(false)}
                  className="btn-secondary"
                  style={{
                    padding: "0 28px",
                    height: "48px",
                    borderRadius: "16px",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
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
              <div
                key={post.id}
                className="glass group hover:-translate-y-1 hover:shadow-soft transition-all duration-300 animate-fadeInUp flex flex-col"
                style={{
                  borderRadius: "28px",
                  overflow: "hidden",
                  border: "1px solid rgba(120,90,60,0.08)",
                  animationDelay: `${i * 0.05}s`,
                }}
              >
                {post.image_urls?.length > 1 ? (
                  <div className="grid grid-cols-2" style={{ gap: "4px" }}>
                    {post.image_urls.map((url, index) => <a key={url} href={url} target="_blank" rel="noreferrer" aria-label={`Open visit photo ${index + 1}`}>
                      <img src={url} alt={`${post.title} - visit photo ${index + 1}`} className="w-full" style={{ height: "220px", objectFit: "cover" }} />
                    </a>)}
                  </div>
                ) : post.image_url && (
                  <div
                    className="relative overflow-hidden shrink-0"
                    style={{ height: "320px" }}
                  >
                    <img
                      src={post.image_url}
                      alt={`${post.title} - visit photo`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />
                  </div>
                )}
                <div style={{ padding: "32px" }}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-orange-50 flex items-center justify-center text-amber-950 font-bold border border-amber-900/10">
                      {post.user_name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <h4 className="text-amber-950 font-semibold">
                        {post.user_name || "Anonymous"}
                      </h4>
                      <p className="text-amber-900/50 text-sm">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <h3 className="text-amber-950 font-bold text-2xl mb-3">
                    {post.title}
                  </h3>
                  {post.experience_text && (
                    <p className="text-amber-900/70 leading-relaxed whitespace-pre-wrap">
                      {post.experience_text}
                    </p>
                  )}
                  <div className="flex items-center gap-8 mt-6 pt-6 border-t border-amber-900/10">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-2 text-sm text-amber-900/60 hover:text-red-500 transition-colors font-medium"
                    >
                      <Heart
                        size={20}
                        className={
                          post.user_liked ? "text-red-500 fill-red-500" : ""
                        }
                      />{" "}
                      {post.likes_count || 0}
                    </button>
                  </div>
                  <div style={{ marginTop: "12px" }}><PostFeedback post={post} /></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="community-empty-state animate-fadeInUp">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-amber-100 to-orange-50 flex items-center justify-center shadow-sm border border-amber-900/5">
              <Camera size={48} className="text-amber-700/50" />
            </div>
            <h2 className="text-amber-950 font-bold" style={{ fontSize: "32px" }}>
              Share your travel stories
            </h2>
            <p className="text-amber-900/70" style={{ fontSize: "18px" }}>
              Be the first to share! Post your travel experiences, tips, and
              photos to inspire fellow travelers.
            </p>
            <p className="text-amber-900/50 text-sm flex items-center justify-center gap-2">
              <Sparkles size={16} className="text-amber-500" /> Your story could
              inspire someone's next adventure
            </p>
            {user && (
              <button
                onClick={() => setShowCreate(true)}
                className="btn-primary flex items-center gap-2"
                style={{
                  height: "56px",
                  padding: "0 36px",
                  borderRadius: "18px",
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                <Plus size={20} /> Share Your First Experience
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
