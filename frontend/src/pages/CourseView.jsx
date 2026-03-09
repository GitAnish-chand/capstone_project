import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService, moduleService, quizService, enrollmentService } from '../services/api.service';
import Layout from '../components/Layout';
import { BookOpen, CheckCircle, PlayCircle, FileText, ArrowLeft, Youtube } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

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

  // Helper function to extract YouTube video ID
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  };

  // Check if content is a YouTube URL
  const isYouTubeUrl = (url) => {
    return url && (url.includes('youtube.com') || url.includes('youtu.be'));
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 blur-[120px] pointer-events-none -z-10" />

        {/* Header */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-zinc-400 hover:text-white mb-6 transition-colors group w-fit"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        {/* Course Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 sm:p-8 rounded-3xl mb-8 border-white/5 bg-zinc-900/50"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">{course.title}</h1>
              <p className="text-zinc-400 mb-5 leading-relaxed max-w-3xl">{course.description}</p>
              {course.category && (
                <span className="inline-block px-4 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-sm font-semibold">
                  {course.category}
                </span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {progress && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex justify-between text-sm mb-3">
                <span className="text-zinc-400 font-medium">Course Progress</span>
                <span className="font-bold text-indigo-400">{progress.progress_percent?.toFixed(0) || 0}%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.progress_percent || 0}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                />
              </div>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Modules & Quizzes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="glass-panel rounded-3xl p-6 border-white/5 bg-zinc-900/50">
              <h2 className="text-lg font-bold text-white mb-6">Course Content</h2>

              {/* Modules */}
              <div className="mb-8">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Modules ({modules.length})
                </h3>
                <div className="space-y-2">
                  {modules.map((module) => (
                    <button
                      key={module.id}
                      onClick={() => setSelectedModule(module)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex flex-col ${selectedModule?.id === module.id
                          ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow-inner'
                          : 'text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'
                        }`}
                    >
                      <div className="flex items-center">
                        <PlayCircle className={`w-4 h-4 mr-3 flex-shrink-0 ${selectedModule?.id === module.id ? 'text-indigo-400' : 'text-zinc-500'}`} />
                        <span className="text-sm font-medium line-clamp-1">{module.title}</span>
                      </div>
                      {module.duration_minutes > 0 && (
                        <span className="text-xs text-zinc-500 ml-7 mt-1">
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
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Quizzes ({quizzes.length})
                  </h3>
                  <div className="space-y-2">
                    {quizzes.map((quiz) => (
                      <button
                        key={quiz.id}
                        onClick={() => handleQuizClick(quiz.id)}
                        className="w-full text-left px-4 py-3 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent transition-all duration-200"
                      >
                        <div className="flex items-center mb-1">
                          <CheckCircle className="w-4 h-4 mr-3 flex-shrink-0 text-amber-500" />
                          <span className="text-sm font-medium line-clamp-1">{quiz.title}</span>
                        </div>
                        <span className="text-xs text-zinc-500 ml-7">
                          Pass: {quiz.passing_score}%
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="glass-panel rounded-3xl p-6 sm:p-10 min-h-[500px] border-white/5 bg-zinc-900/50">
              {selectedModule ? (
                <motion.div
                  key={selectedModule.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-8 pb-4 border-b border-white/10">
                    {selectedModule.title}
                  </h2>
                  
                  {/* YouTube Video Player */}
                  {isYouTubeUrl(selectedModule.content) ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="mb-8"
                    >
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${getYouTubeVideoId(selectedModule.content)}`}
                          title={selectedModule.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="absolute inset-0"
                        />
                      </div>
                      
                      {/* Video Info */}
                      <div className="mt-6 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                        <div className="flex items-start gap-4">
                          <Youtube className="w-8 h-8 text-indigo-400 flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-2">
                              Video Lesson
                            </h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                              Watch this video tutorial to learn about <span className="text-indigo-300 font-medium">{selectedModule.title}</span>. 
                              The video will open in a new tab if you prefer fullscreen viewing.
                            </p>
                            <a
                              href={selectedModule.content}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center mt-4 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors text-sm font-medium"
                            >
                              <Youtube className="w-4 h-4 mr-2" />
                              Open in YouTube
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                  
                  {/* Module Content (for non-YouTube content) */}
                  <div className={`prose prose-invert prose-indigo max-w-none 
                    prose-headings:text-zinc-100 prose-p:text-zinc-400 
                    prose-a:text-indigo-400 hover:prose-a:text-indigo-300
                    prose-strong:text-zinc-200 prose-code:text-indigo-300
                    prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10
                    prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-500/5 prose-blockquote:py-1
                    ${isYouTubeUrl(selectedModule.content) ? 'mt-8' : ''}`}>
                    {!isYouTubeUrl(selectedModule.content) && selectedModule.content ? (
                      <ReactMarkdown>{selectedModule.content}</ReactMarkdown>
                    ) : null}
                    
                    {isYouTubeUrl(selectedModule.content) && (
                      <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-4">About This Lesson</h3>
                        <p className="text-zinc-400 leading-relaxed">
                          This module covers <span className="text-indigo-300 font-medium">{selectedModule.title}</span>. 
                          Watch the video above to learn about this topic. The video duration is approximately{' '}
                          <span className="text-white font-semibold">{selectedModule.duration_minutes} minutes</span>.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {!selectedModule.content && !isYouTubeUrl(selectedModule.content) && (
                    <p className="text-zinc-500 italic mt-8">No content available for this module.</p>
                  )}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-zinc-500">
                  <div className="p-6 bg-white/5 rounded-full mb-6 border border-white/10">
                    <BookOpen className="w-16 h-16 text-zinc-600" />
                  </div>
                  <p className="text-lg font-medium text-zinc-400">Select a module from the sidebar to begin</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
