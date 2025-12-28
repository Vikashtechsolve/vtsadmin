import { Outlet, useParams } from "react-router-dom";
import { useState } from "react";
import { playlists } from "../../API/playlistsData";
import LmsHeader from "../../LmsHeader";
import PlaylistTabs from "../PlaylistTabs/PlaylistTabs";
import TabRenderer from "../PlaylistTabs/TabRenderer";
import RightActivitySidebar from "../../RightActivitySidebar";
import PlaylistInfoSidebar from "../PlaylistInfoSidebar";
import QuestionForm from "./QuestionForm";

export default function SessionDetails() {
  const { playlistId, sid } = useParams();
  const [activeTab, setActiveTab] = useState("videos");
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  const playlist = playlists.find((p) => p.id === playlistId);

  const session = playlist?.modules
    .flatMap((m) => m.sessions)
    .find((s) => s.id === Number(sid));

  if (!playlist || !session) {
    return <p className="p-8">Session not found</p>;
  }

  return (
    <div className="px-8 py-6">
      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <LmsHeader />

          <h1 className="text-2xl font-semibold  text-red-600 mt-8">
            {playlist.title} Playlists
          </h1>

          <div className="mt-6 ">
            <PlaylistTabs onTabChange={setActiveTab} />
          </div>

          {/* <div className="mt-6">
            <Outlet context={{ playlist, session, activeTab }} />
          </div> */}

          <div className="mt-6">
            {!showQuestionForm ? (
              <TabRenderer
                activeTab={activeTab}
                playlist={playlist}
                session={session}
                openQuestionForm={() => setShowQuestionForm(true)}
              />
            ) : (
              <QuestionForm onBack={() => setShowQuestionForm(false)} />
            )}
          </div>

          {/* {showQuestionForm && (
            <div className="mt-6">
              <QuestionForm onBack={() => setShowQuestionForm(false)} />
            </div>
          )} */}
        </div>

        <div className="w-[320px] shrink-0 space-y-6 sticky top-6 h-fit">
          <PlaylistInfoSidebar playlist={playlist} />
          <RightActivitySidebar />
        </div>
      </div>
    </div>
  );
}
