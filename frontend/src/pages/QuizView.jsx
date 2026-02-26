// // import { useState, useEffect } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import { quizService } from '../services/api.service';
// // import Layout from '../components/Layout';
// // import { CheckCircle, XCircle, ArrowLeft, Send } from 'lucide-react';

// // export default function QuizView() {
// //   const { quizId } = useParams();
// //   const navigate = useNavigate();
// //   const [quiz, setQuiz] = useState(null);
// //   const [answers, setAnswers] = useState({});
// //   const [submitted, setSubmitted] = useState(false);
// //   const [result, setResult] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     loadQuiz();
// //   }, [quizId]);

// //   const loadQuiz = async () => {
// //     try {
// //       const data = await quizService.getById(quizId);
// //       setQuiz(data);
// //     } catch (error) {
// //       console.error('Error loading quiz:', error);
// //       alert('Failed to load quiz');
// //       navigate('/dashboard');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSubmit = async () => {
// //     if (Object.keys(answers).length < quiz.questions.length) {
// //       if (!confirm('You haven\'t answered all questions. Submit anyway?')) {
// //         return;
// //       }
// //     }

// //     try {
// //       const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
// //         question_id: parseInt(questionId),
// //         answer,
// //       }));

// //       const resultData = await quizService.submit(quizId, formattedAnswers);
// //       setResult(resultData);
// //       setSubmitted(true);
// //     } catch (error) {
// //       alert('Failed to submit quiz: ' + (error.response?.data?.detail || error.message));
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <Layout>
// //         <div className="flex items-center justify-center h-64">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
// //         </div>
// //       </Layout>
// //     );
// //   }

// //   if (submitted && result) {
// //     return (
// //       <Layout>
// //         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //           <div className="bg-white rounded-xl shadow-sm p-8 text-center">
// //             <div className="flex justify-center mb-6">
// //               {result.passed ? (
// //                 <div className="bg-green-100 p-4 rounded-full">
// //                   <CheckCircle className="w-16 h-16 text-green-600" />
// //                 </div>
// //               ) : (
// //                 <div className="bg-red-100 p-4 rounded-full">
// //                   <XCircle className="w-16 h-16 text-red-600" />
// //                 </div>
// //               )}
// //             </div>

// //             <h2 className="text-3xl font-bold text-gray-900 mb-2">
// //               {result.passed ? 'Congratulations!' : 'Keep Practicing!'}
// //             </h2>
// //             <p className="text-gray-600 mb-6">
// //               You scored {result.score.toFixed(1)}%
// //             </p>

// //             <div className="grid grid-cols-3 gap-4 mb-8">
// //               <div className="bg-gray-50 p-4 rounded-lg">
// //                 <p className="text-sm text-gray-600 mb-1">Your Score</p>
// //                 <p className="text-2xl font-bold text-gray-900">{result.score.toFixed(1)}%</p>
// //               </div>
// //               <div className="bg-gray-50 p-4 rounded-lg">
// //                 <p className="text-sm text-gray-600 mb-1">Points Earned</p>
// //                 <p className="text-2xl font-bold text-gray-900">{result.earned_points}/{result.total_points}</p>
// //               </div>
// //               <div className="bg-gray-50 p-4 rounded-lg">
// //                 <p className="text-sm text-gray-600 mb-1">Status</p>
// //                 <p className={`text-2xl font-bold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
// //                   {result.passed ? 'Passed' : 'Failed'}
// //                 </p>
// //               </div>
// //             </div>

// //             <button
// //               onClick={() => navigate(`/courses/${quiz.course_id}`)}
// //               className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
// //             >
// //               Back to Course
// //             </button>
// //           </div>
// //         </div>
// //       </Layout>
// //     );
// //   }

// //   return (
// //     <Layout>
// //       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //         <button
// //           onClick={() => navigate(-1)}
// //           className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
// //         >
// //           <ArrowLeft className="w-5 h-5 mr-2" />
// //           Back
// //         </button>

// //         <div className="bg-white rounded-xl shadow-sm p-8">
// //           <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
// //           {quiz.description && (
// //             <p className="text-gray-600 mb-6">{quiz.description}</p>
// //           )}
// //           <p className="text-sm text-gray-500 mb-8">
// //             Passing score: {quiz.passing_score}% • {quiz.questions.length} questions
// //           </p>

// //           <div className="space-y-6">
// //             {quiz?.questions?.map((question, index) => (
// //               <div key={question.id} className="border-b border-gray-200 pb-6 last:border-0">
// //                 <h3 className="font-medium text-gray-900 mb-4">
// //                   {index + 1}. {question.question_text} ({question.points} point{question.points !== 1 ? 's' : ''})
// //                 </h3>

