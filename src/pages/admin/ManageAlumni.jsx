import React, { useState, useEffect } from 'react';
import DataTable from '../../components/common/DataTable';
import AdminForm from '../../components/common/AdminForm';
import MediaManager from '../../components/common/MediaManager';
import { fetchData, upsertData, deleteData, supabase } from '../../lib/supabase';

export default function ManageAlumni() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    id: null, name: '', company: '', linkedinUrl: '', imageUrl: '', passout_batch: ''
  });

  const loadRecords = async () => {
    setLoading(true);
    const records = await fetchData('alumini', 'passout_batch', false);
    setData(records || []);
    setLoading(false);
  };

  useEffect(() => { loadRecords(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let finalImageUrl = formData.imageUrl;
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const filePath = `profiles/${Math.random()}.${fileExt}`;
        await supabase.storage.from('alumni').upload(filePath, selectedFile);
        const { data: publicUrlData } = supabase.storage.from('alumni').getPublicUrl(filePath);
        finalImageUrl = publicUrlData.publicUrl;
      }

      const dataToSave = { ...formData, imageUrl: finalImageUrl };
      if (!dataToSave.id) delete dataToSave.id;

      await upsertData('alumini', dataToSave);
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
    else setFormData({ id: null, name: '', company: '', linkedinUrl: '', imageUrl: '', passout_batch: '' });
    setIsFormOpen(true);
  };

  const columns = [
    { key: 'imageUrl', label: 'Photo', render: (val) => <img src={val || 'https://via.placeholder.com/50'} className="w-10 h-10 object-cover rounded-full" alt="Alumni" /> },
    { key: 'name', label: 'Name', render: (val) => <span className="font-bold">{val}</span> },
    { key: 'passout_batch', label: 'Batch Year' },
    { key: 'company', label: 'Company' }
  ];

  return (
    <div className="space-y-6">
      <DataTable title="Alumni Network" columns={columns} data={data} isLoading={loading} onAdd={() => openForm()} onEdit={openForm} onDelete={(id) => deleteData('alumini', id).then(loadRecords)} />

      <AdminForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} title={formData.id ? "Edit Alumni" : "Add Alumni"} isLoading={isSaving}>
        <MediaManager onUpload={setSelectedFile} isUploading={isSaving && selectedFile} currentImage={selectedFile ? URL.createObjectURL(selectedFile) : formData.imageUrl} />
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-1">Full Name</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Company / Organization</label>
            <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Passout Batch (Year)</label>
            <input type="text" value={formData.passout_batch} onChange={e => setFormData({...formData, passout_batch: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. 2023" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-1">LinkedIn URL</label>
            <input type="url" value={formData.linkedinUrl} onChange={e => setFormData({...formData, linkedinUrl: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
      </AdminForm>
    </div>
  );
}