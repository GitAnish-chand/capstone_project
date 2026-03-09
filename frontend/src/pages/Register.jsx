import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api.service';
import { BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
      });

      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass-panel rounded-3xl p-10 text-center relative z-10"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-green-500/20 p-4 rounded-full border border-green-500/30">
              <CheckCircle className="w-16 h-16 text-green-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">
            Registration Successful!
          </h2>
          <p className="text-zinc-400">
            Welcome aboard. Redirecting you to login...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center mb-8">
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
            Join Platform
          </h1>
          <p className="text-zinc-400 text-lg">Start your coding journey</p>
        </div>

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

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-4 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
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
                className="w-full px-4 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-semibold shadow-[0_0_20px_-5px_var(--tw-shadow-color)] shadow-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </motion.button>
          </form>

          <div className="mt-8 text-center relative z-10">
            <p className="text-zinc-400">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
