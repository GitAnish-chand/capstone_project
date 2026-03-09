import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { BookOpen, LogOut, LayoutDashboard, MessageCircle, BarChart3 } from 'lucide-react';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-indigo-500/30">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="bg-indigo-600 p-2 rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-indigo-500/20">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                Learning Portal
              </span>
            </Link>

            {/* Navigation */}
            <div className="flex items-center space-x-2">
              <Link
                to="/dashboard"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/dashboard') ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Dashboard</span>
              </Link>
              
              <Link
                to="/chat"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/chat') ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">AI Chat</span>
              </Link>

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/admin') ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">Admin</span>
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 ml-2"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-0">{children}</main>
    </div>
  );
}
