import React, { useState, useEffect } from 'react';
import DataTable from '../../components/common/DataTable';
import AdminForm from '../../components/common/AdminForm';
import MediaManager from '../../components/common/MediaManager';
import { fetchData, upsertData, deleteData, supabase } from '../../lib/supabase';

export default function ManageGallery() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    id: null, title: '', imageUrls: ''
  });

  const loadRecords = async () => {
    setLoading(true);
    const records = await fetchData('gallery', 'id', false); // newest first
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
        const filePath = `images/${Math.random()}.${fileExt}`;
        await supabase.storage.from('gallery').upload(filePath, selectedFile);
        const { data: publicUrlData } = supabase.storage.from('gallery').getPublicUrl(filePath);
        finalImageUrl = publicUrlData.publicUrl;
      }

      const dataToSave = { ...formData, imageUrls: finalImageUrl };
      if (!dataToSave.id) delete dataToSave.id;

      await upsertData('gallery', dataToSave);
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
    else setFormData({ id: null, title: '', imageUrls: '' });
    setIsFormOpen(true);
  };

  const columns = [
    { key: 'imageUrls', label: 'Image', render: (val) => <img src={val} className="w-24 h-16 object-cover rounded shadow-sm" alt="Gallery" /> },
    { key: 'title', label: 'Image Title', render: (val) => <span className="font-bold">{val}</span> }
  ];

  return (
    <div className="space-y-6">
      <DataTable title="Gallery Management" columns={columns} data={data} isLoading={loading} onAdd={() => openForm()} onEdit={openForm} onDelete={(id) => deleteData('gallery', id).then(loadRecords)} />

      <AdminForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} title={formData.id ? "Edit Gallery Item" : "Upload New Image"} isLoading={isSaving}>
        <MediaManager onUpload={setSelectedFile} isUploading={isSaving && selectedFile} currentImage={selectedFile ? URL.createObjectURL(selectedFile) : formData.imageUrls} />
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Image Title / Caption</label>
            <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Annual Blood Donation Camp" />
          </div>
        </div>
      </AdminForm>
    </div>
  );
}