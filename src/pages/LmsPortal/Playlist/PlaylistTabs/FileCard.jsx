import { FileVideo, FileText, Presentation, File, CheckCircle2 } from "lucide-react";

const fileTypeIcons = {
  video: FileVideo,
  pdf: FileText,
  ppt: Presentation,
  notes: File,
};

const fileTypeColors = {
  video: "bg-blue-50 border-blue-200 text-blue-700",
  pdf: "bg-red-50 border-red-200 text-red-700",
  ppt: "bg-orange-50 border-orange-200 text-orange-700",
  notes: "bg-green-50 border-green-200 text-green-700",
};

const fileTypeLabels = {
  video: "Video",
  pdf: "PDF",
  ppt: "PowerPoint",
  notes: "Notes",
};

export default function FileCard({ type, label, sizeBytes, uploadedAt, className = "" }) {
  const Icon = fileTypeIcons[type] || File;
  const colorClass = fileTypeColors[type] || "bg-gray-50 border-gray-200 text-gray-700";
  const displayLabel = label || fileTypeLabels[type] || "File";

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Unknown date";
    }
  };

  return (
    <div
      className={`border-2 rounded-xl p-4 flex items-start gap-4 ${colorClass} ${className}`}
    >
      <div className="flex-shrink-0">
        <Icon className="w-8 h-8" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-sm">{displayLabel}</h3>
          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
        </div>
        <div className="text-xs opacity-75 space-y-1">
          {sizeBytes && <div>Size: {formatFileSize(sizeBytes)}</div>}
          {uploadedAt && <div>Uploaded: {formatDate(uploadedAt)}</div>}
        </div>
      </div>
    </div>
  );
}

