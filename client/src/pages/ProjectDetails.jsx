import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      // Skip API call if the ID is "new"
      if (id === 'new') {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/projects/${id}`);
        setProject(res.data);
      } catch (err) {
        setError('Project not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!project) return null;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
      <p className="mb-4 text-gray-700">{project.description}</p>
      <div className="mb-2 text-sm text-gray-500">Tech Stack: {project.techStack?.join(', ')}</div>
      <div className="mb-2 text-sm text-gray-500">Likes: {project.likes?.length || 0}</div>
      <div className="mb-2 text-sm text-gray-500">GitHub: <a href={project.githubLink} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">{project.githubLink}</a></div>
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Comments:</h3>
        {project.comments?.length ? (
          <ul>
            {project.comments.map((comment, idx) => (
              <li key={idx} className="mb-2 p-2 bg-gray-50 rounded">
                <div>{comment.body}</div>
                <div className="text-xs text-gray-400">By: {comment.author?.name || 'Anonymous'}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div>No comments yet.</div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
