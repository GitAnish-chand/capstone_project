import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api.service';
import { useAuthStore } from '../store/authStore';
import { BookOpen, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(formData);
      setToken(response.access_token);

      const userInfo = {
        email: formData.email,
        role: 'employee',
      };
      setUser(userInfo);

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg shadow-indigo-500/30">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 mb-3 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-zinc-400 text-lg">Sign in to continue your journey</p>
        </div>

        {/* Login Form */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-200">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3.5 border border-white/10 rounded-xl bg-black/40 text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3.5 border border-white/10 rounded-xl bg-black/40 text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-semibold shadow-[0_0_20px_-5px_var(--tw-shadow-color)] shadow-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          <div className="mt-8 text-center relative z-10">
            <p className="text-zinc-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-zinc-600 mt-8">
          Company Learning Portal • Enhance Your Coding Skills
        </p>
      </motion.div>
    </div>
  );
}
