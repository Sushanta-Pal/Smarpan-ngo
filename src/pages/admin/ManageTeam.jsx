import React, { useState, useEffect } from 'react';
import DataTable from '../../components/common/DataTable';
import AdminForm from '../../components/common/AdminForm';
import { fetchData, upsertData, deleteData } from '../../lib/supabase';

const ManageTeam = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const columns = [
    { 
      key: 'photo_url', 
      label: 'Photo', 
      render: (val) => <img src={val || 'https://via.placeholder.com/50'} className="w-10 h-10 object-cover rounded-full" alt="Team" />
    },
    { key: 'name', label: 'Full Name' },
    { key: 'position', label: 'Position' },
    { 
      key: 'is_active', 
      label: 'Status', 
      render: (val) => (
        <span className={`px-2 py-1 rounded text-xs font-bold ${val ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
          {val ? 'Active' : 'Inactive'}
        </span>
      )
    },
  ];

  const schema = [
    { name: 'name', label: 'Full Name', type: 'text', required: true },
    { name: 'position', label: 'Position', type: 'text', required: true },
    { name: 'order_position', label: 'Display Order', type: 'number', required: true },
    { name: 'is_active', label: 'Is Active Member', type: 'checkbox' },
    { name: 'photo_url', label: 'Profile Photo', type: 'image', bucket: 'team-members', folder: 'profiles', fullWidth: true },
    // Removed `bio` field: not present in DB schema for this deployment
  ];

  const loadRecords = async () => {
    try {
      setLoading(true);
      const records = await fetchData('team_members', 'order_position', true);
      setData(records);
    } catch (err) {
      alert("Error loading team members: " + err.message);
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
    if (window.confirm("Are you sure you want to remove this team member?")) {
      try {
        await deleteData('team_members', id);
        loadRecords();
      } catch (err) {
        alert("Error deleting record");
      }
    }
  };

  const handleSubmit = async (formData) => {
    await upsertData('team_members', formData);
    loadRecords();
  };

  return (
    <div className="space-y-6">
      <DataTable 
        title="Team Directory"
        columns={columns}
        data={data}
        isLoading={loading}
        onAdd={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <AdminForm 
        title="Team Member"
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        schema={schema}
        initialData={selectedRecord}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ManageTeam;
