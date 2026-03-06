import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Wand2 } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import AdminForm from '../../components/common/AdminForm';
import { fetchDailyRoutine, fetchData, upsertData, deleteData, generateInstancesFromTemplates } from '../../lib/supabase';

const ManageRoutines = () => {
  // Get today's date string in YYYY-MM-DD format
  const todayString = new Date().toISOString().split('T')[0];
  
  const [selectedDate, setSelectedDate] = useState(todayString);
  const [routines, setRoutines] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    id: null, location: '', assigned_volunteer_id: '', status: 'scheduled', attendance_status: 'pending', actual_date: ''
  });

  useEffect(() => {
    loadRoutines();
    loadVolunteers();
  }, [selectedDate]);

  const loadVolunteers = async () => {
    const data = await fetchData('volunteers_registry', 'name', true);
    setVolunteers(data || []);
  };

  const loadRoutines = async () => {
    setLoading(true);
    try {
      // 🚀 AUTOMATIC GENERATION LOGIC:
      // If the selected date is today, automatically attempt to generate shifts from the master template.
      // The backend logic already prevents duplicates, so this is safe to run on every load.
      if (selectedDate === todayString) {
        try {
          await generateInstancesFromTemplates(selectedDate);
        } catch (genError) {
          console.error("Silent auto-generation failed:", genError);
        }
      }

      // Fetch the routines (which will now include any freshly auto-generated ones)
      const data = await fetchDailyRoutine(selectedDate);
      setRoutines(data || []);
    } catch (error) {
      console.error("Failed to load routines:", error);
    } finally {
      setLoading(false);
    }
  };

  // Keep the manual button for future/past dates
  const handleGenerate = async () => {
    if(window.confirm(`Generate standard shifts for ${selectedDate} based on the Master Schedule?`)) {
      setIsGenerating(true);
      try {
        const count = await generateInstancesFromTemplates(selectedDate);
        if (count === -1) {
          alert("Shifts for this day have already been fully generated!");
        } else if (count === 0) {
          alert("No Master Templates found for this day of the week.");
        } else {
          alert(`Successfully generated ${count} new shifts!`);
        }
        loadRoutines();
      } catch (error) {
        alert("Error generating shifts: " + error.message);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const dataToSave = { ...formData };
      if (!dataToSave.id) {
        delete dataToSave.id;
        dataToSave.actual_date = selectedDate; // Ensure new shifts apply to the selected date
      }
      
      // If "Unassigned" is selected, set to null
      if (dataToSave.assigned_volunteer_id === '') {
        dataToSave.assigned_volunteer_id = null;
      }
      
      // This saves the admin's manual changes for this specific day
      await upsertData('routine_instances', dataToSave);
      setIsFormOpen(false);
      loadRoutines();
    } catch (error) {
      alert("Error saving shift: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete this specific shift for the day? \n\nNote: If this is a Master Template shift for today, deleting it will cause it to auto-generate again on refresh. To cancel a shift, EDIT it and change status to "Cancelled".')) {
      try {
        await deleteData('routine_instances', id);
        loadRoutines();
      } catch (error) {
        alert("Error deleting shift: " + error.message);
      }
    }
  };

  const openForm = (routine = null) => {
    if (routine) {
      setFormData({
        id: routine.id,
        location: routine.location,
        assigned_volunteer_id: routine.assigned_volunteer_id || '',
        status: routine.status,
        attendance_status: routine.attendance_status,
        actual_date: routine.actual_date
      });
    } else {
      setFormData({ 
        id: null, location: '', assigned_volunteer_id: '', status: 'scheduled', attendance_status: 'pending', actual_date: selectedDate 
      });
    }
    setIsFormOpen(true);
  };

  const columns = [
    { key: 'location', label: 'Location/Task', render: (val) => <span className="font-bold text-gray-800">{val}</span> },
    { 
      key: 'assigned_user', 
      label: 'Volunteer',
      render: (user) => user ? (
        <div>
          <p className="font-bold text-indigo-700">{user.name}</p>
          <p className="text-xs text-gray-500">{user.position}</p>
        </div>
      ) : <span className="text-red-500 font-bold bg-red-50 px-2 py-1 rounded">Unassigned</span>
    },
    { 
      key: 'status', 
      label: 'Shift Status',
      render: (status) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          status === 'swap_requested' ? 'bg-orange-100 text-orange-700' :
          status === 'completed' ? 'bg-green-100 text-green-700' : 
          status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
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
          status === 'absent' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {status ? status.toUpperCase() : 'PENDING'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Daily Shifts</h1>
          <p className="text-gray-500 text-sm mt-1">Manage the ground reality. Changes here only affect this specific day.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
            <CalendarIcon className="w-5 h-5 text-indigo-600" />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none outline-none font-medium text-gray-700 cursor-pointer"
            />
          </div>
          
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold transition-colors disabled:opacity-70"
            title="Use this to manually generate future dates"
          >
            <Wand2 className="w-4 h-4" />
            {isGenerating ? 'Generating...' : 'Auto-Generate Shifts'}
          </button>
        </div>
      </div>

      <DataTable 
        title={`Shifts for ${new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`}
        columns={columns} data={routines} isLoading={loading}
        onEdit={openForm} onDelete={handleDelete} onAdd={() => openForm()}
      />

      <AdminForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} title={formData.id ? "Edit Daily Shift" : "Add Custom Shift"} isLoading={isSaving}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Location / Task</label>
            <input type="text" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Assigned Volunteer</label>
            <select value={formData.assigned_volunteer_id} onChange={e => setFormData({...formData, assigned_volunteer_id: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">-- UNASSIGNED (Leave Blank) --</option>
              {volunteers.map(v => (
                <option key={v.id} value={v.id}>{v.name} ({v.position})</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Changing this only reassigns them for {selectedDate}.</p>
          </div>
          
          {formData.id && (
            <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-2">
              <div>
                <label className="block text-sm font-semibold mb-1">Shift Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-2 border rounded-lg">
                  <option value="scheduled">Scheduled</option>
                  <option value="swap_requested">Swap Requested</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Attendance</label>
                <select value={formData.attendance_status} onChange={e => setFormData({...formData, attendance_status: e.target.value})} className="w-full p-2 border rounded-lg">
                  <option value="pending">Pending</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </AdminForm>
    </div>
  );
};

export default ManageRoutines;