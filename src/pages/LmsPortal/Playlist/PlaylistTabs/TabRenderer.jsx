import VideoTab from "./VideoTab";
import NotesTab from "./NotesTab";
import PptTab from "./PptTab";
import TestTab from "./TestTab";

export default function TabRenderer({ activeTab, session, onRefresh }) {
  if (!session) {
    return <p className="text-gray-500 mt-6">Please select a session</p>;
  }

  switch (activeTab) {
    case "videos":
      return <VideoTab session={session} onRefresh={onRefresh} />;
    case "notes":
      return <NotesTab session={session} onRefresh={onRefresh} />;
    case "ppt":
      return <PptTab session={session} onRefresh={onRefresh} />;
    case "test":
      return <TestTab session={session} onRefresh={onRefresh} />;
    default:
      return null;
  }
}
