import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import TrackingRoute from "./Tracking/Tracking.jsx"
import TrackingResults from "./Tracking/TrackingResults.jsx"
import './App.css'
import AdminTrackingPage from './AdminDashboard/AdminDashbaord.jsx'
import AdminLogin from './AdminDashboard/AdminLogin.jsx'
import ProtectedRoute from './AdminDashboard/Protected.jsx'; // Import the new component

function App() {
  return (
    <Routes>
      <Route path='/' element={<Navigate to="/tracking" replace />} />
      <Route path='/tracking' element={<TrackingRoute />} />
      <Route path='/result' element={<TrackingResults />} />
      <Route path='/adminlogin' element={<AdminLogin />} />
      
      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path='/admin' element={<AdminTrackingPage />} />
        {/* Add other admin routes here */}
      </Route>
    </Routes>
  )
}

export default App