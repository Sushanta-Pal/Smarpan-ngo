import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCurrentDbDate, fetchDailyRoutine, markAttendance, requestSwap } from '../lib/supabase';

const Routine = ({ loggedInUserId }) => {
  const queryClient = useQueryClient();

  // 1. Fetch the exact Database Date (IST)
  const { data: dbDate, isLoading: loadingDate } = useQuery({
    queryKey: ['dbDate'],
    queryFn: fetchCurrentDbDate,
  });

  // 2. Fetch the Routine ONLY after we have the dbDate
  const { data: routine = [], isLoading: loadingRoutine } = useQuery({
    queryKey: ['routine', dbDate],
    queryFn: () => fetchDailyRoutine(dbDate),
    enabled: !!dbDate, // Won't run until dbDate exists
  });

  // 3. Mutation for Checking In
  const checkInMutation = useMutation({
    mutationFn: ({ instanceId, volunteerId }) => markAttendance(instanceId, 'present', volunteerId),
    onSuccess: () => {
      alert("Successfully checked in! +1 Attendance recorded.");
      // Instantly refresh the routine UI
      queryClient.invalidateQueries({ queryKey: ['routine', dbDate] }); 
    },
    onError: () => alert("Failed to check in. Please try again.")
  });

  // 4. Mutation for Dropping a Shift
  const dropShiftMutation = useMutation({
    mutationFn: ({ instanceId }) => requestSwap(instanceId, loggedInUserId),
    onSuccess: () => {
      alert("Shift dropped! It is now in the Marketplace.");
      queryClient.invalidateQueries({ queryKey: ['routine', dbDate] });
    },
    onError: () => alert("Failed to drop shift.")
  });

  if (loadingDate || loadingRoutine) {
    return <div className="text-center py-20 text-xl font-bold animate-pulse">Loading Routine...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-indigo-900">Daily Routine</h1>
        <p className="text-gray-600 text-lg">Official Schedule for {dbDate}</p>
      </div>

      {routine.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-gray-500 font-semibold">No shifts scheduled for today.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routine.map((shift) => (
            <div key={shift.id} className="bg-white rounded-xl shadow border border-gray-100 p-6 flex flex-col">
              
              <div className="flex justify-between items-start mb-4">
                <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {shift.location}
                </span>
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

              {/* Action Buttons */}
              {shift.assigned_volunteer_id === loggedInUserId && shift.attendance_status === 'pending' && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => checkInMutation.mutate({ instanceId: shift.id, volunteerId: shift.assigned_volunteer_id })}
                    disabled={checkInMutation.isPending}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg"
                  >
                    {checkInMutation.isPending ? 'Saving...' : 'Check In'}
                  </button>
                  
                  {shift.status === 'scheduled' && (
                    <button 
                      onClick={() => {
                        if (window.confirm("Are you sure you want to drop this shift?")) {
                          dropShiftMutation.mutate({ instanceId: shift.id });
                        }
                      }}
                      disabled={dropShiftMutation.isPending}
                      className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-semibold py-2 rounded-lg"
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