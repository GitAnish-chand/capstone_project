import api from '../config/Authservice';

export const authService = {
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data) => {
    const response = await api.post('/auth/login', data);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export const courseService = {
  getAll: async (params = {}) => {
    const response = await api.get('/courses/', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  search: async (query) => {
    const response = await api.get(`/courses/search?q=${query}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/courses/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/courses/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },
};

export const moduleService = {
  getByCourse: async (courseId) => {
    const response = await api.get(`/modules/course/${courseId}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/modules/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/modules/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/modules/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/modules/${id}`);
    return response.data;
  },
};

export const enrollmentService = {
  getMyEnrollments: async () => {
    const response = await api.get('/enrollments/');
    return response.data;
  },

  enroll: async (courseId) => {
    const response = await api.post('/enrollments/', { course_id: courseId });
    return response.data;
  },

  unenroll: async (courseId) => {
    const response = await api.delete(`/enrollments/${courseId}`);
    return response.data;
  },

  updateProgress: async (courseId, progress) => {
    const response = await api.put(`/enrollments/${courseId}/progress`, {
      progress_percent: progress,
    });
    return response.data;
  },

  getProgress: async (courseId) => {
    const response = await api.get(`/enrollments/${courseId}/progress`);
    return response.data;
  },
};

export const quizService = {
  reset: async (quizId) => {
    const response = await api.delete(`/quizzes/${quizId}/reset`);
    return response.data;
  },
  getByCourse: async (courseId) => {
    const response = await api.get(`/quizzes/course/${courseId}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
  },

  submit: async (quizId, answers) => {
    const response = await api.post(`/quizzes/${quizId}/submit`, { answers });
    return response.data;
  },

  getMyResults: async (courseId) => {
    const params = courseId ? { course_id: courseId } : {};
    const response = await api.get('/quizzes/results/my-results', { params });
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/quizzes/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/quizzes/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/quizzes/${id}`);
    return response.data;
  },
};

export const reportService = {
  generateUserProgress: async () => {
    const response = await api.post('/reports/user-progress');
    return response.data;
  },

  generateCourseEngagement: async () => {
    const response = await api.post('/reports/course-engagement');
    return response.data;
  },

  generatePerformance: async () => {
    const response = await api.post('/reports/performance');
    return response.data;
  },

  getAll: async (type) => {
    const params = type ? { report_type: type } : {};
    const response = await api.get('/reports/', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },
};

export const chatService = {
  ask: async (question, context = 'general', courseId = null) => {
    const response = await api.post('/chat/ask', {
      question,
      context,
      course_id: courseId,
    });
    return response.data;
  },

  getHistory: async (limit = 50) => {
    const response = await api.get('/chat/history', { params: { limit } });
    return response.data;
  },

  getCourseHistory: async (courseId) => {
    const response = await api.get(`/chat/history/course/${courseId}`);
    return response.data;
  },
};





