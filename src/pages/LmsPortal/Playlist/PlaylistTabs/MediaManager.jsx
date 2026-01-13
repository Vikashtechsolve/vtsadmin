import { useState } from "react";
import { Upload, Trash2, X, CheckCircle2, AlertCircle } from "lucide-react";
import { uploadMediaAsset, deleteMediaAsset } from "../../API/mediaApi";
import FileCard from "./FileCard";

export default function MediaManager({
  type,
  label,
  session,
  asset,
  onUpdate,
  accept = "*/*",
  maxSizeMB = 500,
}) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [customLabel, setCustomLabel] = useState(label || "");

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Check file size
    const fileSizeMB = selectedFile.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    // Validate sessionId for PDF/PPT uploads
    if ((type === "pdf" || type === "ppt") && !session?._id) {
      setError("Session ID is required for PDF/PPT uploads. Please ensure you're uploading from a valid session.");
      console.error("❌ Missing sessionId for PDF/PPT upload:", { type, session });
      return;
    }

    if (!session?.playlistId) {
      setError("Playlist ID is required for uploads.");
      console.error("❌ Missing playlistId:", { session });
      return;
    }

    try {
      setUploading(true);
      setError(null);

      await uploadMediaAsset({
        file,
        type,
        sessionId: session._id,
        playlistId: session.playlistId,
        moduleId: session.moduleId,
        label: customLabel || label || undefined,
        convertToHls: type === "video",
        downloadable: false,
      });

      setFile(null);
      setShowUpload(false);
      if (onUpdate) {
        await onUpdate();
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }

    try {
      setDeleting(true);
      setError(null);

      // Handle both asset._id (transformed) and asset (raw) formats
      const assetId = asset._id || asset;
      await deleteMediaAsset(assetId);

      if (onUpdate) {
        await onUpdate();
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message || "Failed to delete file");
    } finally {
      setDeleting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {asset && asset._id ? (
        <div className="space-y-3">
          <FileCard
            type={type}
            label={label || asset.label}
            sizeBytes={asset.sizeBytes}
            uploadedAt={asset.createdAt || session?.createdAt}
          />
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {!showUpload ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <p className="text-gray-500 mb-4">No {type} uploaded</p>
              <button
                onClick={() => setShowUpload(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 mx-auto hover:bg-blue-700"
              >
                <Upload className="w-5 h-5" />
                Upload {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            </div>
          ) : (
            <div className="bg-white border rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Upload {type.charAt(0).toUpperCase() + type.slice(1)}</h3>
                <button
                  onClick={() => {
                    setShowUpload(false);
                    setFile(null);
                    setError(null);
                    setCustomLabel(label || "");
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select File
                </label>
                <input
                  type="file"
                  accept={accept}
                  onChange={handleFileSelect}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {file && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>{file.name}</span>
                    <span className="text-gray-400">
                      ({formatFileSize(file.size)})
                    </span>
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Max size: {maxSizeMB}MB
                </p>
              </div>

              {type !== "video" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Label (optional)
                  </label>
                  <input
                    type="text"
                    value={customLabel}
                    onChange={(e) => setCustomLabel(e.target.value)}
                    placeholder={`e.g., ${type === "pdf" ? "PDF Notes" : type === "ppt" ? "Slides" : "Notes"}`}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
                <button
                  onClick={() => {
                    setShowUpload(false);
                    setFile(null);
                    setError(null);
                    setCustomLabel(label || "");
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

