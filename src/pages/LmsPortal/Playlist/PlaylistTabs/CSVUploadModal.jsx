import { useState, useRef } from "react";
import { Upload, X, FileText, CheckCircle, AlertCircle, Download } from "lucide-react";
import { createBulkMCQQuestions } from "../../API/quizApi";

/**
 * CSV Upload Modal Component for Bulk MCQ Question Import
 * 
 * Expected CSV Format:
 * Question body, Option 1, Option 1 explanation, Option 2, Option 2 explanation, Option 3, Option 3 explanation, Option 4, Option 4 explanation, Hint, Correct option (1/2/3/4), Difficulty
 */
export default function CSVUploadModal({ quizId, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef(null);

  // CSV Template for download
  const csvTemplate = `Question body,Option 1,Option 1 explanation,Option 2,Option 2 explanation,Option 3,Option 3 explanation,Option 4,Option 4 explanation,Hint,Correct option,Difficulty
"What is the time complexity of accessing an array element by index?","O(1)","Constant time access","O(n)","Linear time","O(log n)","Logarithmic time","O(n²)","Quadratic time","Array access by index is constant time","1","easy"
"Which data structure follows LIFO principle?","Queue","Queue follows FIFO","Stack","Stack follows Last In First Out","Array","Array doesn't follow LIFO","Linked List","Linked List doesn't follow LIFO","Stack is a LIFO data structure","2","medium"`;

  const downloadTemplate = () => {
    const blob = new Blob([csvTemplate], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "mcq_template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseCSV = (csvText) => {
    const lines = csvText.split("\n").filter(line => line.trim());
    if (lines.length < 2) {
      throw new Error("CSV must have at least a header row and one data row");
    }

    const questions = [];

    // Helper function to parse CSV line with proper quote handling
    const parseCSVLine = (line) => {
      const values = [];
      let currentValue = "";
      let inQuotes = false;

      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        const nextChar = line[j + 1];

        if (char === '"') {
          if (inQuotes && nextChar === '"') {
            // Escaped quote
            currentValue += '"';
            j++; // Skip next quote
          } else {
            // Toggle quote state
            inQuotes = !inQuotes;
          }
        } else if (char === "," && !inQuotes) {
          values.push(currentValue.trim());
          currentValue = "";
        } else {
          currentValue += char;
        }
      }
      values.push(currentValue.trim()); // Add last value
      return values;
    };

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue; // Skip empty lines

      const values = parseCSVLine(line);

      // Map values to question object based on format:
      // Question body, Option 1, Option 1 explanation, Option 2, Option 2 explanation, 
      // Option 3, Option 3 explanation, Option 4, Option 4 explanation, Hint, Correct option, Difficulty
      const questionText = (values[0] || "").replace(/^"|"$/g, "").trim();
      const option1 = (values[1] || "").replace(/^"|"$/g, "").trim();
      const option1Explanation = (values[2] || "").replace(/^"|"$/g, "").trim();
      const option2 = (values[3] || "").replace(/^"|"$/g, "").trim();
      const option2Explanation = (values[4] || "").replace(/^"|"$/g, "").trim();
      const option3 = (values[5] || "").replace(/^"|"$/g, "").trim();
      const option3Explanation = (values[6] || "").replace(/^"|"$/g, "").trim();
      const option4 = (values[7] || "").replace(/^"|"$/g, "").trim();
      const option4Explanation = (values[8] || "").replace(/^"|"$/g, "").trim();
      const hint = (values[9] || "").replace(/^"|"$/g, "").trim();
      const correctOption = (values[10] || "").replace(/^"|"$/g, "").trim();
      const difficulty = ((values[11] || "").replace(/^"|"$/g, "").trim() || "easy").toLowerCase();

      // Validate required fields
      if (!questionText) {
        throw new Error(`Row ${i + 1}: Question body is required`);
      }

      if (!option1 || !option2) {
        throw new Error(`Row ${i + 1}: At least Option 1 and Option 2 are required`);
      }

      // Validate correct option (should be 1, 2, 3, or 4)
      const correctOptionNum = parseInt(correctOption);
      if (!correctOption || isNaN(correctOptionNum) || correctOptionNum < 1 || correctOptionNum > 4) {
        throw new Error(`Row ${i + 1}: Correct option must be 1, 2, 3, or 4`);
      }

      // Build options array
      const options = [
        { id: "a", text: option1, explanation: option1Explanation || undefined },
        { id: "b", text: option2, explanation: option2Explanation || undefined },
      ];
      
      if (option3) {
        options.push({ id: "c", text: option3, explanation: option3Explanation || undefined });
      }
      if (option4) {
        options.push({ id: "d", text: option4, explanation: option4Explanation || undefined });
      }

      // Validate that correct option exists (if correct option is 3 or 4, those options must exist)
      if (correctOptionNum === 3 && !option3) {
        throw new Error(`Row ${i + 1}: Correct option is 3, but Option 3 is empty`);
      }
      if (correctOptionNum === 4 && !option4) {
        throw new Error(`Row ${i + 1}: Correct option is 4, but Option 4 is empty`);
      }

      // Map correct option number (1-4) to letter (a-d)
      const correctOptionId = String.fromCharCode(96 + correctOptionNum); // 1->a, 2->b, 3->c, 4->d

      // Validate difficulty
      const validDifficulties = ["easy", "medium", "hard"];
      const finalDifficulty = validDifficulties.includes(difficulty) ? difficulty : "easy";

      questions.push({
        text: questionText,
        options: options,
        correctOptionId: correctOptionId,
        hint: hint || undefined,
        difficulty: finalDifficulty,
        tags: [], // No tags column in this format
      });
    }

    return questions;
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      alert("Please select a CSV file");
      return;
    }

    setFile(selectedFile);
    setErrors([]);
    setSuccess(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvText = event.target.result;
        const questions = parseCSV(csvText);
        setPreview({
          questions,
          count: questions.length,
        });
      } catch (error) {
        setErrors([error.message]);
        setPreview(null);
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleUpload = async () => {
    if (!preview || preview.questions.length === 0) {
      alert("Please select a valid CSV file first");
      return;
    }

    setUploading(true);
    setErrors([]);
    setSuccess(null);

    try {
      const result = await createBulkMCQQuestions(preview.questions, quizId);
      
      setSuccess({
        created: result.createdCount || 0,
        errors: result.errorCount || 0,
        total: result.totalProcessed || 0,
        errorDetails: result.errors || [],
      });

      if (result.createdCount > 0 && onSuccess) {
        // Wait a bit before calling onSuccess to show success message
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (error) {
      setErrors([error.message || "Failed to upload questions"]);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">Upload MCQ Questions from CSV</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">CSV Format Instructions:</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Required columns: Question body, Option 1, Option 2, Correct option (1/2/3/4)</li>
              <li>Optional columns: Option 3, Option 4, Option explanations, Hint, Difficulty (easy/medium/hard)</li>
              <li>Column order: Question body, Option 1, Option 1 explanation, Option 2, Option 2 explanation, Option 3, Option 3 explanation, Option 4, Option 4 explanation, Hint, Correct option, Difficulty</li>
              <li>First row must be headers</li>
              <li>Use quotes for text containing commas</li>
              <li>Correct option must be 1, 2, 3, or 4 (not a, b, c, d)</li>
            </ul>
            <button
              onClick={downloadTemplate}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 text-sm"
            >
              <Download className="w-4 h-4" />
              Download CSV Template
            </button>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select CSV File
            </label>
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
              >
                <Upload className="w-5 h-5" />
                {file ? file.name : "Choose File"}
              </button>
              {file && (
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                    setErrors([]);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="px-4 py-2 text-red-600 hover:text-red-800"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Preview */}
          {preview && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-800">
                  Preview: {preview.count} question(s) found
                </h3>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-3">
                {preview.questions.slice(0, 5).map((q, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-3 text-sm">
                    <p className="font-medium text-gray-900 mb-2">
                      {idx + 1}. {q.text}
                    </p>
                    <div className="space-y-1 ml-4">
                      {q.options.map((opt) => (
                        <div
                          key={opt.id}
                          className={`${
                            opt.id === q.correctOptionId
                              ? "text-green-700 font-medium"
                              : "text-gray-600"
                          }`}
                        >
                          {opt.id.toUpperCase()}. {opt.text}
                          {opt.id === q.correctOptionId && (
                            <span className="ml-2 text-green-600">✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                    {q.difficulty && (
                      <div className="mt-2 text-xs text-gray-500">
                        Difficulty: {q.difficulty}
                        {q.tags && q.tags.length > 0 && (
                          <span className="ml-2">Tags: {q.tags.join(", ")}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {preview.questions.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">
                    ... and {preview.questions.length - 5} more question(s)
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-red-900">Errors:</h3>
              </div>
              <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
                {errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-900">Upload Complete!</h3>
              </div>
              <div className="text-sm text-green-800 space-y-1">
                <p>✓ Successfully created: {success.created} question(s)</p>
                {success.errors > 0 && (
                  <p className="text-red-600">
                    ✗ Failed: {success.errors} question(s)
                  </p>
                )}
                {success.errorDetails && success.errorDetails.length > 0 && (
                  <div className="mt-2 text-xs">
                    <p className="font-medium">Error Details:</p>
                    <ul className="list-disc list-inside">
                      {success.errorDetails.map((err, idx) => (
                        <li key={idx}>
                          Row {err.index}: {err.error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={handleUpload}
              disabled={!preview || uploading || success}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Questions
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              {success ? "Close" : "Cancel"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

