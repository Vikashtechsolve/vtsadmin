import VideoTab from "./VideoTab";
import NotesTab from "./NotesTab";
import PptTab from "./PptTab";
import TestTab from "./TestTab";
import QuestionForm from "./QuestionForm";

export default function TabRenderer({
  activeTab,
  playlist,
  session,
  openQuestionForm,
}) {

  if (!session) {
    return <p className="text-gray-500 mt-6">Please select a session</p>;
  }

  switch (activeTab) {
    case "videos":
      return <VideoTab playlist={playlist} session={session} />;
    case "notes":
      return <NotesTab playlist={playlist} session={session} />;
    case "ppt":
      return <PptTab playlist={playlist} session={session} />;
    case "test":
      return <TestTab playlist={playlist} session={session} openQuestionForm={openQuestionForm} />;
    default:
      return null;
  }
}
