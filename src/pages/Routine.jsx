// src/pages/Routine.jsx
import React, { useState, useEffect } from 'react';
import { fetchDailyRoutine, markAttendance, requestSwap } from '../lib/supabase';

const Routine = ({ loggedInUserId }) => {
  const [routine, setRoutine] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Use today's date formatted as YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  const loadRoutine = async () => {
    setLoading(true);
    const data = await fetchDailyRoutine(today);
    setRoutine(data);
    setLoading(false);
  };

  useEffect(() => {
    loadRoutine();
  }, []);

  const handleCheckIn = async (instanceId) => {
    try {
      await markAttendance(instanceId, 'present');
      alert("Successfully checked in!");
      loadRoutine(); // Refresh UI
    } catch (error) {
      alert("Failed to check in. Please try again.");
    }
  };

  const handleSwapRequest = async (instanceId) => {
    if (window.confirm("Are you sure you want to drop this shift?")) {
      try {
        await requestSwap(instanceId, loggedInUserId);
        alert("Swap requested. Your shift is now in the marketplace.");
        loadRoutine(); // Refresh UI
      } catch (error) {
        alert("Failed to request swap.");
      }
    }
  };

  if (loading) return <div className="text-center py-20 text-xl font-bold">Loading Today's Routine...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-indigo-900 mb-2">Daily Routine</h1>
          <p className="text-gray-600 text-lg">Schedule for {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {routine.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-gray-500">No shifts scheduled for today.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routine.map((shift) => (
            <div key={shift.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col h-full">
              
              <div className="flex justify-between items-start mb-4">
                <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {shift.location}
                </span>
                
                {/* Attendance Badge */}
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  shift.attendance_status === 'present' ? 'bg-green-100 text-green-800' :
                  shift.attendance_status === 'absent' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {shift.attendance_status.toUpperCase()}
                </span>
              </div>

              <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-900">{shift.assigned_user?.name}</h3>
                <p className="text-gray-500 mb-4">{shift.assigned_user?.position}</p>
                
                {shift.status === 'swap_requested' && (
                  <div className="bg-orange-50 border-l-4 border-orange-400 p-3 mb-4">
                    <p className="text-sm text-orange-700 font-medium">Looking for a replacement</p>
                  </div>
                )}
              </div>

              {/* Action Buttons: Only show if this shift belongs to the logged-in user */}
              {shift.assigned_user_id === loggedInUserId && shift.attendance_status === 'pending' && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => handleCheckIn(shift.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Check In
                  </button>
                  
                  {shift.status === 'scheduled' && (
                    <button 
                      onClick={() => handleSwapRequest(shift.id)}
                      className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Drop Shift
                    </button>
                  )}
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Routine;