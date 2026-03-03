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

  const loadRecords = async () => {
    setLoading(true);
    const records = await fetchData('events', 'date', false); // false = descending (newest first)
    setData(records || []);
    setLoading(false);
  };

  useEffect(() => { loadRecords(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let finalImageUrl = formData.imageUrls;

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const filePath = `covers/${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('events').upload(filePath, selectedFile);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from('events').getPublicUrl(filePath);
        finalImageUrl = publicUrlData.publicUrl;
      }

      const dataToSave = { ...formData, imageUrls: finalImageUrl };
      // Events schema requires manual ID if not using identity
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
    { key: 'imageUrls', label: 'Cover', render: (val) => <img src={val || 'https://via.placeholder.com/100x50'} className="w-16 h-10 object-cover rounded shadow-sm" alt="Event" /> },
    { key: 'title', label: 'Event Title', render: (val) => <span className="font-bold">{val}</span> },
    { key: 'date', label: 'Date' }
  ];

  return (
    <div className="space-y-6">
      <DataTable title="Events Management" columns={columns} data={data} isLoading={loading} onAdd={() => openForm()} onEdit={openForm} onDelete={(id) => deleteData('events', id).then(loadRecords)} />

      <AdminForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} title={formData.id ? "Edit Event" : "Add Event"} isLoading={isSaving}>
        <MediaManager onUpload={setSelectedFile} isUploading={isSaving && selectedFile} currentImage={selectedFile ? URL.createObjectURL(selectedFile) : formData.imageUrls} />
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