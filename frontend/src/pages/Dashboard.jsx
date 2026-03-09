import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService, enrollmentService } from '../services/api.service';
import { useAuthStore } from '../store/authStore';
import { BookOpen, TrendingUp, Award, Search, Filter, Clock, User, ChevronRight, Star } from 'lucide-react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [enrollmentsData, coursesData] = await Promise.all([
        enrollmentService.getMyEnrollments(),
        courseService.getAll(),
      ]);
      setEnrollments(enrollmentsData);
      setCourses(coursesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await enrollmentService.enroll(courseId);
      loadData();
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to enroll');
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(courses.map((c) => c.category).filter(Boolean))];

  const getCourseDetails = (courseId) => courses.find(c => c.id === courseId);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-zinc-500 font-medium tracking-wide">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-10 relative">
        <div className="absolute top-0 left-0 w-full h-96 bg-indigo-500/10 blur-[100px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{user?.email?.split('@')[0] || 'Learner'}</span> 👋
            </h1>
            <p className="text-lg text-zinc-400">Track your progress and expand your skills.</p>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <StatCard
              label="Enrolled Courses"
              value={enrollments.length}
              icon={BookOpen}
              color="indigo"
            />
            <StatCard
              label="Completed"
              value={enrollments.filter((e) => e.completed).length}
              icon={Award}
              color="emerald"
            />
            <StatCard
              label="In Progress"
              value={enrollments.filter((e) => !e.completed).length}
              icon={TrendingUp}
              color="amber"
            />
          </motion.div>

          {/* My Active Courses Section */}
          {enrollments.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-14"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Jump Back In</h2>
                <Link to="/my-courses" className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center text-sm transition-colors">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {enrollments.slice(0, 3).map((enrollment) => {
                  const course = getCourseDetails(enrollment.course_id);
                  return (
                    <motion.div variants={itemVariants} key={enrollment.id} className="h-full">
                      <Link
                        to={`/courses/${enrollment.course_id}`}
                        className="block glass-card rounded-3xl p-6 group h-full flex flex-col relative overflow-hidden"
                      >
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1 block">
                              {course?.category || 'Course'}
                            </span>
                            <h3 className="font-bold text-lg group-hover:text-indigo-300 transition-colors line-clamp-1">
                              {course?.title || `Course #${enrollment.course_id}`}
                            </h3>
                          </div>
                          {enrollment.completed ? (
                            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                              <Award className="w-5 h-5 text-emerald-400" />
                            </div>
                          ) : (
                            <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                              <BookOpen className="w-5 h-5 text-indigo-400" />
                            </div>
                          )}
                        </div>

                        <div className="mt-auto">
                          <div className="w-full bg-white/5 rounded-full h-2 mb-3 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: enrollment.progress ? `${enrollment.progress}%` : '15%' }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full rounded-full ${enrollment.completed ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-zinc-400 font-medium">
                            <span>{enrollment.completed ? 'Completed' : 'In Progress'}</span>
                            <span className={enrollment.completed ? 'text-emerald-400' : 'text-indigo-400'}>{enrollment.progress || 0}%</span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          )}

          {/* Browse Courses Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6">Explore New Courses</h2>

            {/* Search Bar & Filter */}
            <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for Python, React, Design..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-white placeholder-zinc-500 transition-all"
                />
              </div>
              <div className="relative min-w-[200px]">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none text-white cursor-pointer transition-all"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ChevronRight className="w-4 h-4 text-zinc-500 rotate-90" />
                </div>
              </div>
            </div>

            {/* Courses Grid */}
            {filteredCourses.length === 0 ? (
              <div className="text-center py-20 glass-panel rounded-3xl border-dashed border-white/20">
                <Search className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No courses found</h3>
                <p className="text-zinc-400">Try adjusting your search terms or category filter.</p>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredCourses.map((course) => {
                  const isEnrolled = enrollments.some((e) => e.course_id === course.id);

                  return (
                    <motion.div
                      variants={itemVariants}
                      key={course.id}
                      className="glass-card rounded-3xl overflow-hidden flex flex-col group relative"
                    >
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            {course.category || 'General'}
                          </span>
                          <div className="flex items-center text-amber-400 text-xs font-bold bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
                            <Star className="w-3 h-3 fill-current mr-1" />
                            4.8
                          </div>
                        </div>

                        <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-indigo-300 transition-colors">
                          {course.title}
                        </h3>

                        <p className="text-zinc-400 text-sm mb-6 line-clamp-3 flex-1 leading-relaxed">
                          {course.description || "Master this subject with our comprehensive curriculum designed for all skill levels."}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-zinc-500 mb-6 pt-5 border-t border-white/5">
                          <div className="flex items-center gap-1.5">
                            <User className="w-4 h-4 text-zinc-400" />
                            <span>{course.instructor || 'Instructor'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-zinc-400" />
                            <span>{course.duration || 'Flexible'}</span>
                          </div>
                        </div>

                        {isEnrolled ? (
                          <Link
                            to={`/courses/${course.id}`}
                            className="w-full text-center bg-white/5 text-white font-semibold py-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                          >
                            Continue Learning
                          </Link>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleEnroll(course.id)}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-colors shadow-[0_0_15px_-3px_var(--tw-shadow-color)] shadow-indigo-500"
                          >
                            Enroll Now
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  const colorStyles = {
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  return (
    <motion.div
      variants={itemVariants}
      className="glass-card rounded-3xl p-6 flex items-center justify-between"
    >
      <div>
        <p className="text-sm font-medium text-zinc-400 mb-2">{label}</p>
        <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-zinc-400">{value}</p>
      </div>
      <div className={`p-4 rounded-2xl border ${colorStyles[color] || colorStyles.indigo}`}>
        <Icon className="w-8 h-8" />
      </div>
    </motion.div>
  );
}