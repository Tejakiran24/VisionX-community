import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../utils/api';

function QuestionForm() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    nickname: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Remove the redirect - allow anonymous questions

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.title.trim() || !formData.description.trim()) {
        setError('Title and description are required');
        return;
      }

      // Process tags
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : ['general'];

      // Make API request
      const response = await api.post('/questions', {
        title: formData.title.trim(),
        description: formData.description.trim(),
        tags: tagsArray,
        nickname: formData.nickname.trim() || 'Anonymous'
      });

      if (response.data && response.data._id) {
        navigate(`/questions/${response.data._id}`);
      } else {
        setError('Failed to create question - invalid response');
      }
    } catch (err) {
      console.error('Question creation error:', err);
      if (err.response?.status === 401) {
        setError('Please log in to create a question');
        navigate('/login');
      } else {
        setError(err.response?.data?.msg || err.message || 'Failed to create question');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container mx-auto max-w-3xl px-4">
      <h1 className="text-3xl font-bold mb-8">Ask a Question</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="What's your question? Be specific."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
            Your Nickname (optional)
          </label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            placeholder="What should we call you? (Anonymous if left blank)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 mb-4"
          />

          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            rows="8"
            placeholder="Provide more details about your question..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Add tags (comma separated) e.g. javascript, react, node.js"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Add up to 5 tags to describe what your question is about
          </p>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/questions')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Posting...' : 'Post Question'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default QuestionForm;
