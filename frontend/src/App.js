import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [contextImages, setContextImages] = useState([]);
  const [contextPreviews, setContextPreviews] = useState([]);
  const [clickwrapId, setClickwrapId] = useState('');
  const [cluster, setCluster] = useState('IN');
  const [loading, setLoading] = useState(false);
  const [demoUrl, setDemoUrl] = useState('');
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleContextImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setContextImages(files);
      const previews = files.map(file => URL.createObjectURL(file));
      setContextPreviews(previews);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!image || !clickwrapId) {
      setError('Please provide both a main screenshot and Clickwrap ID');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', image);
    formData.append('clickwrapId', clickwrapId);
    formData.append('cluster', cluster);
    
    // Add context images for design understanding
    contextImages.forEach((file, index) => {
      formData.append(`contextImage${index}`, file);
    });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/demos/create`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      setDemoUrl(response.data.demoUrl);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create demo');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(demoUrl);
    alert('Demo URL copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              SpotDraft Clickthrough Demo Tool
            </h1>
            <p className="text-gray-600">
              Create instant demo pages with embedded Clickthrough contracts
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Screenshot to Recreate
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {preview ? (
                      <img src={preview} alt="Preview" className="mx-auto max-h-64 rounded" />
                    ) : (
                      <div>
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-600">
                          Upload the page you want to recreate
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Context Pages (Optional)
                  <span className="text-sm text-gray-500 block">Upload other pages from the same website to understand design aesthetics, colors, fonts, and styling patterns</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleContextImagesChange}
                    className="hidden"
                    id="context-upload"
                  />
                  <label htmlFor="context-upload" className="cursor-pointer">
                    {contextPreviews.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {contextPreviews.map((preview, index) => (
                          <img key={index} src={preview} alt={`Context ${index + 1}`} className="h-24 w-full object-cover rounded" />
                        ))}
                      </div>
                    ) : (
                      <div>
                        <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <p className="mt-1 text-sm text-gray-600">
                          Upload homepage, about page, or other pages for design context
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clickwrap ID
                </label>
                <input
                  type="text"
                  value={clickwrapId}
                  onChange={(e) => setClickwrapId(e.target.value)}
                  placeholder="e.g., 79c580c0-5782-4373-9556-d4612fc84a1b"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cluster
                </label>
                <select
                  value={cluster}
                  onChange={(e) => setCluster(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="IN">India (IN) - api.in.spotdraft.com</option>
                  <option value="US">United States (US) - api.us.spotdraft.com</option>
                  <option value="EU">Europe (EU) - api.eu.spotdraft.com</option>
                  <option value="ME">Middle East (ME) - api.me.spotdraft.com</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Creating Demo...' : 'Generate Demo'}
              </button>
            </form>

            {demoUrl && (
              <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  ✓ Demo Created Successfully!
                </h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={demoUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Copy
                  </button>
                  <a
                    href={demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Open Demo
                  </a>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
                  <iframe
                    src={demoUrl}
                    className="w-full h-96 border border-gray-300 rounded"
                    title="Demo Preview"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;