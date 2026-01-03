import { useState, useEffect } from "react";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { getMCQQuestionById, createMCQQuestion, updateMCQQuestion } from "../../API/quizApi";
import { getQuizById, updateQuiz } from "../../API/quizApi";

export default function QuestionForm({ quizId, sessionId, questionId, onBack }) {
  const [question, setQuestion] = useState({
    text: "",
    options: [
      { id: "a", text: "", explanation: "" },
      { id: "b", text: "", explanation: "" },
      { id: "c", text: "", explanation: "" },
      { id: "d", text: "", explanation: "" },
    ],
    correctOptionId: "",
    hint: "",
    tags: "",
    difficulty: "easy",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEditing = !!questionId;

  useEffect(() => {
    if (questionId) {
      loadQuestion();
    }
  }, [questionId]);

  const loadQuestion = async () => {
    try {
      setLoading(true);
      const questionData = await getMCQQuestionById(questionId);
      if (questionData) {
        setQuestion({
          text: questionData.text || "",
          options: questionData.options || [
            { id: "a", text: "", explanation: "" },
            { id: "b", text: "", explanation: "" },
            { id: "c", text: "", explanation: "" },
            { id: "d", text: "", explanation: "" },
          ],
          correctOptionId: questionData.correctOptionId || "",
          hint: questionData.hint || "",
          tags: Array.isArray(questionData.tags) ? questionData.tags.join(", ") : questionData.tags || "",
          difficulty: questionData.difficulty || "easy",
        });
      }
    } catch (error) {
      console.error("Error loading question:", error);
      alert(error.message || "Failed to load question");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...question.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setQuestion({ ...question, options: newOptions });
  };

  const handleAddOption = () => {
    const newId = String.fromCharCode(97 + question.options.length); // a, b, c, d, e...
    setQuestion({
      ...question,
      options: [...question.options, { id: newId, text: "", explanation: "" }],
    });
  };

  const handleRemoveOption = (index) => {
    if (question.options.length <= 2) {
      alert("At least 2 options are required");
      return;
    }
    const newOptions = question.options.filter((_, i) => i !== index);
    setQuestion({
      ...question,
      options: newOptions,
      correctOptionId:
        question.correctOptionId === question.options[index].id
          ? ""
          : question.correctOptionId,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.text.trim()) {
      alert("Question text is required");
      return;
    }

    if (!question.correctOptionId) {
      alert("Please select the correct answer");
      return;
    }

    const options = question.options.filter((opt) => opt.text.trim());
    if (options.length < 2) {
      alert("At least 2 options are required");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        text: question.text.trim(),
        options: options,
        correctOptionId: question.correctOptionId,
        hint: question.hint.trim() || undefined,
        difficulty: question.difficulty,
        tags: question.tags
          ? question.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        quizId: quizId || undefined,
      };

      if (isEditing) {
        // Update existing question
        await updateMCQQuestion(questionId, payload);
        alert("Question updated successfully!");
      } else {
        // Create new question
        const createdQuestion = await createMCQQuestion(payload);

        // If quizId exists, add this question to the quiz
        if (quizId && createdQuestion?._id) {
          try {
            const quizData = await getQuizById(quizId);
            if (quizData) {
              const currentQuestionIds = quizData.questionIds || [];
              await updateQuiz(quizId, {
                questionIds: [...currentQuestionIds, createdQuestion._id],
              });
            }
          } catch (err) {
            console.error("Error adding question to quiz:", err);
            // Question is created, but not added to quiz - user can add manually
          }
        }

        alert("Question created successfully!");
      }

      if (onBack) {
        onBack();
      }
    } catch (error) {
      console.error(`Error ${isEditing ? "updating" : "creating"} question:`, error);
      alert(error.message || `Failed to ${isEditing ? "update" : "create"} question`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border rounded-xl p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading question...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {isEditing ? "Edit Question" : "Add Question"}
        </h2>
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question Text *
          </label>
          <textarea
            value={question.text}
            onChange={(e) => setQuestion({ ...question, text: e.target.value })}
            placeholder="Enter your question here"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="3"
            required
          />
        </div>

        {/* Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Options *
          </label>
          <div className="space-y-3">
            {question.options.map((option, index) => (
          <div
                key={index}
                className={`border-2 rounded-lg p-4 space-y-2 ${
                  question.correctOptionId === option.id
                    ? "bg-green-50 border-green-300"
                    : "bg-blue-50 border-blue-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctAnswer"
                    value={option.id}
                    checked={question.correctOptionId === option.id}
                    onChange={(e) =>
                      setQuestion({
                        ...question,
                        correctOptionId: e.target.value,
                      })
                    }
                    className="w-4 h-4"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Option {option.id.toUpperCase()} (Correct Answer)
                  </label>
                  {question.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="ml-auto text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
            <input
              type="text"
                  value={option.text}
                  onChange={(e) =>
                    handleOptionChange(index, "text", e.target.value)
                  }
                  placeholder={`Option ${option.id.toUpperCase()} text`}
                  className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-300"
            />
            <textarea
                  value={option.explanation}
                  onChange={(e) =>
                    handleOptionChange(index, "explanation", e.target.value)
                  }
                  placeholder={`Explanation for Option ${option.id.toUpperCase()} (optional)`}
              rows="2"
                  className="w-full border rounded-md px-4 py-2 resize-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        ))}
          </div>
          <button
            type="button"
            onClick={handleAddOption}
            className="mt-2 px-4 py-2 text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Option
          </button>
        </div>

        {/* Hint */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hint (optional)
          </label>
          <input
            type="text"
            value={question.hint}
            onChange={(e) => setQuestion({ ...question, hint: e.target.value })}
            placeholder="Provide a hint for this question"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags (comma-separated, optional)
          </label>
          <input
            type="text"
            value={question.tags}
            onChange={(e) => setQuestion({ ...question, tags: e.target.value })}
            placeholder="e.g., arrays, dsa, time-complexity"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Difficulty Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty Level
          </label>
          <select
            value={question.difficulty}
            onChange={(e) =>
              setQuestion({ ...question, difficulty: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Question"}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
      </div>
      </form>
    </div>
  );
}
