import { lmsApi } from "../../../services/apiService";

/**
 * Create a new MCQ question
 * @param {Object} questionData - Question data
 * @returns {Promise} Created question
 */
export const createMCQQuestion = async (questionData) => {
  try {
    const response = await lmsApi.post("/admin/mcq-questions", questionData);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to create MCQ question");
  } catch (error) {
    console.error("Error creating MCQ question:", error);
    throw error;
  }
};

/**
 * Get MCQ questions with filters
 * @param {Object} filters - Filter options (quizId, difficulty, search, page, limit)
 * @returns {Promise} List of questions
 */
export const getMCQQuestions = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.quizId) params.append("quizId", filters.quizId);
    if (filters.difficulty) params.append("difficulty", filters.difficulty);
    if (filters.search) params.append("search", filters.search);
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);

    const response = await lmsApi.get(`/admin/mcq-questions?${params.toString()}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to fetch MCQ questions");
  } catch (error) {
    console.error("Error fetching MCQ questions:", error);
    throw error;
  }
};

/**
 * Get MCQ question by ID
 * @param {string} questionId - Question ID
 * @returns {Promise} Question details
 */
export const getMCQQuestionById = async (questionId) => {
  try {
    const response = await lmsApi.get(`/admin/mcq-questions/${questionId}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to fetch MCQ question");
  } catch (error) {
    console.error("Error fetching MCQ question:", error);
    throw error;
  }
};

/**
 * Update MCQ question
 * @param {string} questionId - Question ID
 * @param {Object} questionData - Updated question data
 * @returns {Promise} Updated question
 */
export const updateMCQQuestion = async (questionId, questionData) => {
  try {
    const response = await lmsApi.put(`/admin/mcq-questions/${questionId}`, questionData);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to update MCQ question");
  } catch (error) {
    console.error("Error updating MCQ question:", error);
    throw error;
  }
};

/**
 * Delete MCQ question
 * @param {string} questionId - Question ID
 * @returns {Promise} Success message
 */
export const deleteMCQQuestion = async (questionId) => {
  try {
    const response = await lmsApi.delete(`/admin/mcq-questions/${questionId}`);
    if (response.success) {
      return response.message || "MCQ question deleted successfully";
    }
    throw new Error(response.message || "Failed to delete MCQ question");
  } catch (error) {
    console.error("Error deleting MCQ question:", error);
    throw error;
  }
};

/**
 * Create a quiz
 * @param {Object} quizData - Quiz data
 * @returns {Promise} Created quiz
 */
export const createQuiz = async (quizData) => {
  try {
    const response = await lmsApi.post("/admin/quizzes", quizData);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to create quiz");
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
};

/**
 * Get quiz by ID
 * @param {string} quizId - Quiz ID
 * @returns {Promise} Quiz details
 */
export const getQuizById = async (quizId) => {
  try {
    const response = await lmsApi.get(`/admin/quizzes/${quizId}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to fetch quiz");
  } catch (error) {
    console.error("Error fetching quiz:", error);
    throw error;
  }
};

/**
 * Update quiz
 * @param {string} quizId - Quiz ID
 * @param {Object} quizData - Updated quiz data
 * @returns {Promise} Updated quiz
 */
export const updateQuiz = async (quizId, quizData) => {
  try {
    const response = await lmsApi.put(`/admin/quizzes/${quizId}`, quizData);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to update quiz");
  } catch (error) {
    console.error("Error updating quiz:", error);
    throw error;
  }
};

/**
 * Delete quiz
 * @param {string} quizId - Quiz ID
 * @returns {Promise} Success message
 */
export const deleteQuiz = async (quizId) => {
  try {
    const response = await lmsApi.delete(`/admin/quizzes/${quizId}`);
    if (response.success) {
      return response.message || "Quiz deleted successfully";
    }
    throw new Error(response.message || "Failed to delete quiz");
  } catch (error) {
    console.error("Error deleting quiz:", error);
    throw error;
  }
};