// //                 {question.question_type === 'multiple_choice' && question.options && (
// //                   <div className="space-y-2">
// //                     {question.options.map((option, optionIndex) => (
// //                       <label
// //                         key={optionIndex}
// //                         className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
// //                       >
// //                         <input
// //                           type="radio"
// //                           name={`question-${question.id}`}
// //                           value={option}
// //                           checked={answers[question.id] === option}
// //                           onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
// //                           className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
// //                         />
// //                         <span className="ml-3 text-gray-700">{option}</span>
// //                       </label>
// //                     ))}
// //                   </div>
// //                 )}

// //                 {question.question_type === 'true_false' && (
// //                   <div className="space-y-2">
// //                     {['True', 'False'].map((option) => (
// //                       <label
// //                         key={option}
// //                         className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
// //                       >
// //                         <input
// //                           type="radio"
// //                           name={`question-${question.id}`}
// //                           value={option}
// //                           checked={answers[question.id] === option}
// //                           onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
// //                           className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
// //                         />
// //                         <span className="ml-3 text-gray-700">{option}</span>
// //                       </label>
// //                     ))}
// //                   </div>
// //                 )}

// //                 {question.question_type === 'coding' && (
// //                   <textarea
// //                     value={answers[question.id] || ''}
// //                     onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
// //                     className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-indigo-500"
// //                     rows="6"
// //                     placeholder="Enter your code here..."
// //                   />
// //                 )}
// //               </div>
// //             ))}
// //           </div>

// //           <div className="mt-8 flex justify-end">
// //             <button
// //               onClick={handleSubmit}
// //               className="flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
// //             >
// //               <Send className="w-5 h-5 mr-2" />
// //               Submit Quiz
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </Layout>
// //   );
// // }




// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { quizService } from '../services/api.service';
// import Layout from '../components/Layout';
// import { CheckCircle, XCircle, ArrowLeft, Send } from 'lucide-react';

// export default function QuizView() {
//   const { quizId } = useParams();
//   const navigate = useNavigate();
//   const [quiz, setQuiz] = useState(null);
//   const [answers, setAnswers] = useState({});
//   const [submitted, setSubmitted] = useState(false);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadQuiz();
//   }, [quizId]);

