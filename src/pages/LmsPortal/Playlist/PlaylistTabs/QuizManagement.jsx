import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Clock, Target, Shuffle, X, Upload } from "lucide-react";
import { fetchSessionQuiz } from "../../API/sessionApi";
import { createQuiz, updateQuiz, deleteQuiz, deleteMCQQuestion } from "../../API/quizApi";
import QuestionForm from "./QuestionForm";
import CSVUploadModal from "./CSVUploadModal";

export default function QuizManagement({ sessionId, onRefresh }) {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingQuiz, setEditingQuiz] = useState(false);
  const [removingQuestionId, setRemovingQuestionId] = useState(null);
  const [deletingQuestionId, setDeletingQuestionId] = useState(null);
  const [quizForm, setQuizForm] = useState({
    title: "",
    description: "",
    timeLimitSeconds: "",
    passingScorePercent: 60,
    shuffleQuestions: false,
  });

  useEffect(() => {
    loadQuiz();
  }, [sessionId]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      const quizData = await fetchSessionQuiz(sessionId);
      setQuiz(quizData);
      if (quizData) {
        setQuizForm({
          title: quizData.title || "",
          description: quizData.description || "",
          timeLimitSeconds: quizData.timeLimitSeconds || "",
          passingScorePercent: quizData.passingScorePercent || 60,
          shuffleQuestions: quizData.shuffleQuestions || false,
        });
      }
    } catch (error) {
      console.error("Error loading quiz:", error);
      setQuiz(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async () => {
    // Validate required fields
    if (!quizForm.title || !quizForm.title.trim()) {
      alert("Quiz title is required");
      return;
    }

    try {
      const payload = {
        sessionId,
        title: quizForm.title.trim(),
        questionIds: [], // Empty array - questions can be added later
        passingScorePercent: parseInt(quizForm.passingScorePercent) || 60,
        shuffleQuestions: quizForm.shuffleQuestions || false,
      };

      // Add optional fields only if they have values
      if (quizForm.description?.trim()) {
        payload.description = quizForm.description.trim();
      }
      if (quizForm.timeLimitSeconds) {
        payload.timeLimitSeconds = parseInt(quizForm.timeLimitSeconds);
      }

      await createQuiz(payload);
      await loadQuiz();
      setEditingQuiz(false);
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert(error.message || "Failed to create quiz");
    }
  };

  const handleUpdateQuiz = async () => {
    try {
      const payload = {};
      if (quizForm.title) payload.title = quizForm.title;
      if (quizForm.description !== undefined) payload.description = quizForm.description;
      if (quizForm.timeLimitSeconds)
        payload.timeLimitSeconds = parseInt(quizForm.timeLimitSeconds);
      if (quizForm.passingScorePercent !== undefined)
        payload.passingScorePercent = parseInt(quizForm.passingScorePercent);
      if (quizForm.shuffleQuestions !== undefined)
        payload.shuffleQuestions = quizForm.shuffleQuestions;

      await updateQuiz(quiz._id, payload);
      await loadQuiz();
      setEditingQuiz(false);
    } catch (error) {
      console.error("Error updating quiz:", error);
      alert(error.message || "Failed to update quiz");
    }
  };

  const handleDeleteQuiz = async () => {
    if (!confirm("Are you sure you want to delete this quiz? All questions will remain but won't be attached to this quiz.")) return;

    try {
      await deleteQuiz(quiz._id);
      setQuiz(null);
      setQuizForm({
        title: "",
        description: "",
        timeLimitSeconds: "",
        passingScorePercent: 60,
        shuffleQuestions: false,
      });
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
      alert(error.message || "Failed to delete quiz");
    }
  };

  const handleRemoveQuestionFromQuiz = async (questionId) => {
    if (!confirm("Remove this question from the quiz? The question will remain but won't be part of this quiz.")) return;

    try {
      setRemovingQuestionId(questionId);
      const currentQuestionIds = quiz.questionIds || [];
      const updatedQuestionIds = currentQuestionIds.filter(
        (id) => id.toString() !== questionId.toString()
      );

      await updateQuiz(quiz._id, { questionIds: updatedQuestionIds });
      await loadQuiz();
    } catch (error) {
      console.error("Error removing question:", error);
      alert(error.message || "Failed to remove question");
    } finally {
      setRemovingQuestionId(null);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!confirm("Are you sure you want to delete this question? This action cannot be undone.")) return;

    try {
      setDeletingQuestionId(questionId);
      await deleteMCQQuestion(questionId);
      await loadQuiz();
    } catch (error) {
      console.error("Error deleting question:", error);
      alert(error.message || "Failed to delete question");
    } finally {
      setDeletingQuestionId(null);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return "No limit";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  if (showQuestionForm || editingQuestion) {
    return (
      <QuestionForm
        quizId={quiz?._id}
        sessionId={sessionId}
        questionId={editingQuestion}
        onBack={() => {
          setShowQuestionForm(false);
          setEditingQuestion(null);
          loadQuiz();
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="mt-6 flex items-center justify-center py-12">
        <div className="text-gray-500">Loading quiz...</div>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Quiz Management</h2>
        {quiz && !editingQuiz && (
          <div className="flex gap-2">
            <button
              onClick={() => setEditingQuiz(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <Edit2 className="w-4 h-4" />
              Edit Quiz
            </button>
            <button
              onClick={handleDeleteQuiz}
              className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}
      </div>

      {editingQuiz ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">
            {quiz ? "Edit Quiz" : "Create Quiz"}
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quiz Title *
            </label>
            <input
              type="text"
              value={quizForm.title}
              onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter quiz title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={quizForm.description}
              onChange={(e) =>
                setQuizForm({ ...quizForm, description: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              placeholder="Enter quiz description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Limit (seconds)
              </label>
              <input
                type="number"
                value={quizForm.timeLimitSeconds}
                onChange={(e) =>
                  setQuizForm({ ...quizForm, timeLimitSeconds: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passing Score (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={quizForm.passingScorePercent}
                onChange={(e) =>
                  setQuizForm({
                    ...quizForm,
                    passingScorePercent: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="shuffle"
              checked={quizForm.shuffleQuestions}
              onChange={(e) =>
                setQuizForm({ ...quizForm, shuffleQuestions: e.target.checked })
              }
              className="w-4 h-4"
            />
            <label htmlFor="shuffle" className="text-sm text-gray-700">
              Shuffle Questions
            </label>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              onClick={quiz ? handleUpdateQuiz : handleCreateQuiz}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {quiz ? "Update Quiz" : "Create Quiz"}
            </button>
            <button
              onClick={() => {
                setEditingQuiz(false);
                if (quiz) {
                  loadQuiz();
                }
              }}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : !quiz ? (
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8">
          <div className="text-center space-y-4">
            <p className="text-gray-600">No quiz created for this session yet.</p>
            <button
              onClick={() => setEditingQuiz(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 mx-auto hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Create Quiz
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
            {quiz.description && (
              <p className="text-gray-600 text-sm">{quiz.description}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Time Limit</span>
              </div>
              <p className="text-lg font-semibold text-blue-700">
                {formatTime(quiz.timeLimitSeconds)}
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Passing Score</span>
              </div>
              <p className="text-lg font-semibold text-green-700">
                {quiz.passingScorePercent}%
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Shuffle className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Questions</span>
              </div>
              <p className="text-lg font-semibold text-purple-700">
                {quiz.questions?.length || 0}
              </p>
            </div>
          </div>

          {quiz.shuffleQuestions && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Shuffle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  Questions will be shuffled for each attempt
                </span>
              </div>
            </div>
          )}

          <div className="pt-4 border-t flex gap-2">
            <button
              onClick={() => setShowQuestionForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Add Question
            </button>
            <button
              onClick={() => setShowCSVUpload(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700"
            >
              <Upload className="w-5 h-5" />
              Upload CSV
            </button>
          </div>

          {quiz.questions && quiz.questions.length > 0 ? (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Questions ({quiz.questions.length}):</h4>
              <div className="space-y-3">
                {quiz.questions.map((question, index) => (
                  <div
                    key={question._id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 mb-2">{question.text}</p>
                        <div className="space-y-1 mb-3">
                          {question.options?.map((opt) => (
                            <div
                              key={opt.id}
                              className={`text-sm pl-4 ${
                                opt.id === question.correctOptionId
                                  ? "text-green-700 font-medium"
                                  : "text-gray-600"
                              }`}
                            >
                              <span className="font-medium">{opt.id.toUpperCase()}.</span> {opt.text}
                              {opt.id === question.correctOptionId && (
                                <span className="ml-2 text-green-600">✓ Correct</span>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {question.difficulty && (
                            <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded">
                              {question.difficulty}
                            </span>
                          )}
                          {question.tags && question.tags.length > 0 && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                              {question.tags.join(", ")}
                            </span>
                          )}
                          {question.hint && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                              Has Hint
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => setEditingQuestion(question._id)}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleRemoveQuestionFromQuiz(question._id)}
                          disabled={removingQuestionId === question._id}
                          className="px-3 py-1.5 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 disabled:opacity-50 flex items-center gap-1"
                        >
                          <X className="w-3 h-3" />
                          {removingQuestionId === question._id ? "Removing..." : "Remove"}
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question._id)}
                          disabled={deletingQuestionId === question._id}
                          className="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          {deletingQuestionId === question._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-4">No questions added yet</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowQuestionForm(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add First Question
                </button>
                <button
                  onClick={() => setShowCSVUpload(true)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload CSV
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CSV Upload Modal */}
      {showCSVUpload && (
        <CSVUploadModal
          quizId={quiz?._id}
          onClose={() => setShowCSVUpload(false)}
          onSuccess={() => {
            setShowCSVUpload(false);
            loadQuiz();
          }}
        />
      )}
    </div>
  );
}
