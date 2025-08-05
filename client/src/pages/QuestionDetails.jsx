import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const QuestionDetails = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(`/api/questions/${id}`);
        if (!res.ok) throw new Error('Question not found');
        const data = await res.json();
        setQuestion(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!question) return null;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-2">{question.title}</h2>
      <p className="mb-4 text-gray-700">{question.body}</p>
      <div className="mb-2 text-sm text-gray-500">Views: {question.views} | Upvotes: {question.upvotes?.length || 0}</div>
      <div className="mb-2">
        <span className="font-semibold">Tags:</span> {question.tags?.join(', ')}
      </div>
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Answers:</h3>
        {question.answers?.length ? (
          <ul>
            {question.answers.map((ans, idx) => (
              <li key={idx} className="mb-2 p-2 bg-gray-50 rounded">
                <div>{ans.body}</div>
                <div className="text-xs text-gray-400">By: {ans.author?.name || 'Anonymous'}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div>No answers yet.</div>
        )}
      </div>
    </div>
  );
};

export default QuestionDetails;
