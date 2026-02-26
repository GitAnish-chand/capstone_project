// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { courseService, enrollmentService } from '../services/api.service';
// import { useAuthStore } from '../store/authStore';
// import { BookOpen, TrendingUp, Award, Search, Filter } from 'lucide-react';
// import Layout from '../components/Layout';

// export default function Dashboard() {
//   const { user } = useAuthStore();
//   const [enrollments, setEnrollments] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       const [enrollmentsData, coursesData] = await Promise.all([
//         enrollmentService.getMyEnrollments(),
//         courseService.getAll(),
//       ]);
//       setEnrollments(enrollmentsData);
//       setCourses(coursesData);
//     } catch (error) {
//       console.error('Error loading data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEnroll = async (courseId) => {
//     try {
//       await enrollmentService.enroll(courseId);
//       loadData();
//     } catch (error) {
//       alert(error.response?.data?.detail || 'Failed to enroll');
//     }
//   };

//   const filteredCourses = courses.filter((course) => {
//     const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   const categories = [...new Set(courses.map((c) => c.category).filter(Boolean))];

//   if (loading) {
//     return (
//       <Layout>
//         <div className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
//             <p className="mt-4 text-gray-400">Loading...</p>
//           </div>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold mb-2">
//             Welcome back, {user?.email?.split('@')[0] || 'User'}!
//           </h1>
//           <p className="text-gray-400">Continue your learning journey</p>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-gray-800 rounded-xl shadow-lg p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-400 mb-1">Enrolled Courses</p>
//                 <p className="text-3xl font-bold">{enrollments.length}</p>
//               </div>
//               <div className="bg-indigo-900 p-3 rounded-lg">
//                 <BookOpen className="w-8 h-8 text-indigo-400" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-gray-800 rounded-xl shadow-lg p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-400 mb-1">Completed</p>
//                 <p className="text-3xl font-bold">
//                   {enrollments.filter((e) => e.completed).length}
//                 </p>
//               </div>
//               <div className="bg-green-900 p-3 rounded-lg">
//                 <Award className="w-8 h-8 text-green-400" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-gray-800 rounded-xl shadow-lg p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-400 mb-1">In Progress</p>
//                 <p className="text-3xl font-bold">
//                   {enrollments.filter((e) => !e.completed).length}
//                 </p>
//               </div>
//               <div className="bg-yellow-900 p-3 rounded-lg">
//                 <TrendingUp className="w-8 h-8 text-yellow-400" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* My Courses */}
//         {enrollments.length > 0 && (
//           <div className="mb-8">
//             <h2 className="text-2xl font-bold mb-4">My Courses</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {enrollments.slice(0, 3).map((enrollment) => (
//                 <Link
//                   key={enrollment.id}
//                   to={`/courses/${enrollment.course_id}`}
//                   className="bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-indigo-500/50 transition"
//                 >
//                   <h3 className="font-semibold text-lg mb-2">Course #{enrollment.course_id}</h3>
//                   <div className="flex items-center justify-between mb-3">
//                     <span className={`text-sm px-2 py-1 rounded ${
//                       enrollment.completed
//                         ? 'bg-green-900 text-green-300'
//                         : 'bg-yellow-900 text-yellow-300'
//                     }`}>
//                       {enrollment.completed ? 'Completed' : 'In Progress'}
//                     </span>
//                   </div>
//                   <div className="text-sm text-gray-400">
//                     Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Browse Courses */}
//         <div>
//           <h2 className="text-2xl font-bold mb-4">Browse Courses</h2>
          
//           {/* Search and Filter */}
//           <div className="flex flex-col sm:flex-row gap-4 mb-6">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search courses..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               />
//             </div>
//             <div className="relative">
//               <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <select
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 className="pl-10 pr-8 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
//               >
//                 <option value="all">All Categories</option>
//                 {categories.map((cat) => (
//                   <option key={cat} value={cat}>{cat}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Courses Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredCourses.map((course) => {
//               const isEnrolled = enrollments.some((e) => e.course_id === course.id);
              
