export default function QuestionForm() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow p-6 space-y-6">

        {/* Title */}
        <h2 className="text-xl font-semibold text-center">Questions</h2>

        {/* Question Title */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Question Title
          </label>
          <input
            type="text"
            placeholder="Question Title"
            className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Options */}
        {[1, 2, 3, 4].map((opt) => (
          <div
            key={opt}
            className="border rounded-lg p-4 space-y-3"
          >
            <input
              type="text"
              placeholder={`Option ${opt}`}
              className="w-full bg-blue-50 border border-blue-100 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-300"
            />

            <textarea
              placeholder={`Description for Option ${opt}`}
              rows="2"
              className="w-full bg-blue-50 border border-blue-100 rounded-md px-4 py-2 outline-none resize-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        ))}

        {/* Correct Answer */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Correct Answer
          </label>
          <input
            type="text"
            placeholder="Show Correct Answer Here"
            className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Hint */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Hint
          </label>
          <input
            type="text"
            placeholder="Write Hint Here"
            className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Tags
          </label>
          <input
            type="text"
            placeholder="Write Tags Here"
            className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Difficulty Level */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Test Difficulty Level
          </label>
          <select className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400">
            <option value="">Test Difficulty Level</option>
            <option >Easy</option>
            <option>Moderate</option>
            <option>Hard</option>
          </select>
        </div>

      </div>
    </div>
  );
}
