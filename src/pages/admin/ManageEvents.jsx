import React, { useState, useEffect } from 'react';
import DataTable from '../../components/common/DataTable';
import AdminForm from '../../components/common/AdminForm';
import { fetchData, upsertData, deleteData } from '../../lib/supabase';

const ManageEvents = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const columns = [
    {
      key: 'imageUrls',
      label: 'Cover',
      render: (val) => {
        const placeholder = 'https://via.placeholder.com/50';
        let url = placeholder;
        try {
          if (Array.isArray(val) && val.length) url = val[0];
          else if (typeof val === 'string') {
            const trimmed = val.trim();
            if (!trimmed) url = placeholder;
            else if (trimmed.startsWith('[')) {
              const parsed = JSON.parse(trimmed);
              url = Array.isArray(parsed) && parsed.length ? parsed[0] : placeholder;
            } else if (trimmed.includes(',')) {
              url = trimmed.split(',')[0].trim();
            } else url = trimmed;
          }
        } catch (e) {
          url = placeholder;
        }
        return <img src={url || placeholder} className="w-10 h-10 object-cover rounded-lg shadow-sm" alt="Event" onError={(e)=>{e.currentTarget.src=placeholder}} />;
      }
    },
    { key: 'title', label: 'Title' },
    { key: 'date', label: 'Date', render: (val) => new Date(val).toLocaleDateString() }
  ];

  const schema = [
    { name: 'title', label: 'Event Title', type: 'text', required: true },
    { name: 'date', label: 'Event Date', type: 'date', required: true },
    { name: 'imageUrls', label: 'Event Image', type: 'image', bucket: 'public', folder: 'events', fullWidth: true },
    { name: 'contents', label: 'Description', type: 'textarea', required: false, fullWidth: true },
  ];

  const loadRecords = async () => {
    try {
      setLoading(true);
      const records = await fetchData('events');
      setData(records);
    } catch (err) {
      alert("Error loading events: " + err.message);
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
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteData('events', id);
        loadRecords();
      } catch (err) {
        alert("Error deleting record");
      }
    }
  };

  const handleSubmit = async (formData) => {
    await upsertData('events', formData);
    loadRecords();
  };

  return (
    <div className="space-y-6">
      <DataTable 
        title="Events Management"
        columns={columns}
        data={data}
        isLoading={loading}
        onAdd={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <AdminForm 
        title="Event"
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        schema={schema}
        initialData={selectedRecord}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ManageEvents;
