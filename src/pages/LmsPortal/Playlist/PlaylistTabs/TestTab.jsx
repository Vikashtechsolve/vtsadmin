import { Plus } from "lucide-react";
// import { useNavigate } from "react-router-dom";

export default function TestTab({ openQuestionForm }) {

    // const navigate = useNavigate();
  return (
    <div className="mt-6 space-y-4">

      <h2 className="text-xl font-semibold text-center">Test</h2>

      <input className="w-full border p-3 rounded-lg" placeholder="Test Description" />
      <input className="w-full border p-3 rounded-lg" placeholder="Test Duration" />

      <select className="w-full border p-3 rounded-lg">
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>

      <div className="bg-blue-50 p-6 rounded-xl">
        <div className="border p-4 rounded-lg mb-4">
          Add Questions - Question Title
        </div>
        <div className="border p-4 rounded-lg">
          Added Questions will appear here
        </div>
        <div>
            <button   onClick={openQuestionForm}
             className="bg-blue-600 p-2 flex gap-1 text-md rounded-xl mt-8 text-white">
                <Plus/>Create Test
            </button>

            
        </div>
      </div>
    </div>
  );
}
    