import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import BackButton from './components/BackButton';
import Home from './pages/Home';
import Blog from './pages/Blog';
import CheckIn from './pages/CheckIn';
import Stats from './pages/Stats';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyBookings from './pages/MyBookings';
import BookingPage from './pages/BookingPage';
import Profile from './pages/Profile';
import SearchResults from './pages/SearchResults';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';
import RentalCars from './pages/RentalCars';
import RentalDetails from './pages/RentalDetails';
import Inspiration from './pages/Inspiration';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user && user.role === 'admin' ? children : <Navigate to="/" />;
};

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <div className="container">
            <BackButton />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/checkin" element={<CheckIn />} />
              <Route path="/stats" element={<AdminRoute><Stats /></AdminRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
              <Route path="/bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/book" element={<PrivateRoute><BookingPage /></PrivateRoute>} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/hotels/:id" element={<HotelDetails />} />
              <Route path="/rentals" element={<RentalCars />} />
              <Route path="/rentals/:id" element={<RentalDetails />} />
              <Route path="/inspiration/:category" element={<Inspiration />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
