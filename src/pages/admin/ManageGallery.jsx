import React, { useState, useEffect } from 'react';
import DataTable from '../../components/common/DataTable';
import AdminForm from '../../components/common/AdminForm';
import { fetchData, upsertData, deleteData } from '../../lib/supabase';

const ManageGallery = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const columns = [
    { 
      key: 'image_url', 
      label: 'Image', 
      render: (val) => <img src={val} className="w-16 h-10 object-cover rounded shadow-sm" alt="Gallery" />
    },
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category' },
  ];

  const schema = [
    { name: 'title', label: 'Image Title', type: 'text', required: true },
    { name: 'category', label: 'Category', type: 'text', required: true },
    { name: 'image_url', label: 'Gallery Photo', type: 'image', bucket: 'gallery', folder: 'collections', fullWidth: true },
  ];

  const loadRecords = async () => {
    try {
      setLoading(true);
      const records = await fetchData('gallery');
      setData(records);
    } catch (err) {
      alert("Error loading gallery: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRecords(); }, []);

  const handleCreate = () => {
    setSelectedRecord(null);
    setIsFormOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this gallery item?")) {
      try {
        await deleteData('gallery', id);
        loadRecords();
      } catch (err) {
        alert("Error deleting record");
      }
    }
  };

  const handleSubmit = async (formData) => {
    await upsertData('gallery', formData);
    loadRecords();
  };

  return (
    <div className="space-y-6">
      <DataTable 
        title="Gallery Management"
        columns={columns}
        data={data}
        isLoading={loading}
        onAdd={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <AdminForm 
        title="Gallery Item"
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        schema={schema}
        initialData={selectedRecord}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ManageGallery;
