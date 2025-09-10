import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

function ProjectForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    githubLink: '',
    liveLink: '',
    techStack: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to add a project');
      setLoading(false);
      return;
    }

    try {
      // Convert techStack string to array and filter out empty strings
      const techStackArray = formData.techStack
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0);
      
      if (techStackArray.length === 0) {
        setError('Please add at least one technology in Tech Stack');
        setLoading(false);
        return;
      }

      await api.post('/projects', {
        ...formData,
        techStack: techStackArray
      });
      
      navigate('/projects');
    } catch (err) {
      console.error('Error creating project:', err);
      if (err.response?.status === 401) {
        setError('Please login to add a project');
      } else {
        setError(err.response?.data?.message || 'Failed to create project. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Add New Project</h1>
      
      {error && (
        <div className="bg-red-50 p-4 rounded-lg mb-6">
          <p className="text-red-600">{error}</p>
          {error.includes('Please login') && (
            <Link
              to="/login"
              className="inline-block mt-2 text-blue-600 hover:text-blue-700"
            >
              Go to Login →
            </Link>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Project Title*
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description*
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="githubLink" className="block text-sm font-medium text-gray-700 mb-1">
            GitHub Link*
          </label>
          <input
            type="url"
            id="githubLink"
            name="githubLink"
            value={formData.githubLink}
            onChange={handleChange}
            required
            placeholder="https://github.com/username/repo"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="liveLink" className="block text-sm font-medium text-gray-700 mb-1">
            Live Demo Link (optional)
          </label>
          <input
            type="url"
            id="liveLink"
            name="liveLink"
            value={formData.liveLink}
            onChange={handleChange}
            placeholder="https://your-demo-site.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="techStack" className="block text-sm font-medium text-gray-700 mb-1">
            Tech Stack* (comma-separated)
          </label>
          <input
            type="text"
            id="techStack"
            name="techStack"
            value={formData.techStack}
            onChange={handleChange}
            required
            placeholder="React, Node.js, MongoDB"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
}

export default ProjectForm;
