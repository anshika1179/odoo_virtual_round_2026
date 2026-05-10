import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  getProfile,
  updateProfile,
  getTrips,
  uploadProfilePhoto,
  deleteProfilePhoto,
} from "../../services/api";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  Loader2,
  Calendar,
  Eye,
  Edit3,
  Camera,
  Trash2,
  CheckCircle,
  Plane,
  Globe,
  Plus,
} from "lucide-react";

export default function UserProfile() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({});
  const [trips, setTrips] = useState([]);
  const [prevTrips, setPrevTrips] = useState([]);
  const [allTrips, setAllTrips] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    if (user) {
      setForm({
        full_name: user.full_name,
        phone: user.phone || "",
        city: user.city || "",
        country: user.country || "",
        additional_info: user.additional_info || "",
      });
      getTrips({ status: "UPCOMING" })
        .then((r) => setTrips(r.data.slice(0, 4)))
        .catch(() => {});
      getTrips({ status: "COMPLETED" })
        .then((r) => setPrevTrips(r.data.slice(0, 4)))
        .catch(() => {});
      getTrips({})
        .then((r) => setAllTrips(r.data))
        .catch(() => {});
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateProfile(form);
      setUser(res.data);
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setUploadMsg("Please select a valid image (JPG, PNG, GIF, WEBP)");
      setTimeout(() => setUploadMsg(""), 3000);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadMsg("Image must be under 5 MB");
      setTimeout(() => setUploadMsg(""), 3000);
      return;
    }

    setUploading(true);
    setUploadMsg("");
    try {
      const res = await uploadProfilePhoto(file);
      setUser(res.data);
      setUploadMsg("Photo updated!");
      setTimeout(() => setUploadMsg(""), 3000);
    } catch (err) {
      setUploadMsg(err.response?.data?.detail || "Upload failed");
      setTimeout(() => setUploadMsg(""), 4000);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleRemovePhoto = async () => {
    if (!user?.profile_photo_url) return;
    setUploading(true);
    try {
      const res = await deleteProfilePhoto();
      setUser(res.data);
      setUploadMsg("Photo removed");
      setTimeout(() => setUploadMsg(""), 3000);
    } catch {
    } finally {
      setUploading(false);
    }
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  // Photo URL — served via Vite's /static proxy to the backend
  const photoSrc = user?.profile_photo_url || null;

  const stats = useMemo(() => {
    const total = allTrips.length;
    const upcoming = allTrips.filter((t) => t.status === "UPCOMING").length;
    const completed = allTrips.filter((t) => t.status === "COMPLETED").length;
    const ongoing = allTrips.filter((t) => t.status === "ONGOING").length;
    return [
      {
        label: "Total Trips",
        value: total,
        icon: <Plane size={20} />,
        color: "from-amber-700 to-amber-900",
      },
      {
        label: "Upcoming",
        value: upcoming,
        icon: <Calendar size={20} />,
        color: "from-emerald-500 to-green-600",
      },
      {
        label: "Completed",
        value: completed,
        icon: <CheckCircle size={20} />,
        color: "from-amber-500 to-orange-600",
      },
      {
        label: "Ongoing",
        value: ongoing,
        icon: <Globe size={20} />,
        color: "from-orange-600 to-yellow-600",
      },
    ];
  }, [allTrips]);

  return (
    <div
      className="mx-auto flex flex-col items-center"
      style={{ maxWidth: "1440px", padding: "120px 48px 80px 48px" }}
    >
      <div className="animate-fadeInUp w-full" style={{ maxWidth: "960px" }}>
        {/* Profile Header */}
        <div 
          className="glass shadow-soft mb-12 relative overflow-hidden"
          style={{ borderRadius: "32px", border: "1px solid rgba(120,90,60,0.08)" }}
        >
          <div className="h-40 w-full bg-gradient-to-r from-amber-600/25 via-orange-400/20 to-amber-500/25 absolute top-0 left-0"></div>
          
          <div className="px-10 pb-10 pt-20 relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-left">
            {/* Avatar with Upload */}
            <div className="relative group shrink-0">
              {photoSrc ? (
                <img
                  src={photoSrc}
                  alt={user?.full_name}
                  className="w-32 h-32 rounded-3xl object-cover border-4 border-[#FAF7F2] shadow-lg bg-white"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="w-32 h-32 rounded-3xl bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center text-white text-5xl font-black shadow-lg border-4 border-[#FAF7F2]"
                style={{ display: photoSrc ? "none" : "flex" }}
              >
                {user?.full_name?.[0]?.toUpperCase() || "?"}
              </div>

              {/* Camera overlay */}
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 rounded-3xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer border-4 border-transparent"
              >
                {uploading ? (
                  <Loader2 size={32} className="text-white animate-spin" />
                ) : (
                  <Camera size={32} className="text-white" />
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handlePhotoSelect}
                className="hidden"
              />

              {/* Remove photo button */}
              {photoSrc && !uploading && (
                <button
                  onClick={handleRemovePhoto}
                  className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-100 hover:scale-110 shadow-sm border border-red-200"
                  title="Remove photo"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            <div className="flex-1 mt-2">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 mb-2">
                <h1 className="text-4xl font-black text-amber-950 tracking-tight">
                  {user?.full_name}
                </h1>
                <button
                  onClick={() => setEditing(!editing)}
                  className="p-2 rounded-xl text-amber-900/40 hover:text-amber-700 hover:bg-amber-100 transition-all mt-1 sm:mt-0"
                >
                  <Edit3 size={20} />
                </button>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8 text-amber-900/70 font-medium mt-2">
                <p className="flex items-center gap-2 text-base">
                  <Mail size={18} className="text-amber-500" /> {user?.email}
                </p>
                {user?.city && (
                  <p className="flex items-center gap-2 text-base">
                    <MapPin size={18} className="text-amber-500" /> {user.city}, {user.country}
                  </p>
                )}
              </div>

              {/* Upload status message */}
              {uploadMsg && (
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mt-4 text-sm font-bold shadow-sm ${uploadMsg.includes("failed") || uploadMsg.includes("Please") || uploadMsg.includes("must") ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"}`}
                >
                  {uploadMsg.includes("failed") ||
                  uploadMsg.includes("Please") ||
                  uploadMsg.includes("must") ? null : (
                    <CheckCircle size={16} />
                  )}
                  {uploadMsg}
                </div>
              )}
            </div>
          </div>

          {editing && (
            <div className="px-8 sm:px-10 pb-10 border-t border-amber-900/10 pt-8 bg-white/40 animate-fadeInUp">
              <h3 className="text-xl font-bold text-amber-950 mb-6">Edit Profile Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-amber-900/60 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    className="input-glass w-full font-medium text-amber-950"
                    value={form.full_name}
                    onChange={set("full_name")}
                    style={{ height: "56px", borderRadius: "16px", padding: "0 20px", border: "1px solid rgba(120,90,60,0.12)", fontSize: "16px", outline: "none", backgroundColor: "rgba(255,255,255,0.7)" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-amber-900/60 uppercase tracking-wider mb-2">
                    Phone
                  </label>
                  <input
                    className="input-glass w-full font-medium text-amber-950"
                    value={form.phone}
                    onChange={set("phone")}
                    style={{ height: "56px", borderRadius: "16px", padding: "0 20px", border: "1px solid rgba(120,90,60,0.12)", fontSize: "16px", outline: "none", backgroundColor: "rgba(255,255,255,0.7)" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-amber-900/60 uppercase tracking-wider mb-2">
                    City
                  </label>
                  <input
                    className="input-glass w-full font-medium text-amber-950"
                    value={form.city}
                    onChange={set("city")}
                    style={{ height: "56px", borderRadius: "16px", padding: "0 20px", border: "1px solid rgba(120,90,60,0.12)", fontSize: "16px", outline: "none", backgroundColor: "rgba(255,255,255,0.7)" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-amber-900/60 uppercase tracking-wider mb-2">
                    Country
                  </label>
                  <input
                    className="input-glass w-full font-medium text-amber-950"
                    value={form.country}
                    onChange={set("country")}
                    style={{ height: "56px", borderRadius: "16px", padding: "0 20px", border: "1px solid rgba(120,90,60,0.12)", fontSize: "16px", outline: "none", backgroundColor: "rgba(255,255,255,0.7)" }}
                  />
                </div>
              </div>
              <div className="mb-8">
                <label className="block text-sm font-bold text-amber-900/60 uppercase tracking-wider mb-2">
                  About
                </label>
                <textarea
                  className="input-glass w-full font-medium text-amber-950"
                  rows={3}
                  value={form.additional_info}
                  onChange={set("additional_info")}
                  style={{ borderRadius: "16px", padding: "20px", border: "1px solid rgba(120,90,60,0.12)", fontSize: "16px", outline: "none", backgroundColor: "rgba(255,255,255,0.7)", resize: "none" }}
                />
              </div>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setEditing(false)}
                  className="btn-secondary"
                  style={{ height: "56px", borderRadius: "16px", padding: "0 32px", fontSize: "16px", fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex items-center justify-center gap-2"
                  style={{ height: "56px", borderRadius: "16px", padding: "0 32px", fontSize: "16px", fontWeight: 700 }}
                >
                  {saving ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Save size={20} />
                  )}{" "}
                  Save Profile
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {stats.map((s, i) => (
            <div
              key={i}
              className="glass shadow-soft hover:shadow-lg transition-all duration-300 animate-fadeInUp flex flex-col"
              style={{ borderRadius: "24px", border: "1px solid rgba(120,90,60,0.08)", animationDelay: `${i * 0.1}s`, padding: "24px" }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-md shrink-0`}
                >
                  {s.icon}
                </div>
                <p className="text-xs font-bold text-amber-900/60 uppercase tracking-wider leading-tight">{s.label}</p>
              </div>
              <p className="text-3xl font-black text-amber-950 mt-auto">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Trips Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass shadow-soft" style={{ borderRadius: "32px", border: "1px solid rgba(120,90,60,0.08)", padding: "32px" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-amber-950 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600"><Plane size={16} /></div>
                Upcoming Trips
              </h2>
            </div>
            
            {trips.length > 0 ? (
              <div className="space-y-4">
                {trips.map((t) => (
                  <div
                    key={t.id}
                    className="glass rounded-2xl p-5 flex items-center justify-between hover:bg-white/60 transition-colors border border-amber-900/5 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-inner">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <h3 className="text-amber-950 font-bold text-lg leading-tight mb-1">{t.title}</h3>
                        <p className="text-amber-900/60 font-medium text-sm">
                          {new Date(t.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/trips/${t.id}/view`}
                      className="w-10 h-10 rounded-xl bg-white text-amber-900/40 hover:text-amber-700 flex items-center justify-center shadow-sm border border-amber-900/10 group-hover:bg-amber-50 group-hover:border-amber-200 transition-all shrink-0"
                      title="View Trip"
                    >
                      <Eye size={18} />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-12 border-2 border-dashed border-amber-900/10 rounded-3xl bg-white/30">
                <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                  <Plane size={24} className="text-amber-400" />
                </div>
                <p className="text-amber-900/60 font-medium mb-4">No upcoming trips planned</p>
                <Link
                  to="/trips/new"
                  className="btn-primary inline-flex items-center gap-2"
                  style={{ height: "48px", borderRadius: "14px", padding: "0 24px", fontSize: "14px", fontWeight: 600 }}
                >
                  <Plus size={18} /> Plan a Trip
                </Link>
              </div>
            )}
          </div>

          <div className="glass shadow-soft" style={{ borderRadius: "32px", border: "1px solid rgba(120,90,60,0.08)", padding: "32px" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-amber-950 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600"><Globe size={16} /></div>
                Previous Trips
              </h2>
            </div>
            
            {prevTrips.length > 0 ? (
              <div className="space-y-4">
                {prevTrips.map((t) => (
                  <div
                    key={t.id}
                    className="glass rounded-2xl p-5 flex items-center justify-between hover:bg-white/60 transition-colors border border-amber-900/5 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-amber-600 shrink-0 shadow-inner">
                        <CheckCircle size={20} />
                      </div>
                      <div>
                        <h3 className="text-amber-950 font-bold text-lg leading-tight mb-1">{t.title}</h3>
                        <p className="text-amber-900/60 font-medium text-sm">
                          {new Date(t.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/trips/${t.id}/view`}
                      className="w-10 h-10 rounded-xl bg-white text-amber-900/40 hover:text-amber-700 flex items-center justify-center shadow-sm border border-amber-900/10 group-hover:bg-amber-50 group-hover:border-amber-200 transition-all shrink-0"
                      title="View Trip"
                    >
                      <Eye size={18} />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-12 border-2 border-dashed border-amber-900/10 rounded-3xl bg-white/30">
                <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                  <Globe size={24} className="text-amber-400" />
                </div>
                <p className="text-amber-900/60 font-medium mb-1">No completed trips yet</p>
                <p className="text-amber-900/40 text-sm">Your travel history will appear here once you finish a trip.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
