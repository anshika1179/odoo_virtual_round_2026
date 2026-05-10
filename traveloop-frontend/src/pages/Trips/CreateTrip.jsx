import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  createTrip,
  searchCities,
  uploadCommunityImage,
  getPopularCities,
} from "../../services/api";
import {
  Calendar,
  MapPin,
  DollarSign,
  Plane,
  Loader2,
  Sparkles,
  Image,
  Upload,
  X,
  Map,
} from "lucide-react";
import CityPreviewMap from "../../components/maps/CityPreviewMap";

export default function CreateTrip() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    total_budget: "",
    cover_photo_url: "",
  });
  const [cities, setCities] = useState([]);
  const [citySearch, setCitySearch] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (citySearch.length > 1) {
      searchCities({ q: citySearch })
        .then((r) => setCities(r.data))
        .catch(() => {});
    }
  }, [citySearch]);

  useEffect(() => {
    getPopularCities()
      .then((r) => setSuggestions(r.data.slice(0, 6)))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.start_date || !form.end_date) {
      setError("Please fill required fields");
      return;
    }
    
    // Validations
    if (new Date(form.end_date) < new Date(form.start_date)) {
      setError("End date cannot be before start date.");
      return;
    }
    const budget = parseFloat(form.total_budget);
    if (form.total_budget && (isNaN(budget) || budget < 0)) {
      setError("Total budget cannot be negative.");
      return;
    }

    setLoading(true);
    try {
      const res = await createTrip({
        ...form,
        start_date: new Date(form.start_date).toISOString(),
        end_date: new Date(form.end_date).toISOString(),
        total_budget: budget || 0,
      });
      navigate(`/trips/${res.data.id}/builder`);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create trip");
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image (JPG, PNG, GIF, WEBP)");
      setTimeout(() => setError(""), 4000);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB");
      setTimeout(() => setError(""), 4000);
      return;
    }
    setUploadingPhoto(true);
    try {
      const res = await uploadCommunityImage(file);
      setForm({ ...form, cover_photo_url: res.data.image_url });
      setError("");
    } catch (err) {
      setError("Failed to upload photo. Please try again.");
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removePhoto = () => setForm({ ...form, cover_photo_url: "" });

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
              <Plane size={32} className="text-amber-700" /> Plan a New Trip
            </h1>
            <p className="text-amber-900/70 mt-2 text-lg">
              Fill in the details and start building your perfect itinerary
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div
              className="glass shadow-soft animate-fadeInUp"
              style={{
                borderRadius: "24px",
                padding: "40px",
                border: "1px solid rgba(120,90,60,0.08)",
              }}
            >
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-medium flex items-center gap-2">
                  <X size={16} /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-amber-950 mb-2">
                    Trip Title *
                  </label>
                  <input
                    className="input-glass w-full outline-none transition-colors"
                    placeholder="e.g., European Summer Adventure"
                    value={form.title}
                    onChange={set("title")}
                    required
                    style={{
                      height: "56px",
                      borderRadius: "16px",
                      padding: "0 20px",
                      border: "1px solid rgba(120,90,60,0.12)",
                      fontSize: "15px",
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-amber-950 mb-2">
                    Description
                  </label>
                  <textarea
                    className="input-glass w-full outline-none transition-colors"
                    rows={3}
                    placeholder="What's this trip about?"
                    value={form.description}
                    onChange={set("description")}
                    style={{
                      borderRadius: "16px",
                      padding: "20px",
                      border: "1px solid rgba(120,90,60,0.12)",
                      fontSize: "15px",
                      resize: "none",
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-amber-950 mb-2">
                    Search a Place
                  </label>
                  <div className="relative">
                    <MapPin
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-900/40"
                    />
                    <input
                      className="input-glass w-full outline-none transition-colors"
                      placeholder="Search cities..."
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      style={{
                        height: "56px",
                        borderRadius: "16px",
                        padding: "0 20px 0 44px",
                        border: "1px solid rgba(120,90,60,0.12)",
                        fontSize: "15px",
                      }}
                    />
                  </div>
                  {cities.length > 0 && citySearch && (
                    <div
                      className="mt-3 glass absolute z-10 w-full shadow-lg"
                      style={{
                        borderRadius: "16px",
                        padding: "8px",
                        maxHeight: "200px",
                        overflowY: "auto",
                        border: "1px solid rgba(120,90,60,0.08)",
                      }}
                    >
                      {cities.slice(0, 5).map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setForm({
                              ...form,
                              title: form.title || `Trip to ${c.name}`,
                            });
                            setSelectedCity(c);
                            setCitySearch("");
                            setCities([]);
                          }}
                          className="w-full text-left px-4 py-3 rounded-xl hover:bg-amber-900/5 transition-colors text-sm text-amber-950 font-medium flex items-center gap-3"
                        >
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                            <MapPin size={14} className="text-amber-700" />
                          </div>
                          <div>
                            <div>{c.name}</div>
                            <div className="text-xs text-amber-900/50">
                              {c.country}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-amber-950 mb-2 flex items-center gap-2">
                      <Calendar size={16} className="text-amber-700" /> Start
                      Date *
                    </label>
                    <input
                      type="date"
                      className="input-glass w-full outline-none transition-colors"
                      value={form.start_date}
                      onChange={set("start_date")}
                      required
                      style={{
                        height: "56px",
                        borderRadius: "16px",
                        padding: "0 20px",
                        border: "1px solid rgba(120,90,60,0.12)",
                        fontSize: "15px",
                        color: form.start_date ? "inherit" : "rgba(120,90,60,0.5)",
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-amber-950 mb-2 flex items-center gap-2">
                      <Calendar size={16} className="text-amber-700" /> End Date *
                    </label>
                    <input
                      type="date"
                      className="input-glass w-full outline-none transition-colors"
                      value={form.end_date}
                      onChange={set("end_date")}
                      required
                      style={{
                        height: "56px",
                        borderRadius: "16px",
                        padding: "0 20px",
                        border: "1px solid rgba(120,90,60,0.12)",
                        fontSize: "15px",
                        color: form.end_date ? "inherit" : "rgba(120,90,60,0.5)",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-amber-950 mb-2 flex items-center gap-2">
                    <DollarSign size={16} className="text-amber-700" /> Total
                    Budget (USD)
                  </label>
                  <input
                    type="number"
                    className="input-glass w-full outline-none transition-colors"
                    placeholder="5000"
                    value={form.total_budget}
                    onChange={set("total_budget")}
                    style={{
                      height: "56px",
                      borderRadius: "16px",
                      padding: "0 20px",
                      border: "1px solid rgba(120,90,60,0.12)",
                      fontSize: "15px",
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-amber-950 mb-2 flex items-center gap-2">
                    <Image size={16} className="text-amber-700" /> Cover Photo
                  </label>
                  {form.cover_photo_url && (
                    <div className="relative mb-4">
                      <img
                        src={form.cover_photo_url}
                        alt="Cover preview"
                        className="w-full h-48 object-cover rounded-2xl border border-amber-200"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute top-3 right-3 p-2 bg-red-500/90 text-white rounded-xl hover:bg-red-600 transition-colors shadow-lg backdrop-blur-sm"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingPhoto}
                      className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm font-semibold"
                      style={{ height: "56px", borderRadius: "16px" }}
                    >
                      <Upload size={18} />{" "}
                      {uploadingPhoto ? "Uploading..." : "Upload Photo"}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                  <input
                    className="input-glass w-full outline-none transition-colors mt-3"
                    placeholder="Or paste image URL"
                    value={form.cover_photo_url}
                    onChange={set("cover_photo_url")}
                    style={{
                      height: "48px",
                      borderRadius: "16px",
                      padding: "0 20px",
                      border: "1px solid rgba(120,90,60,0.12)",
                      fontSize: "14px",
                    }}
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full flex justify-center items-center gap-2"
                    style={{
                      height: "64px",
                      borderRadius: "20px",
                      fontSize: "18px",
                      fontWeight: 700,
                    }}
                  >
                    {loading ? (
                      <Loader2 size={24} className="animate-spin" />
                    ) : (
                      <>
                        <Plane size={24} /> Create & Build Itinerary
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Selected City Map or Suggestion Cards */}
          <div>
            {selectedCity && (
              <div
                className="glass mb-8 animate-fadeInUp"
                style={{
                  borderRadius: "24px",
                  padding: "32px",
                  border: "1px solid rgba(120,90,60,0.08)",
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold text-amber-950">
                    {selectedCity.name}
                  </h3>
                </div>
                <div style={{ height: "200px" }}>
                  <CityPreviewMap 
                    lat={selectedCity.latitude} 
                    lng={selectedCity.longitude} 
                    cityName={selectedCity.name} 
                  />
                </div>
              </div>
            )}
            <div
              className="glass"
              style={{
                borderRadius: "24px",
                padding: "32px",
                border: "1px solid rgba(120,90,60,0.08)",
                position: "sticky",
                top: "120px",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <Sparkles size={20} className="text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-amber-950">
                  Popular Destinations
                </h3>
              </div>
              <div className="space-y-4">
                {suggestions.map((s, i) => (
                  <button
                    key={s.name}
                    onClick={() => {
                      setForm({ ...form, title: `Trip to ${s.name}` });
                      setSelectedCity(s);
                    }}
                    className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-white/60 transition-all duration-300 hover:shadow-soft group text-left border border-transparent hover:border-amber-900/10"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="relative overflow-hidden rounded-xl w-16 h-16 shrink-0 shadow-sm">
                      <img
                        src={
                          s.image_url ||
                          "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200"
                        }
                        alt={s.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200";
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="text-amber-950 font-bold text-base group-hover:text-amber-700 transition-colors">
                        {s.name}
                      </h4>
                      <p className="text-amber-900/60 text-xs font-medium mt-0.5">
                        {s.country}
                      </p>
                    </div>
                  </button>
                ))}
                {suggestions.length === 0 && (
                  <div className="text-center py-10 text-amber-900/50 text-sm font-medium">
                    Loading suggestions...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