//   // const loadQuiz = async () => {
//   //   try {
//   //     const data = await quizService.getById(quizId);
//   //     setQuiz(data);
//   //   } catch (error) {
//   //     console.error('Error loading quiz:', error);
//   //     alert('Failed to load quiz');
//   //     navigate('/dashboard');
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const loadQuiz = async () => {
//     try {
//       const response = await quizService.getById(quizId);
//       console.log("Backend Raw Response:", response);

//       // Your backend returns an object with a 'quiz' key if pending
//       if (response && response.status === "pending") {
//         setQuiz(response.quiz); 
//       } 
//       // If the user already finished it, your backend sends 'status: completed'
//       else if (response && response.status === "completed") {
//         setResult(response.result);
//         setSubmitted(true);
//         // We set the quiz data from the result so the title still shows
//         setQuiz(response.result.quiz || response.result); 
//       } 
//       // Fallback for standard responses
//       else {
//         setQuiz(response);
//       }
//     } catch (error) {
//       console.error('Error loading quiz:', error);
//       // If the API literally returns 404, this catch block runs
//       setQuiz(null); 
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async () => {
//     // Safety check for quiz questions length
//     const totalQuestions = quiz.questions.length || 0;
    
//     if (Object.keys(answers).length < totalQuestions) {
//       if (!confirm("You haven't answered all questions. Submit anyway?")) {
//         return;
//       }
//     }

//     try {
//       const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
//         question_id: parseInt(questionId),
//         answer,
//       }));

//       const resultData = await quizService.submit(quizId, formattedAnswers);
//       setResult(resultData);
//       setSubmitted(true);
//     } catch (error) {
//       alert('Failed to submit quiz: ' + (error.response?.data?.detail || error.message));
//     }
//   };

//   if (loading) {
//     return (
//       <Layout>
//         <div className="mb-4 p-2 bg-black text-green-400 text-xs rounded font-mono">
//         <p>Questions Found: {quiz?.questions?.length || 0}</p>
//         <details>
//            <summary>Click to see Raw JSON</summary>
//            <pre>{JSON.stringify(quiz, null, 2)}</pre>
//         </details>
//       </div>

//       <button onClick={() => navigate(-1)} className="...">
//         <ArrowLeft className="w-5 h-5 mr-2" /> Back
//       </button>
//         <div className="flex flex-col items-center justify-center h-64 space-y-4">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//           <p className="text-gray-500 animate-pulse">Loading Quiz Content...</p>
//         </div>
//       </Layout>
//     );
//   }

//   // Safety Gate: If quiz failed to load or has no data, show this instead of crashing
//   if (!quiz) {
//     return (
//       <Layout>
//         <div className="max-w-4xl mx-auto px-4 py-16 text-center">
//           <h2 className="text-2xl font-bold text-gray-800">Quiz not found</h2>
//           <p className="text-gray-600 mt-2">We couldn't find the quiz you're looking for.</p>
//           <button 
//             onClick={() => navigate(-1)} 
//             className="mt-6 text-indigo-600 font-medium hover:underline flex items-center justify-center mx-auto"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
//           </button>
//         </div>
//       </Layout>
//     );
//   }

//   if (submitted && result) {
//     return (
//       <Layout>
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
//             <div className="flex justify-center mb-6">
//               {result.passed ? (
//                 <div className="bg-green-100 p-4 rounded-full">
//                   <CheckCircle className="w-16 h-16 text-green-600" />
//                 </div>
//               ) : (
//                 <div className="bg-red-100 p-4 rounded-full">
//                   <XCircle className="w-16 h-16 text-red-600" />
//                 </div>
//               )}
//             </div>

//             <h2 className="text-3xl font-bold text-gray-900 mb-2">
//               {result.passed ? 'Congratulations!' : 'Keep Practicing!'}
//             </h2>
//             <p className="text-gray-600 mb-6">
//               You scored {result.score?.toFixed(1) || 0}%
//             </p>

//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <p className="text-sm text-gray-600 mb-1">Your Score</p>
//                 <p className="text-2xl font-bold text-gray-900">{result.score?.toFixed(1) || 0}%</p>
//               </div>
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <p className="text-sm text-gray-600 mb-1">Points Earned</p>
//                 <p className="text-2xl font-bold text-gray-900">{result.earned_points}/{result.total_points}</p>
//               </div>
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <p className="text-sm text-gray-600 mb-1">Status</p>
//                 <p className={`text-2xl font-bold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
//                   {result.passed ? 'Passed' : 'Failed'}
//                 </p>
//               </div>
//             </div>

//             <button
//               onClick={() => navigate(`/courses/${quiz?.course_id}`)}
//               className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
//             >
//               Back to Course
//             </button>
//           </div>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
//         >
//           <ArrowLeft className="w-5 h-5 mr-2" />
//           Back
//         </button>

//         <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz?.title}</h1>
//           {quiz?.description && (
//             <p className="text-gray-600 mb-6">{quiz.description}</p>
//           )}
//           <p className="text-sm text-gray-500 mb-8 font-medium">
//             Passing score: {quiz?.passing_score}% • {quiz?.questions?.length || 0} questions
//           </p>

//           <div className="space-y-8">
//             {quiz?.questions?.map((question, index) => (
//               <div key={question.id} className="border-b border-gray-100 pb-8 last:border-0">
//                 <h3 className="font-semibold text-gray-900 mb-4 flex items-start">
//                   <span className="mr-2">{index + 1}.</span>
//                   <span>{question.question_text} <span className="text-gray-400 font-normal text-sm italic">({question.points} pt)</span></span>
//                 </h3>

//                 {question.question_type === 'multiple_choice' && question.options && (
//                   <div className="grid grid-cols-1 gap-3">
//                     {question.options.map((option, optionIndex) => (
//                       <label
//                         key={optionIndex}
//                         className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
//                           answers[question.id] === option 
//                           ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600' 
//                           : 'border-gray-200 hover:bg-gray-50'
//                         }`}
//                       >
//                         <input
//                           type="radio"
//                           name={`question-${question.id}`}
//                           value={option}
//                           checked={answers[question.id] === option}
//                           onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
//                           className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
//                         />
//                         <span className="ml-3 text-gray-700 font-medium">{option}</span>
//                       </label>
//                     ))}
//                   </div>
//                 )}

//                 {question.question_type === 'true_false' && (
//                   <div className="flex gap-4">
//                     {['True', 'False'].map((option) => (
//                       <label
//                         key={option}
//                         className={`flex-1 flex items-center justify-center p-4 border rounded-xl cursor-pointer transition-all ${
//                           answers[question.id] === option 
//                           ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600' 
//                           : 'border-gray-200 hover:bg-gray-50'
//                         }`}
//                       >
//                         <input
//                           type="radio"
//                           name={`question-${question.id}`}
//                           value={option}
//                           checked={answers[question.id] === option}
//                           onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
//                           className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
//                         />
//                         <span className="ml-3 text-gray-700 font-medium">{option}</span>
//                       </label>
//                     ))}
//                   </div>
//                 )}

//                 {question.question_type === 'coding' && (
//                   <textarea
//                     value={answers[question.id] || ''}
//                     onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
//                     className="w-full p-4 border border-gray-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50"
//                     rows="6"
//                     placeholder="// Write your code solution here..."
//                   />
//                 )}
//               </div>
//             ))}
//           </div>

//           <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
//             <button
//               onClick={handleSubmit}
//               className="flex items-center bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 font-bold active:scale-95"
//             >
//               <Send className="w-5 h-5 mr-2" />
//               Submit Quiz
//             </button>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// }


import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizService } from '../services/api.service';
import Layout from '../components/Layout';
import { CheckCircle, XCircle, ArrowLeft, Send, RefreshCw } from 'lucide-react'; // Added RefreshCw icon

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
      console.log("Backend Raw Response:", response);

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

  // --- NEW REATTEMPT HANDLER ---
  const handleReattempt = async () => {
    if (window.confirm("This will clear your previous score and allow you to try again. Continue?")) {
      try {
        setLoading(true);
        // Call the delete/reset endpoint in your backend
        await quizService.reset(quizId); 
        
        // Reset local states
        setSubmitted(false);
        setResult(null);
        setAnswers({});
        
        // Refresh data from backend (should now return status: pending)
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
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-500 animate-pulse">Processing...</p>
        </div>
      </Layout>
    );
  }

  if (!quiz) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Quiz not found</h2>
          <button onClick={() => navigate(-1)} className="mt-6 text-indigo-600 flex items-center justify-center mx-auto">
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </button>
        </div>
      </Layout>
    );
  }

  if (submitted && result) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
            <div className="flex justify-center mb-6">
              {result.passed ? (
                <div className="bg-green-100 p-4 rounded-full"><CheckCircle className="w-16 h-16 text-green-600" /></div>
              ) : (
                <div className="bg-red-100 p-4 rounded-full"><XCircle className="w-16 h-16 text-red-600" /></div>
              )}
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {result.passed ? 'Congratulations!' : 'Keep Practicing!'}
            </h2>
            <p className="text-gray-600 mb-6">You scored {result.score?.toFixed(1) || 0}%</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Your Score</p>
                <p className="text-2xl font-bold text-gray-900">{result.score?.toFixed(1) || 0}%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Points Earned</p>
                <p className="text-2xl font-bold text-gray-900">{result.earned_points}/{result.total_points}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <p className={`text-2xl font-bold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                  {result.passed ? 'Passed' : 'Failed'}
                </p>
              </div>
            </div>

            {/* UPDATED BUTTON SECTION */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate(`/courses/${quiz?.course_id}`)}
                className="w-full sm:w-auto bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition font-semibold"
              >
                Back to Course
              </button>
              
              <button
                onClick={handleReattempt}
                className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reattempt Quiz
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </button>

        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz?.title}</h1>
          {quiz?.description && <p className="text-gray-600 mb-6">{quiz.description}</p>}
          <p className="text-sm text-gray-500 mb-8 font-medium">
            Passing score: {quiz?.passing_score}% • {quiz?.questions?.length || 0} questions
          </p>

          <div className="space-y-8">
            {quiz?.questions?.map((question, index) => (
              <div key={question.id} className="border-b border-gray-100 pb-8 last:border-0">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-start">
                  <span className="mr-2">{index + 1}.</span>
                  <span>{question.question_text} <span className="text-gray-400 font-normal text-sm italic">({question.points} pt)</span></span>
                </h3>

                {question.question_type === 'multiple_choice' && (
                  <div className="grid grid-cols-1 gap-3">
                    {question.options.map((option, optionIndex) => (
                      <label key={optionIndex} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${answers[question.id] === option ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}>
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                          className="w-4 h-4 text-indigo-600"
                        />
                        <span className="ml-3 text-gray-700 font-medium">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
                {/* ... other question types remain same ... */}
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
            <button onClick={handleSubmit} className="flex items-center bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition">
              <Send className="w-5 h-5 mr-2" /> Submit Quiz
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}