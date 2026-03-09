import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizService } from '../services/api.service';
import Layout from '../components/Layout';
import { CheckCircle, XCircle, ArrowLeft, Send, RefreshCw, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function QuizView() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      const response = await quizService.getById(quizId);
      if (response && response.status === "pending") {
        setQuiz(response.quiz);
        setSubmitted(false);
      }
      else if (response && response.status === "completed") {
        setResult(response.result);
        setSubmitted(true);
        setQuiz(response.result.quiz || response.result);
      }
      else {
        setQuiz(response);
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
      setQuiz(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReattempt = async () => {
    if (window.confirm("This will clear your previous score and allow you to try again. Continue?")) {
      try {
        setLoading(true);
        await quizService.reset(quizId);
        setSubmitted(false);
        setResult(null);
        setAnswers({});
        await loadQuiz();
      } catch (error) {
        alert("Failed to reset quiz: " + (error.response?.data?.detail || error.message));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    const totalQuestions = quiz?.questions?.length || 0;

    if (Object.keys(answers).length < totalQuestions) {
      if (!confirm("You haven't answered all questions. Submit anyway?")) {
        return;
      }
    }

    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        question_id: parseInt(questionId),
        answer,
      }));

      const resultData = await quizService.submit(quizId, formattedAnswers);
      setResult(resultData);
      setSubmitted(true);
    } catch (error) {
      alert('Failed to submit quiz: ' + (error.response?.data?.detail || error.message));
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          <p className="text-zinc-500 animate-pulse font-medium tracking-wide">Processing...</p>
        </div>
      </Layout>
    );
  }

  if (!quiz) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-32 text-center">
          <div className="glass-panel rounded-3xl p-10 max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Quiz not found</h2>
            <p className="text-zinc-400 mb-8">We couldn't find the quiz you're looking for.</p>
            <button onClick={() => navigate(-1)} className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" /> Go Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (submitted && result) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 blur-[100px] pointer-events-none -z-10" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-8 sm:p-12 text-center rounded-3xl"
          >
            <div className="flex justify-center mb-8">
              {result.passed ? (
                <div className="bg-emerald-500/10 p-5 rounded-full border border-emerald-500/20 shadow-[0_0_30px_-5px_var(--tw-shadow-color)] shadow-emerald-500/30">
                  <CheckCircle className="w-20 h-20 text-emerald-400" />
                </div>
              ) : (
                <div className="bg-rose-500/10 p-5 rounded-full border border-rose-500/20 shadow-[0_0_30px_-5px_var(--tw-shadow-color)] shadow-rose-500/30">
                  <XCircle className="w-20 h-20 text-rose-400" />
                </div>
              )}
            </div>

            <h2 className="text-4xl font-bold text-white mb-3">
              {result.passed ? 'Congratulations!' : 'Keep Practicing!'}
            </h2>
            <p className="text-zinc-400 text-lg mb-10">You scored <span className="font-semibold text-white">{result.score?.toFixed(1) || 0}%</span></p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              <div className="bg-black/40 border border-white/5 p-6 rounded-2xl">
                <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">Your Score</p>
                <p className="text-3xl font-bold text-white">{result.score?.toFixed(1) || 0}%</p>
              </div>
              <div className="bg-black/40 border border-white/5 p-6 rounded-2xl">
                <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">Points Earned</p>
                <p className="text-3xl font-bold text-white">{result.earned_points}/{result.total_points}</p>
              </div>
              <div className="bg-black/40 border border-white/5 p-6 rounded-2xl">
                <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">Status</p>
                <p className={`text-3xl font-bold ${result.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {result.passed ? 'Passed' : 'Failed'}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate(`/courses/${quiz?.course_id}`)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-semibold shadow-lg"
              >
                Back to Course
              </button>

              <button
                onClick={handleReattempt}
                className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3.5 rounded-xl hover:bg-indigo-500 transition-colors font-semibold flex items-center justify-center gap-2 shadow-[0_0_20px_-5px_var(--tw-shadow-color)] shadow-indigo-500"
              >
                <RefreshCw className="w-4 h-4" />
                Reattempt Quiz
              </button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        <button onClick={() => navigate(-1)} className="flex items-center text-zinc-400 hover:text-white mb-8 transition-colors group w-fit">
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 sm:p-10 rounded-3xl border-white/5 bg-zinc-900/50"
        >
          <div className="border-b border-white/10 pb-8 mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">{quiz?.title}</h1>
            {quiz?.description && <p className="text-zinc-400 text-lg mb-6 leading-relaxed max-w-3xl">{quiz.description}</p>}
            <div className="inline-flex items-center gap-4 text-sm font-semibold text-zinc-500 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
              <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-indigo-400" /> Passing score: {quiz?.passing_score}%</span>
              <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
              <span className="flex items-center"><FileText className="w-4 h-4 mr-2 text-purple-400" /> {quiz?.questions?.length || 0} questions</span>
            </div>
          </div>

          <div className="space-y-10">
            {quiz?.questions?.map((question, index) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                key={question.id}
                className="bg-black/30 p-6 sm:p-8 rounded-2xl border border-white/5 shadow-inner"
              >
                <h3 className="text-lg font-bold text-white mb-6 flex items-start leading-snug">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 mr-4 flex-shrink-0 text-sm">{index + 1}</span>
                  <div className="pt-1">
                    {question.question_text}
                    <span className="block mt-2 text-zinc-500 font-medium text-sm">Worth {question.points} point{question.points !== 1 ? 's' : ''}</span>
                  </div>
                </h3>

                {question.question_type === 'multiple_choice' && (
                  <div className="grid grid-cols-1 gap-3 ml-12">
                    {question.options.map((option, optionIndex) => (
                      <label key={optionIndex} className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 border ${answers[question.id] === option ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_-3px_var(--tw-shadow-color)] shadow-indigo-500/20' : 'border-white/5 bg-black/40 hover:bg-white/5 hover:border-white/10'}`}>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-4 transition-colors ${answers[question.id] === option ? 'border-indigo-500 bg-indigo-500' : 'border-zinc-500 bg-transparent'}`}>
                          {answers[question.id] === option && <div className="w-2 h-2 rounded-full bg-white"></div>}
                        </div>
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                          className="hidden"
                        />
                        <span className={`font-medium ${answers[question.id] === option ? 'text-indigo-200' : 'text-zinc-300'}`}>{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.question_type === 'true_false' && (
                  <div className="flex gap-4 ml-12">
                    {['True', 'False'].map((option) => (
                      <label key={option} className={`flex-1 flex items-center justify-center p-4 rounded-xl cursor-pointer transition-all duration-200 border ${answers[question.id] === option ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_-3px_var(--tw-shadow-color)] shadow-indigo-500/20' : 'border-white/5 bg-black/40 hover:bg-white/5 hover:border-white/10'}`}>
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                          className="hidden"
                        />
                        <span className={`font-bold ${answers[question.id] === option ? 'text-indigo-300' : 'text-zinc-400'}`}>{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.question_type === 'coding' && (
                  <div className="ml-12">
                    <textarea
                      value={answers[question.id] || ''}
                      onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                      className="w-full p-5 bg-black/60 border border-white/10 rounded-xl font-mono text-sm text-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-zinc-600 shadow-inner"
                      rows="6"
                      placeholder="// Write your code solution here..."
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="flex items-center bg-indigo-600 text-white px-8 py-4 rounded-xl hover:bg-indigo-500 transition-colors shadow-[0_0_20px_-5px_var(--tw-shadow-color)] shadow-indigo-500 font-bold"
            >
              <Send className="w-5 h-5 mr-3" /> Submit Quiz
            </motion.button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}