//               return (
//                 <div key={course.id} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-indigo-500/50 transition">
//                   <div className="p-6">
//                     <div className="flex items-start justify-between mb-3">
//                       <h3 className="font-semibold text-lg">{course.title}</h3>
//                       {course.category && (
//                         <span className="text-xs px-2 py-1 bg-indigo-900 text-indigo-300 rounded">
//                           {course.category}
//                         </span>
//                       )}
//                     </div>
//                     <p className="text-gray-400 text-sm mb-4 line-clamp-2">
//                       {course.description || 'No description available'}
//                     </p>
//                                         {isEnrolled ? (
//                       <Link
//                         to={`/courses/${course.id}`}
//                         className="block w-full text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
//                       >
//                         Continue Learning
//                       </Link>
//                     ) : (
//                       <button
//                         onClick={() => handleEnroll(course.id)}
//                         className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
//                       >
//                         Enroll Now
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// }






import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService, enrollmentService } from '../services/api.service';
import { useAuthStore } from '../store/authStore';
import { BookOpen, TrendingUp, Award, Search, Filter, Clock, User, ChevronRight, Star } from 'lucide-react';
import Layout from '../components/Layout';

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

  // Helper to find course details for an enrollment
  const getCourseDetails = (courseId) => courses.find(c => c.id === courseId);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-500 font-medium">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Main Container: Light gray background to separate from white navbar */}
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Welcome back, <span className="text-indigo-600">{user?.email?.split('@')[0] || 'Learner'}</span> 👋
            </h1>
            <p className="mt-2 text-lg text-gray-600">Track your progress and expand your skills.</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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
          </div>

          {/* My Active Courses Section */}
          {enrollments.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Jump Back In</h2>
                <Link to="/my-courses" className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center text-sm">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.slice(0, 3).map((enrollment) => {
                  const course = getCourseDetails(enrollment.course_id);
                  return (
                    <Link
                      key={enrollment.id}
                      to={`/courses/${enrollment.course_id}`}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                             {course?.category || 'Course'}
                          </span>
                          <h3 className="font-bold text-gray-900 mt-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                            {course?.title || `Course #${enrollment.course_id}`}
                          </h3>
                        </div>
                        {enrollment.completed ? (
                           <div className="p-1.5 bg-green-100 rounded-full">
                              <Award className="w-5 h-5 text-green-600" />
                           </div>
                        ) : (
                           <div className="p-1.5 bg-indigo-50 rounded-full">
                              <BookOpen className="w-5 h-5 text-indigo-600" />
                           </div>
                        )}
                      </div>
                      
                      <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${enrollment.completed ? 'bg-green-500' : 'bg-indigo-500'}`}
                          style={{ width: enrollment.progress ? `${enrollment.progress}%` : '15%' }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 font-medium">
                        <span>{enrollment.completed ? 'Completed' : 'In Progress'}</span>
                        <span>{enrollment.progress || 0}%</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Browse Courses Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore New Courses</h2>

            {/* Search Bar & Filter */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for Python, React, Design..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-700"
                />
              </div>
              <div className="relative min-w-[200px]">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white text-gray-700 cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Courses Grid */}
            {filteredCourses.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                <Search className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-900">No courses found</h3>
                <p className="text-gray-500">Try adjusting your search terms.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => {
                  const isEnrolled = enrollments.some((e) => e.course_id === course.id);
                  
                  return (
                    <div
                      key={course.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
                    >
                      {/* Card Body */}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                            {course.category || 'General'}
                          </span>
                          <div className="flex items-center text-amber-400 text-xs font-bold">
                            <Star className="w-3 h-3 fill-current mr-1" />
                            4.8
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                          {course.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-6 line-clamp-2 flex-1">
                          {course.description || "Master this subject with our comprehensive curriculum designed for all skill levels."}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-6 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-1.5">
                              <User className="w-4 h-4" />
                              <span>{course.instructor || 'Expert Instructor'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              <span>{course.duration || 'Flexible'}</span>
                          </div>
                        </div>

                        {isEnrolled ? (
                          <Link
                            to={`/courses/${course.id}`}
                            className="w-full block text-center bg-green-50 text-green-700 font-semibold py-2.5 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                          >
                            Continue Learning
                          </Link>
                        ) : (
                          <button
                            onClick={() => handleEnroll(course.id)}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-sm active:transform active:scale-95"
                          >
                            Enroll Now
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Simple Helper Component for Stats
function StatCard({ label, value, icon: Icon, color }) {
  const colorStyles = {
    indigo: "bg-indigo-100 text-indigo-600",
    emerald: "bg-emerald-100 text-emerald-600",
    amber: "bg-amber-100 text-amber-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${colorStyles[color] || colorStyles.indigo}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}