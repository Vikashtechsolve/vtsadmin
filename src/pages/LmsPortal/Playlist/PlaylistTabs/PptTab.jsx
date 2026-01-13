import MediaManager from "./MediaManager";

export default function PptTab({ session, onRefresh }) {
  // Find the single PPT file (type === "ppt")
  // Note: We use type="ppt" to match backend expectations
  // API returns resources with 'asset' property when transformed
  const pptResource = session?.resources?.find(
    (r) => {
      if (!r) return false;
      
      // Handle both transformed format (r.asset) and raw populated format (r.assetId)
      const asset = r.asset || r.assetId;
      
      // Check if asset exists and has type property
      if (!asset) return false;
      
      // Handle both object and string ID cases
      if (typeof asset === 'object' && asset.type === "ppt") {
        return true;
      }
      
      // If asset is just an ID, we can't determine type here, skip
      return false;
    }
  );

  // Get the asset data if it exists (handle both transformed and raw formats)
  // Make sure we get the full asset object, not just the ID
  let pptAsset = null;
  if (pptResource) {
    pptAsset = pptResource.asset || (typeof pptResource.assetId === 'object' ? pptResource.assetId : null);
  }

  // Debug logging to help troubleshoot upload issues
  if (process.env.NODE_ENV === 'development') {
    console.log('PptTab - Session resources:', session?.resources);
    console.log('PptTab - Found PPT resource:', pptResource);
    console.log('PptTab - PPT asset:', pptAsset);
  }

  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-xl font-semibold">PowerPoint Management</h2>
      <MediaManager
        type="ppt"
        label={pptResource?.label || "PowerPoint Presentation"}
        session={session}
        asset={pptAsset}
        onUpdate={onRefresh}
        accept=".ppt,.pptx"
        maxSizeMB={100}
      />
    </div>
  );
}
