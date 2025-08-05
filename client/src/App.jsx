import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Questions from './pages/Questions.jsx'
import Projects from './pages/Projects.jsx'
import Resources from './pages/Resources.jsx'
import Navbar from './components/Navbar.jsx'
import QuestionDetails from './pages/QuestionDetails.jsx'
import ProjectDetails from './pages/ProjectDetails.jsx'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      <main className="min-h-[calc(100vh-64px)] py-8 px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/questions/:id" element={<QuestionDetails />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </main>
      <footer className="bg-white border-t border-gray-100 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-gray-600 text-sm">
              Made with 💙 by Team Akatsuki • {new Date().getFullYear()}
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">About</a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">Contact</a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
