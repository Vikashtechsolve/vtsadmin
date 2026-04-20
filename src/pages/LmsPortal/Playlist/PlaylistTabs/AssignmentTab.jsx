import { useState } from "react";
import MediaManager from "./MediaManager";

export default function AssignmentTab({ session, onRefresh }) {
  // Find assignment resources (label === "Assignment" or contains "Assignment")
  const assignmentResource = session?.resources?.find(
    (r) => {
      if (!r) return false;
      
      // Check if label contains "Assignment" (case-insensitive)
      const label = r.label || "";
      if (label.toLowerCase().includes("assignment")) {
        return true;
      }
      
      return false;
    }
  );

  // Get the asset data if it exists (handle both transformed and raw formats)
  let assignmentAsset = null;
  if (assignmentResource) {
    assignmentAsset = assignmentResource.asset || (typeof assignmentResource.assetId === 'object' ? assignmentResource.assetId : null);
  }

  // Determine file type based on existing asset or default to zip
  let fileType = "zip"; // Default to zip for assignments
  if (assignmentAsset && typeof assignmentAsset === 'object') {
    // Use the asset type if available
    fileType = assignmentAsset.type || "zip";
  }

  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-xl font-semibold">Assignment Management</h2>
      <MediaManager
        type={fileType}
        label="Assignment"
        session={session}
        asset={assignmentAsset}
        onUpdate={onRefresh}
        accept=".pdf,.zip,.doc,.docx,.txt"
        maxSizeMB={50}
      />
    </div>
  );
}

