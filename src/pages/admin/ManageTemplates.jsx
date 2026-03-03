import React, { useState, useEffect } from 'react';
import DataTable from '../../components/common/DataTable';
import AdminForm from '../../components/common/AdminForm';
import { fetchData, upsertData, deleteData, supabase } from '../../lib/supabase';

export default function ManageTemplates() {
  const [templates, setTemplates] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null, day_of_week: 'Monday', location: '', role_type: '', volunteer_id: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch templates WITH the joined volunteer name
      const { data } = await supabase
        .from('routine_templates')
        .select(`*, volunteer:volunteers_registry(name)`);
      
      const volData = await fetchData('volunteers_registry', 'name', true);
      
      setTemplates(data || []);
      setVolunteers(volData || []);
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
      if (!dataToSave.id) delete dataToSave.id;
      
      await upsertData('routine_templates', dataToSave);
      setIsFormOpen(false);
      loadData();
    } catch (error) {
      alert("Error saving template: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this template? Future shifts will not be generated for this.')) {
      await deleteData('routine_templates', id);
      loadData();
    }
  };

  const openForm = (template = null) => {
    if (template) {
      setFormData({
        id: template.id, day_of_week: template.day_of_week, location: template.location,
        role_type: template.role_type, volunteer_id: template.volunteer_id || ''
      });
    } else {
      setFormData({ id: null, day_of_week: 'Monday', location: '', role_type: '', volunteer_id: '' });
    }
    setIsFormOpen(true);
  };

  const columns = [
    { key: 'day_of_week', label: 'Day', render: val => <span className="font-bold">{val}</span> },
    { key: 'location', label: 'Location' },
    { key: 'role_type', label: 'Role' },
    { key: 'volunteer', label: 'Assigned To', render: (_, row) => row.volunteer?.name || <span className="text-red-500">Unassigned</span> }
  ];

  return (
    <div className="space-y-6">
      <DataTable title="Master Schedule (Templates)" columns={columns} data={templates} isLoading={loading} onAdd={() => openForm()} onEdit={openForm} onDelete={handleDelete} />

      <AdminForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} title={formData.id ? "Edit Template" : "Add Template"} isLoading={isSaving}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Day of Week</label>
            <select required value={formData.day_of_week} onChange={e => setFormData({...formData, day_of_week: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Location</label>
            <input type="text" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-2 border rounded-lg" placeholder="e.g. Main Gate" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Role Type</label>
            <input type="text" required value={formData.role_type} onChange={e => setFormData({...formData, role_type: e.target.value})} className="w-full p-2 border rounded-lg" placeholder="e.g. Traffic Control" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Assign Volunteer</label>
            <select required value={formData.volunteer_id} onChange={e => setFormData({...formData, volunteer_id: e.target.value})} className="w-full p-2 border rounded-lg">
              <option value="">-- Select Volunteer --</option>
              {volunteers.map(v => (
                <option key={v.id} value={v.id}>{v.name} ({v.roll_number})</option>
              ))}
            </select>
          </div>
        </div>
      </AdminForm>
    </div>
  );
}