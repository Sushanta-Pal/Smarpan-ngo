import React, { useState, useEffect } from 'react';
import { fetchOpenSwaps, acceptSwapRequest } from '../lib/supabase';

const Marketplace = ({ loggedInUserId }) => {
  const [openSwaps, setOpenSwaps] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSwaps = async () => {
    setLoading(true);
    const data = await fetchOpenSwaps();
    setOpenSwaps(data);
    setLoading(false);
  };

  useEffect(() => {
    loadSwaps();
  }, []);

  const handleClaimShift = async (swapId, instanceId) => {
    if (window.confirm("Are you sure you want to cover this shift?")) {
      try {
        await acceptSwapRequest(swapId, instanceId, loggedInUserId);
        alert("🎉 Shift successfully claimed! Thank you for stepping up.");
        loadSwaps(); // Refresh the board so the claimed shift disappears
      } catch (error) {
        alert("Failed to claim shift. Someone else might have taken it already.");
        console.error(error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-xl font-bold text-gray-500 animate-pulse">
          Loading the Marketplace...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-4xl font-extrabold text-indigo-900 mb-2">Shift Marketplace</h1>
        <p className="text-gray-600 text-lg">
          Help out your fellow volunteers by picking up their open shifts!
        </p>
      </div>

      {openSwaps.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <span className="text-5xl mb-4 block">🙌</span>
          <p className="text-gray-800 font-bold text-xl mb-1">All shifts are covered right now!</p>
          <p className="text-gray-500">Check back later if someone drops a shift.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {openSwaps.map((swap) => (
            <div 
              key={swap.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-orange-500 p-6 flex flex-col sm:flex-row justify-between items-center hover:shadow-md transition-all"
            >
              
              <div className="flex-grow w-full sm:w-auto mb-5 sm:mb-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {swap.instance?.location}
                  </span>
                  <span className="text-sm font-semibold text-gray-500">
                    Date: {swap.instance?.actual_date}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Covering for {swap.requester?.name}
                </h3>
                <p className="text-gray-600 font-medium text-sm mt-1">
                  Role: {swap.requester?.position}
                </p>
              </div>

              {/* Prevent the person who dropped the shift from accidentally claiming their own shift back */}
              {swap.requester?.id !== loggedInUserId ? (
                <button 
                  onClick={() => handleClaimShift(swap.id, swap.instance?.id)}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>🙋‍♂️</span> I'll Cover This!
                </button>
              ) : (
                <div className="w-full sm:w-auto text-center px-6 py-3 bg-gray-100 text-gray-500 rounded-lg font-bold border border-gray-200">
                  Your dropped shift
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;