import QuizManagement from "./QuizManagement";

export default function TestTab({ session, onRefresh }) {
  if (!session?._id) {
  return (
      <div className="mt-6">
        <p className="text-gray-500">Session not found</p>
    </div>
  );
  }

  return <QuizManagement sessionId={session._id} onBack={onRefresh} />;
}
    