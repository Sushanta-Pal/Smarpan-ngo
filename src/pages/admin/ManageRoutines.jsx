import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import { fetchDailyRoutine } from '../../lib/supabase';

const ManageRoutines = () => {
  // Default to today's date (YYYY-MM-DD format)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoutines();
  }, [selectedDate]);

  const loadRoutines = async () => {
    setLoading(true);
    try {
      const data = await fetchDailyRoutine(selectedDate);
      setRoutines(data || []);
    } catch (error) {
      console.error("Failed to load routines:", error);
    } finally {
      setLoading(false);
    }
  };

  // Define how the DataTable should show the columns
  const columns = [
    { key: 'location', label: 'Location/Task' },
    { 
      key: 'assigned_user', 
      label: 'Volunteer',
      render: (user) => user ? (
        <div>
          <p className="font-bold">{user.name}</p>
          <p className="text-xs text-gray-500">{user.position} | {user.whatsapp_number}</p>
        </div>
      ) : <span className="text-red-500 font-medium">Unassigned</span>
    },
    { 
      key: 'status', 
      label: 'Shift Status',
      render: (status) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          status === 'swap_requested' ? 'bg-orange-100 text-orange-700' :
          status === 'completed' ? 'bg-green-100 text-green-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {status ? status.replace('_', ' ').toUpperCase() : 'SCHEDULED'}
        </span>
      )
    },
    { 
      key: 'attendance_status', 
      label: 'Attendance',
      render: (status) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          status === 'present' ? 'bg-green-100 text-green-700' :
          status === 'absent' ? 'bg-red-100 text-red-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {status ? status.toUpperCase() : 'PENDING'}
        </span>
      )
    }
  ];

  const handleEdit = (row) => {
    alert(`Editing routine ID: ${row.id} - Full edit modal coming soon!`);
  };

  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to remove this routine instance?')) {
      alert(`Deleted routine ID: ${id}`);
    }
  };

  const handleAdd = () => {
    alert("Add new routine modal coming soon!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Routine Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage daily volunteer shifts, attendance, and swaps.</p>
        </div>
        
        {/* Date Picker */}
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
          <CalendarIcon className="w-5 h-5 text-indigo-600" />
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent border-none outline-none font-medium text-gray-700 cursor-pointer"
          />
        </div>
      </div>

      <DataTable 
        title={`Routines for ${new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`}
        columns={columns}
        data={routines}
        isLoading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />
    </div>
  );
};

export default ManageRoutines;