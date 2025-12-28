import React, { useEffect, useState } from "react";
import { playlists } from "../../API/playlistsData";

export default function VideoTab({ playlist,  session }) {
  const [video, setVideo] = useState(null);

  useEffect(() => {
    // simulate axios call
    const fetchVideo = async () => {
      await new Promise((res) => setTimeout(res, 300));

      const pl = playlists.find((p) => p.id === playlist.id);
      const sess = pl?.modules
        .flatMap((m) => m.sessions)
        .find((s) => s.id === session.id);

      setVideo(sess?.video || null);
    };

    fetchVideo();
  }, [playlist.id,  session.id]);

  if (!video) {
    return <p className="mt-6 text-gray-500">No video available</p>;
  }

  return (
    <div className="mt-6 px-8">
      <p className="text-sm text-gray-500 mb-2">
        Video Uploaded on: {video.uploadedOn}
      </p>

      <div className="aspect-video  border rounded-xl overflow-hidden">
        <iframe
          className="w-full h-full"
          src={video.url}
          allowFullScreen
          title={session.title}
        />
      </div>

      <div className="mt-4 bg-gray-100 p-4 rounded-lg text-sm">
        {playlist.title} | {session.title} {session.postedOn} 
      </div>
    </div>
  );
}
