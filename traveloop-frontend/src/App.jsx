import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PageTransition from './components/common/PageTransition';
import PrivateRoute from './routes/PrivateRoute';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Landing from './pages/Landing/Landing';
import CreateTrip from './pages/Trips/CreateTrip';
import TripList from './pages/Trips/TripList';
import ItineraryBuilder from './pages/Itinerary/ItineraryBuilder';
import ItineraryView from './pages/Itinerary/ItineraryView';
import CitySearch from './pages/Search/CitySearch';
import ExpenseInvoice from './pages/Budget/ExpenseInvoice';
import PackingChecklist from './pages/Checklist/PackingChecklist';
import TripNotes from './pages/Notes/TripNotes';
import CommunityTab from './pages/Community/CommunityTab';
import UserProfile from './pages/Profile/UserProfile';
import PublicItinerary from './pages/Share/PublicItinerary';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ForgotPassword from './pages/Auth/ForgotPassword';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 main-content">
              <PageTransition>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/share/:token" element={<PublicItinerary />} />

                  {/* Protected Routes */}
                  <Route path="/" element={<PrivateRoute><Landing /></PrivateRoute>} />
                  <Route path="/trips" element={<PrivateRoute><TripList /></PrivateRoute>} />
                  <Route path="/trips/new" element={<PrivateRoute><CreateTrip /></PrivateRoute>} />
                  <Route path="/trips/:id/builder" element={<PrivateRoute><ItineraryBuilder /></PrivateRoute>} />
                  <Route path="/trips/:id/view" element={<PrivateRoute><ItineraryView /></PrivateRoute>} />
                  <Route path="/trips/:id/budget" element={<PrivateRoute><ExpenseInvoice /></PrivateRoute>} />
                  <Route path="/trips/:id/checklist" element={<PrivateRoute><PackingChecklist /></PrivateRoute>} />
                  <Route path="/trips/:id/notes" element={<PrivateRoute><TripNotes /></PrivateRoute>} />
                  <Route path="/search/cities" element={<PrivateRoute><CitySearch /></PrivateRoute>} />
                  <Route path="/search/activities" element={<PrivateRoute><CitySearch /></PrivateRoute>} />
                  <Route path="/community" element={<PrivateRoute><CommunityTab /></PrivateRoute>} />
                  <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
                  <Route path="/admin" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
                </Routes>
              </PageTransition>
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
