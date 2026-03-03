import React, { useState, useEffect } from 'react';
import DataTable from '../../components/common/DataTable';
import AdminForm from '../../components/common/AdminForm';
import { fetchData, upsertData, deleteData } from '../../lib/supabase';

export default function ManageVolunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: null, name: '', department: '', roll_number: '', whatsapp_number: '', position: 'Volunteer', free_days: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchData('volunteers_registry', 'name', true);
      setVolunteers(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const dataToSave = { ...formData };
      if (!dataToSave.id) delete dataToSave.id; // Let Supabase generate UUID
      
      await upsertData('volunteers_registry', dataToSave);
      setIsFormOpen(false);
      loadData();
    } catch (error) {
      alert("Error saving volunteer: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this volunteer? This might affect their routines.')) {
      try {
        await deleteData('volunteers_registry', id);
        loadData();
      } catch (error) {
        alert("Error deleting: " + error.message);
      }
    }
  };

  const openForm = (volunteer = null) => {
    if (volunteer) {
      setFormData(volunteer);
    } else {
      setFormData({ id: null, name: '', department: '', roll_number: '', whatsapp_number: '', position: 'Volunteer', free_days: '' });
    }
    setIsFormOpen(true);
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'roll_number', label: 'Roll Number' },
    { key: 'department', label: 'Department' },
    { key: 'position', label: 'Position', render: (val) => <span className="font-bold text-indigo-600">{val}</span> },
    { key: 'total_attendance', label: 'Attendance' }
  ];

  return (
    <div className="space-y-6">
      <DataTable 
        title="Volunteer Registry" columns={columns} data={volunteers} isLoading={loading}
        onAdd={() => openForm()} onEdit={openForm} onDelete={handleDelete}
      />

      <AdminForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} title={formData.id ? "Edit Volunteer" : "Add Volunteer"} isLoading={isSaving}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-1">Full Name</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Roll Number</label>
            <input type="text" required value={formData.roll_number} onChange={e => setFormData({...formData, roll_number: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 uppercase" placeholder="23/IT/020" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Department</label>
            <input type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">WhatsApp No.</label>
            <input type="text" value={formData.whatsapp_number} onChange={e => setFormData({...formData, whatsapp_number: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Position</label>
            <input type="text" required value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-1">Free Days (e.g. Monday, Wednesday)</label>
            <input type="text" value={formData.free_days} onChange={e => setFormData({...formData, free_days: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
      </AdminForm>
    </div>
  );
}