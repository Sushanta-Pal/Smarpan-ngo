import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

const MediaManager = ({ onUpload, isUploading, currentImage }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        Cover Image
      </label>
      
      {currentImage && (
        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200 mb-4">
          <img 
            src={currentImage} 
            alt="Current upload" 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div 
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 
          ${dragActive ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleChange} 
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="flex flex-col items-center justify-center gap-3">
          <div className={`p-3 rounded-full ${dragActive ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
            {isUploading ? (
               <div className="w-6 h-6 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-700">
              {isUploading ? 'Uploading to server...' : 'Click or drag image to upload'}
            </p>
            <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaManager;