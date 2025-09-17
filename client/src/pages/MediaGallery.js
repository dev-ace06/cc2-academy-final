import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Image, 
  Video, 
  Upload, 
  Download, 
  Eye, 
  Heart, 
  Share2,
  Calendar,
  User,
  Filter,
  Search,
  X,
  Plus,
  FileText
} from 'lucide-react';

const MediaGallery = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'achievement',
    file: null
  });

  // Fetch media from API
  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/media');
      setMediaItems(response.data.media || []);
    } catch (error) {
      console.error('Error fetching media:', error);
      toast.error('Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const categories = [
    { id: 'all', label: 'All Media', icon: Image },
    { id: 'cwl', label: 'CWL', icon: Calendar },
    { id: 'war', label: 'Wars', icon: User },
    { id: 'games', label: 'Clan Games', icon: Heart },
    { id: 'capital', label: 'Clan Capital', icon: Share2 },
    { id: 'base', label: 'Base Designs', icon: Filter },
    { id: 'achievement', label: 'Achievements', icon: Download }
  ];

  const filteredMedia = mediaItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'video/mp4', 'video/webm', 'video/mov', 'video/avi'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image or video file');
        return;
      }
      
      // Validate file size (50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File size must be less than 50MB');
        return;
      }

      setUploadForm(prev => ({
        ...prev,
        file: file,
        title: file.name.split('.')[0] // Use filename as default title
      }));
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUploadForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle upload submission
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!uploadForm.file) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!uploadForm.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('media', uploadForm.file);
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('category', uploadForm.category);

      const token = localStorage.getItem('token');
      const response = await axios.post('/api/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success('Media uploaded successfully!');
      setShowUploadModal(false);
      setUploadForm({
        title: '',
        description: '',
        category: 'achievement',
        file: null
      });
      
      // Refresh media list
      fetchMedia();
    } catch (error) {
      console.error('Upload error:', error);
      if (error.response?.status === 401) {
        toast.error('Please log in to upload media');
      } else {
        toast.error(error.response?.data?.message || 'Upload failed');
      }
    } finally {
      setUploading(false);
    }
  };

  // Handle like functionality
  const handleLike = async (mediaId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to like media');
        return;
      }

      const response = await axios.put(`/api/media/${mediaId}/like`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update local state
      setMediaItems(prev => prev.map(item => 
        item._id === mediaId 
          ? { ...item, likes: response.data.likes }
          : item
      ));

      if (selectedMedia && selectedMedia._id === mediaId) {
        setSelectedMedia(prev => ({ ...prev, likes: response.data.likes }));
      }
    } catch (error) {
      console.error('Like error:', error);
      toast.error('Failed to like media');
    }
  };

  // Handle share functionality
  const handleShare = async (media) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: media.title,
          text: media.description,
          url: window.location.href
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to share media');
    }
  };

  // Open media and increment views on server
  const handleOpenMedia = async (mediaId) => {
    try {
      const { data } = await axios.get(`/api/media/${mediaId}`);
      setSelectedMedia(data);
      // Sync updated views into grid list
      setMediaItems(prev => prev.map(m => m._id === mediaId ? { ...m, views: data.views } : m));
    } catch (error) {
      console.error('Open media error:', error);
      // Fallback to local item if request fails
      const local = mediaItems.find(m => m._id === mediaId);
      if (local) setSelectedMedia(local);
    }
  };

  return (
    <div className="space-y-4 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col space-y-3">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-coc-gray-900 dark:text-white mb-1">
            Media Gallery
          </h1>
          <p className="text-sm sm:text-base text-coc-gray-600 dark:text-coc-gray-400">
            Share and view clan achievements, strategies, and memories
          </p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-3 bg-coc-gold text-coc-gray-900 rounded-lg hover:bg-coc-gold-dark transition-colors duration-200 font-semibold text-sm sm:text-base"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Media</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="card p-3 sm:p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-coc-gray-400" />
            <input
              type="text"
              placeholder="Search media..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full input-field pl-10 text-sm sm:text-base"
            />
          </div>
          
          {/* Category Filters - Mobile Optimized */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-coc-gray-700 dark:text-coc-gray-300">Categories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 px-2 py-2 sm:px-3 rounded-lg transition-colors duration-200 text-xs sm:text-sm ${
                      selectedCategory === category.id
                        ? 'bg-coc-gold text-coc-gray-900 font-semibold'
                        : 'bg-coc-gray-200 dark:bg-coc-gray-700 text-coc-gray-700 dark:text-coc-gray-300 hover:bg-coc-gray-300 dark:hover:bg-coc-gray-600'
                    }`}
                  >
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-center">{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="card text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coc-gold mx-auto mb-4"></div>
          <p className="text-coc-gray-600 dark:text-coc-gray-400">Loading media...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {filteredMedia.map((item) => (
          <div
            key={item._id}
            className="card overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer p-0"
            onClick={() => handleOpenMedia(item._id)}
          >
            <div className="relative">
              <img
                src={item.type === 'image' ? item.url : 'https://via.placeholder.com/400x300?text=Video'}
                alt={item.title}
                className="w-full h-40 sm:h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <div className={`px-2 py-1 rounded text-xs font-semibold text-white ${item.type === 'video' ? 'bg-coc-red' : 'bg-coc-blue'}`}>
                  {item.type.toUpperCase()}
                </div>
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-black bg-opacity-50 text-white p-2 rounded">
                  <h3 className="font-semibold text-xs sm:text-sm truncate">{item.title}</h3>
                </div>
              </div>
            </div>
            
            <div className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-coc-gray-600 dark:text-coc-gray-400 mb-2 sm:mb-3 line-clamp-2">
                {item.description}
              </p>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0 text-xs text-coc-gray-500 dark:text-coc-gray-500">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(item.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-3 h-3" />
                  <span className="truncate">{item.authorName}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-coc-gray-200 dark:border-coc-gray-700">
                <div className="flex items-center space-x-3 sm:space-x-4 text-xs text-coc-gray-500 dark:text-coc-gray-500">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-3 h-3" />
                    <span>{item.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{item.views}</span>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(item);
                  }}
                  className="text-coc-gray-400 hover:text-coc-gray-600 dark:hover:text-coc-gray-300 p-1"
                >
                  <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
      {!loading && filteredMedia.length === 0 && (
        <div className="card text-center py-12">
          <Image className="w-16 h-16 text-coc-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-coc-gray-900 dark:text-white mb-2">
            No Media Found
          </h3>
          <p className="text-coc-gray-500 dark:text-coc-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Media Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-coc-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-coc-gray-200 dark:border-coc-gray-700">
              <h2 className="text-xl font-bold text-coc-gray-900 dark:text-white">
                {selectedMedia.title}
              </h2>
              <button
                onClick={() => setSelectedMedia(null)}
                className="text-coc-gray-400 hover:text-coc-gray-600 dark:hover:text-coc-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              
              <div className="space-y-4">
                <p className="text-coc-gray-600 dark:text-coc-gray-400">
                  {selectedMedia.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-coc-gray-500 dark:text-coc-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(selectedMedia.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{selectedMedia.authorName}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{selectedMedia.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{selectedMedia.views}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-4 border-t border-coc-gray-200 dark:border-coc-gray-700">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(selectedMedia._id);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-coc-red text-white rounded-lg hover:bg-coc-red-dark transition-colors duration-200"
                  >
                    <Heart className="w-4 h-4" />
                    <span>Like</span>
                  </button>
                  <button 
                    onClick={() => handleShare(selectedMedia)}
                    className="flex items-center space-x-2 px-4 py-2 bg-coc-blue text-white rounded-lg hover:bg-coc-blue-dark transition-colors duration-200"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-coc-gray-200 dark:bg-coc-gray-700 text-coc-gray-700 dark:text-coc-gray-300 rounded-lg hover:bg-coc-gray-300 dark:hover:bg-coc-gray-600 transition-colors duration-200">
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white dark:bg-coc-gray-800 rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-coc-gray-200 dark:border-coc-gray-700">
              <h2 className="text-lg sm:text-xl font-bold text-coc-gray-900 dark:text-white">
                Upload Media
              </h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-coc-gray-400 hover:text-coc-gray-600 dark:hover:text-coc-gray-300 p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            
            <form onSubmit={handleUpload} className="p-3 sm:p-6">
              <div className="space-y-4">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-coc-gray-700 dark:text-coc-gray-300 mb-2">
                    Select File
                  </label>
                  <div className="border-2 border-dashed border-coc-gray-300 dark:border-coc-gray-600 rounded-lg p-4 sm:p-6 text-center hover:border-coc-gold transition-colors duration-200">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*,video/*"
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 sm:w-12 sm:h-12 text-coc-gray-400 mx-auto mb-2 sm:mb-4" />
                      <p className="text-sm sm:text-base text-coc-gray-600 dark:text-coc-gray-400 mb-1 sm:mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs sm:text-sm text-coc-gray-500 dark:text-coc-gray-500">
                        Images and videos up to 50MB
                      </p>
                    </label>
                  </div>
                  {uploadForm.file && (
                    <div className="mt-2 p-3 bg-coc-gray-100 dark:bg-coc-gray-700 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-coc-gray-500" />
                        <span className="text-sm text-coc-gray-700 dark:text-coc-gray-300">
                          {uploadForm.file.name} ({(uploadForm.file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-coc-gray-700 dark:text-coc-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={uploadForm.title}
                    onChange={handleInputChange}
                    placeholder="Enter media title"
                    className="input-field"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-coc-gray-700 dark:text-coc-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={uploadForm.description}
                    onChange={handleInputChange}
                    placeholder="Enter media description (optional)"
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-coc-gray-700 dark:text-coc-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={uploadForm.category}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="achievement">Achievement</option>
                    <option value="cwl">CWL</option>
                    <option value="war">Wars</option>
                    <option value="games">Clan Games</option>
                    <option value="capital">Clan Capital</option>
                    <option value="base">Base Designs</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6 pt-4 border-t border-coc-gray-200 dark:border-coc-gray-700">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="w-full sm:w-auto px-4 py-2 text-coc-gray-700 dark:text-coc-gray-300 hover:bg-coc-gray-100 dark:hover:bg-coc-gray-700 rounded-lg transition-colors duration-200 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !uploadForm.file || !uploadForm.title.trim()}
                  className="w-full sm:w-auto px-6 py-2 bg-coc-gold text-coc-gray-900 rounded-lg hover:bg-coc-gold-dark transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-coc-gray-900"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGallery;






