import React, { useState, useEffect } from 'react';
import DataTable from '../../components/common/DataTable';
import AdminForm from '../../components/common/AdminForm';
import MediaManager from '../../components/common/MediaManager';
import { fetchData, upsertData, deleteData, supabase } from '../../lib/supabase';

export default function ManageEvents() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    id: null, title: '', date: '', contents: '', imageUrls: ''
  });

  // Helper for relative path preview
  const getPreviewUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/100x50';
    if (path.startsWith('http')) return path; 
    
    const cleanPath = path.replace(/^events\//, '');
    const { data } = supabase.storage.from('events').getPublicUrl(cleanPath);
    return data.publicUrl;
  };

  const loadRecords = async () => {
    setLoading(true);
    const records = await fetchData('events', 'date', false); // newest first
    setData(records || []);
    setLoading(false);
  };

  useEffect(() => { loadRecords(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let finalImagePath = formData.imageUrls;

      // 1. Upload Image & Save Relative Path
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const filePath = `covers/${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage.from('events').upload(filePath, selectedFile);
        if (uploadError) throw uploadError;
        
        finalImagePath = `events/${filePath}`;
      }

      // 2. Save Data
      const dataToSave = { ...formData, imageUrls: finalImagePath };
      if (!dataToSave.id) dataToSave.id = new Date().getTime(); 

      await upsertData('events', dataToSave);
      setIsFormOpen(false);
      loadRecords();
    } catch (error) {
      alert("Error saving: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const openForm = (record = null) => {
    setSelectedFile(null);
    if (record) setFormData(record);
    else setFormData({ id: null, title: '', date: new Date().toISOString().split('T')[0], contents: '', imageUrls: '' });
    setIsFormOpen(true);
  };

  const columns = [
    { key: 'imageUrls', label: 'Cover', render: (val) => <img src={getPreviewUrl(val)} className="w-16 h-10 object-cover rounded shadow-sm" alt="Event" /> },
    { key: 'title', label: 'Event Title', render: (val) => <span className="font-bold">{val}</span> },
    { key: 'date', label: 'Date' }
  ];

  return (
    <div className="space-y-6">
      <DataTable title="Events Management" columns={columns} data={data} isLoading={loading} onAdd={() => openForm()} onEdit={openForm} onDelete={(id) => deleteData('events', id).then(loadRecords)} />

      <AdminForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} title={formData.id ? "Edit Event" : "Add Event"} isLoading={isSaving}>
        <MediaManager onUpload={setSelectedFile} isUploading={isSaving && selectedFile} currentImage={selectedFile ? URL.createObjectURL(selectedFile) : getPreviewUrl(formData.imageUrls)} />
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Event Title</label>
            <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Event Date</label>
            <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Description / Contents</label>
            <textarea rows="4" value={formData.contents} onChange={e => setFormData({...formData, contents: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
          </div>
        </div>
      </AdminForm>
    </div>
  );
}