import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const HeaderSection = () => (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Questions</h1>
      <Link 
        to="/questions/new"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Ask Question
      </Link>
    </div>
  );

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log('🔄 Fetching questions...');
        const response = await api.get('/questions');
        console.log('✅ Questions response:', response.data);
        setQuestions(response.data);
        setLoading(false);
      } catch (err) {
        console.error('❌ Error fetching questions:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          config: err.config
        });
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Questions & Answers</h1>
        <Link 
          to="/questions/new"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-sm hover:shadow"
        >
          Ask a Question
        </Link>
      </div>
      
      <div className="space-y-6">
        {questions.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600 mb-4">No questions have been asked yet.</p>
            <Link
              to="/questions/new"
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Be the first to ask a question!
            </Link>
          </div>
        ) : (
          questions.map((question) => (
            <div 
              key={question._id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100"
            >
              <Link to={`/questions/${question._id}`} className="block">
                <h2 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600">
                  {question.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{question.body}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-500 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {question.views} views
                    </span>
                    <span className="text-gray-500 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {question.answers?.length || 0} answers
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {question.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Questions;
