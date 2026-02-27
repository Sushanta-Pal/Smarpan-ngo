import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function VolunteerLogin({ onLogin }) {
  const [rollNumber, setRollNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 1. Query the database to find a volunteer with this exact roll number
    const { data, error: fetchError } = await supabase
      .from('volunteers_registry')
      .select('id, name, position')
      .ilike('roll_number', rollNumber.trim()) // ilike makes it case-insensitive
      .single();

    if (fetchError || !data) {
      setError('Invalid Roll Number. Please check your spelling and try again.');
      setLoading(false);
      return;
    }

    // 2. If found, save them to the app state and browser storage
    const userData = { id: data.id, name: data.name, position: data.position };
    localStorage.setItem('samarpan_user', JSON.stringify(userData));
    onLogin(userData); // Update App.jsx state
    
    // 3. Send them to the Routine page
    navigate('/routine');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-indigo-900">Volunteer Portal</h2>
          <p className="text-gray-600 mt-2">Enter your Roll Number to access your shifts.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Roll Number</label>
            <input
              type="text"
              placeholder="e.g. 23/IT/020"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none uppercase"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-70"
          >
            {loading ? 'Verifying...' : 'Login to Portal'}
          </button>
        </form>
      </div>
    </div>
  );
}