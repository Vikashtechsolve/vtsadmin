import MediaManager from "./MediaManager";

export default function NotesTab({ session, onRefresh }) {
  // Find the single notes file (type === "notes")
  // API returns resources with 'asset' property when transformed
  const notesResource = session?.resources?.find(
    (r) => {
      if (!r) return false;
      
      // Handle both transformed format (r.asset) and raw populated format (r.assetId)
      const asset = r.asset || r.assetId;
      
      // Check if asset exists and has type property
      if (!asset) return false;
      
      // Handle both object and string ID cases
      if (typeof asset === 'object' && asset.type === "pdf") {
        return true;
      }
      
      // If asset is just an ID, we can't determine type here, skip
      return false;
    }
  );

  // Get the asset data if it exists (handle both transformed and raw formats)
  // Make sure we get the full asset object, not just the ID
  let notesAsset = null;
  if (notesResource) {
    notesAsset = notesResource.asset || (typeof notesResource.assetId === 'object' ? notesResource.assetId : null);
  }

  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-xl font-semibold">Notes Management</h2>
      <MediaManager
        type="notes"
        label={notesResource?.label || "Notes"}
        session={session}
        asset={notesAsset}
        onUpdate={onRefresh}
        accept=".pdf,.doc,.docx,.txt"
        maxSizeMB={50}
      />
    </div>
  );
}
