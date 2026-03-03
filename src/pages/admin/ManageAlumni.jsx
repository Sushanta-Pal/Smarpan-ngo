import React, { useState, useEffect } from 'react';
import DataTable from '../../components/common/DataTable';
import AdminForm from '../../components/common/AdminForm';
import { fetchData, upsertData, deleteData } from '../../lib/supabase';

const ManageAlumni = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'passout_batch', label: 'Batch' },
    { key: 'company', label: 'Company' },
    { 
      key: 'is_featured', 
      label: 'Featured', 
      render: (val) => val ? '⭐ Yes' : 'No'
    },
  ];

  const schema = [
    { name: 'name', label: 'Alumni Name', type: 'text', required: true },
    { name: 'passout_batch', label: 'Passout Batch', type: 'text', required: false },
    { name: 'company', label: 'Company / Organization', type: 'text', required: false },
    { name: 'linkedinUrl', label: 'LinkedIn URL', type: 'text', required: false },
    { name: 'is_featured', label: 'Show in Featured Section', type: 'checkbox' },
    { name: 'imageUrl', label: 'Profile Avatar', type: 'image', bucket: 'alumni', folder: 'alumni-data', fullWidth: true },
  ];

  const loadRecords = async () => {
    try {
      setLoading(true);
      const records = await fetchData('alumini');
      setData(records);
    } catch (err) {
      alert("Error loading alumni: " + err.message);
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
    if (window.confirm("Delete this alumni record?")) {
      try {
        await deleteData('alumini', id);
        loadRecords();
      } catch (err) {
        alert("Error deleting record");
      }
    }
  };

  const handleSubmit = async (formData) => {
    await upsertData('alumini', formData);
    loadRecords();
  };

  return (
    <div className="space-y-6">
      <DataTable 
        title="Alumni Directory"
        columns={columns}
        data={data}
        isLoading={loading}
        onAdd={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <AdminForm 
        title="Alumni"
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        schema={schema}
        initialData={selectedRecord}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ManageAlumni;
