import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react'
import { uploadTeamImage, uploadAlumniImage } from '../../lib/supabase'

export default function AdminUpload({ uploadType = 'team' }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState({ type: null, message: '' })
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (selectedFile) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!validTypes.includes(selectedFile.type)) {
      setStatus({
        type: 'error',
        message: 'Invalid file type. Please upload JPG, PNG, or WebP.'
      })
      return
    }

    if (selectedFile.size > maxSize) {
      setStatus({
        type: 'error',
        message: 'File size too large. Maximum 5MB allowed.'
      })
      return
    }

    setFile(selectedFile)
    setStatus({ type: null, message: '' })
  }

  const handleUpload = async (id) => {
    if (!file || !id.trim()) {
      setStatus({
        type: 'error',
        message: 'Please provide an ID and select a file.'
      })
      return
    }

    setUploading(true)
    setProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + Math.random() * 30, 90))
      }, 300)

      const uploadFunction = uploadType === 'team' ? uploadTeamImage : uploadAlumniImage
      const result = await uploadFunction(file, id)

      clearInterval(progressInterval)
      setProgress(100)

      if (result.success) {
        setStatus({
          type: 'success',
          message: `Image uploaded successfully! URL: ${result.url}`
        })
        setFile(null)
        // Reset file input
        setTimeout(() => {
          setStatus({ type: null, message: '' })
          setProgress(0)
        }, 5000)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: `Upload failed: ${error.message}`
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">
          Upload {uploadType === 'team' ? 'Team' : 'Alumni'} Image
        </h3>

        {/* File Upload Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative rounded-xl border-2 border-dashed p-8 transition-all ${
            dragActive
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />

          <div className="text-center pointer-events-none">
            <Upload className="mx-auto mb-3 text-gray-400" size={32} />
            {file ? (
              <>
                <p className="font-semibold text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold text-gray-900">Drop image here or click to select</p>
                <p className="text-sm text-gray-600 mt-1">JPG, PNG, or WebP up to 5MB</p>
              </>
            )}
          </div>
        </div>

        {/* ID Input */}
        {file && (
          <motion.input
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            type="text"
            placeholder={`Enter ${uploadType} member ID`}
            id="uploadId"
            className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        )}

        {/* Progress Bar */}
        <AnimatePresence>
          {uploading && progress > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4"
            >
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">{Math.round(progress)}%</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Message */}
        <AnimatePresence>
          {status.message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-4 p-4 rounded-lg flex gap-3 ${
                status.type === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              {status.type === 'success' ? (
                <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
              ) : (
                <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              )}
              <p
                className={
                  status.type === 'success' ? 'text-green-800 text-sm' : 'text-red-800 text-sm'
                }
              >
                {status.message}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Button */}
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 mt-6"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const id = document.getElementById('uploadId').value
                handleUpload(id)
              }}
              disabled={uploading}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setFile(null)
                setStatus({ type: null, message: '' })
                setProgress(0)
              }}
              disabled={uploading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              <X size={20} />
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
      >
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Upload images will be stored in Supabase Storage. Make sure to
          update the corresponding {uploadType} member record in the database with the returned
          image URL.
        </p>
      </motion.div>
    </div>
  )
}
