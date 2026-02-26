import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService, moduleService, quizService, enrollmentService } from '../services/api.service';
import Layout from '../components/Layout';
import { BookOpen, CheckCircle, PlayCircle, FileText, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function CourseView() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [progress, setProgress] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourseData();
  }, [courseId]);

  const loadCourseData = async () => {
    try {
      const [courseData, modulesData, quizzesData] = await Promise.all([
        courseService.getById(courseId),
        moduleService.getByCourse(courseId),
        quizService.getByCourse(courseId),
      ]);
      
      setCourse(courseData);
      setModules(modulesData);
      setQuizzes(quizzesData);

      // Try to get progress
      try {
        const progressData = await enrollmentService.getProgress(courseId);
        setProgress(progressData);
      } catch (err) {
        // Not enrolled yet
      }

      if (modulesData.length > 0) {
        setSelectedModule(modulesData[0]);
      }
    } catch (error) {
      console.error('Error loading course:', error);
      alert('Failed to load course');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleQuizClick = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>

        {/* Course Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <p className="text-gray-600 mb-4">{course.description}</p>
              {course.category && (
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                  {course.category}
                </span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {progress && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-gray-900">{progress.progress_percent?.toFixed(0) || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all"
                  style={{ width: `${progress.progress_percent || 0}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Modules & Quizzes */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Course Content</h2>
              
              {/* Modules */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Modules ({modules.length})
                </h3>
                <div className="space-y-2">
                  {modules.map((module) => (
                    <button
                      key={module.id}
                      onClick={() => setSelectedModule(module)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition ${
                        selectedModule?.id === module.id
                          ? 'bg-indigo-100 text-indigo-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center">
                        <PlayCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-sm truncate">{module.title}</span>
                      </div>
                      {module.duration_minutes > 0 && (
                        <span className="text-xs text-gray-500 ml-6">
                          {module.duration_minutes} min
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quizzes */}
              {quizzes.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Quizzes ({quizzes.length})
                  </h3>
                  <div className="space-y-2">
                    {quizzes.map((quiz) => (
                      <button
                        key={quiz.id}
                        onClick={() => handleQuizClick(quiz.id)}
                        className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                      >
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="text-sm truncate">{quiz.title}</span>
                        </div>
                        <span className="text-xs text-gray-500 ml-6">
                          Pass: {quiz.passing_score}%
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {selectedModule ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {selectedModule.title}
                  </h2>
                  <div className="prose max-w-none">
                    {selectedModule.content ? (
                      <ReactMarkdown>{selectedModule.content}</ReactMarkdown>
                    ) : (
                      <p className="text-gray-500 italic">No content available for this module.</p>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Select a module to view content</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
