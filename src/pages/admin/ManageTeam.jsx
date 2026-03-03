import React, { useState, useEffect } from 'react';
import DataTable from '../../components/common/DataTable';
import AdminForm from '../../components/common/AdminForm';
import MediaManager from '../../components/common/MediaManager';
import { fetchData, upsertData, deleteData, supabase } from '../../lib/supabase';

export default function ManageTeam() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    id: null, name: '', position: '', linkedin_url: '', image_path: '', is_active: true, order_position: 100
  });

  const loadRecords = async () => {
    setLoading(true);
    try {
      const records = await fetchData('team_members', 'order_position', true);
      setData(records || []);
    } catch (err) {
      alert("Error loading team: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRecords(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let finalImageUrl = formData.image_path;

      // 1. Upload Image if a new one is selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('team-members')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from('team-members').getPublicUrl(filePath);
        finalImageUrl = publicUrlData.publicUrl;
      }

      // 2. Save to Database
      const dataToSave = { ...formData, image_path: finalImageUrl };
      if (!dataToSave.id) delete dataToSave.id; // Let Postgres auto-generate ID

      await upsertData('team_members', dataToSave);
      setIsFormOpen(false);
      loadRecords();
    } catch (error) {
      alert("Error saving: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this team member?')) {
      await deleteData('team_members', id);
      loadRecords();
    }
  };

  const openForm = (record = null) => {
    setSelectedFile(null);
    if (record) setFormData(record);
    else setFormData({ id: null, name: '', position: '', linkedin_url: '', image_path: '', is_active: true, order_position: 100 });
    setIsFormOpen(true);
  };

  const columns = [
    { key: 'image_path', label: 'Photo', render: (val) => <img src={val || 'https://via.placeholder.com/50'} className="w-10 h-10 object-cover rounded-full" alt="Team" /> },
    { key: 'name', label: 'Name', render: (val) => <span className="font-bold">{val}</span> },
    { key: 'position', label: 'Position' },
    { key: 'is_active', label: 'Status', render: (val) => <span className={`px-2 py-1 rounded text-xs font-bold ${val ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{val ? 'Active' : 'Inactive'}</span> }
  ];

  return (
    <div className="space-y-6">
      <DataTable title="Team Directory" columns={columns} data={data} isLoading={loading} onAdd={() => openForm()} onEdit={openForm} onDelete={handleDelete} />

      <AdminForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} title={formData.id ? "Edit Team Member" : "Add Team Member"} isLoading={isSaving}>
        <MediaManager 
          onUpload={setSelectedFile} 
          isUploading={isSaving && selectedFile} 
          currentImage={selectedFile ? URL.createObjectURL(selectedFile) : formData.image_path} 
        />
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-1">Full Name</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Position / Role</label>
            <input type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Display Order (Lower = First)</label>
            <input type="number" value={formData.order_position} onChange={e => setFormData({...formData, order_position: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-1">LinkedIn URL</label>
            <input type="url" value={formData.linkedin_url} onChange={e => setFormData({...formData, linkedin_url: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-4 h-4 text-indigo-600 rounded" />
            <label className="text-sm font-semibold">Active Member (Show on website)</label>
          </div>
        </div>
      </AdminForm>
    </div>
  );
}