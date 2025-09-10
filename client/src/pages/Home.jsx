import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-16 bg-gradient-to-b from-white to-gray-50 p-10 rounded-xl shadow-md border border-gray-100 transform hover:-translate-y-1 transition-all duration-300">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              VisionX Developer Community
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            A safe space for developers to learn, share, and grow together
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/questions/new"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 inline-block text-center"
            >
              Ask a Question
            </Link>
            <Link
              to="/projects/new"
              className="bg-white text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg border border-gray-200 transform hover:-translate-y-0.5 inline-block text-center"
            >
              Share Project
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Latest Questions
            </h2>
            <Link to="/questions" className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center group">
              View All
              <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-200 border border-gray-100 hover:border-blue-100">
              <h3 className="text-gray-800 font-medium mb-2">How to implement authentication in React?</h3>
              <p className="text-gray-500 text-sm flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Posted 2 hours ago • 5 answers
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-200 border border-gray-100 hover:border-blue-100">
              <h3 className="text-gray-800 font-medium mb-2">Best practices for MongoDB schemas?</h3>
              <p className="text-gray-500 text-sm flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Posted 4 hours ago • 3 answers
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              Featured Projects
            </h2>
            <Link to="/projects" className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center group">
              View All
              <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer transition-all duration-200 border border-gray-100 hover:border-blue-100 transform hover:-translate-y-0.5">
              <h3 className="text-gray-800 font-medium mb-3">Task Management App</h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">React</span>
                <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">Node.js</span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer transition-all duration-200 border border-gray-100 hover:border-blue-100 transform hover:-translate-y-0.5">
              <h3 className="text-gray-800 font-medium mb-3">Weather Dashboard</h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">Vue.js</span>
                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">Express</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
