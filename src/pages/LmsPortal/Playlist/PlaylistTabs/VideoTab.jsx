import MediaManager from "./MediaManager";

export default function VideoTab({ session, onRefresh }) {
  const videoAsset = session?.video;

  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-xl font-semibold">Video Management</h2>
      <MediaManager
        type="video"
        label="Session Video"
        session={session}
        asset={videoAsset}
        onUpdate={onRefresh}
        accept="video/*"
        maxSizeMB={500}
      />
      {videoAsset?.durationSeconds && (
        <div className="text-sm text-gray-600 ml-4">
          Duration: {Math.floor(videoAsset.durationSeconds / 60)} minutes
      </div>
      )}
    </div>
  );
}
