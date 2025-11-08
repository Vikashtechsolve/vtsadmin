import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";

// Fallback local JSON if fetch fails
import localData from "../../data/doubtSolvingData.json";

import DoubtSolvingIntroCard from "./DoubtSolvingIntroCard";
import DoubtSolvingDashboard from "./DoubtSolvingDashboard";
import DoubtSolvingDetails from "./DoubtSolvingDetails";
import DoubtSolvingRightPanel from "./DoubtSolvingRightPanel";
import AddDoubtSessionForm from "./AddDoubtSessionForm";
import EditDoubtSessionForm from "./EditDoubtSessionForm";

const DoubtSolving = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Load JSON (remote first, local fallback)
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/data/doubtSolvingData.json");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        } else {
          setData(localData);
        }
      } catch {
        setData(localData);
      }
    };
    loadData();
  }, []);

  // Add new session (into the date bucket)
  const handleAdd = (newSession) => {
    setData((prev) => {
      const existsIdx = prev.sessions.findIndex(
        (g) => g.date === newSession.date
      );
      if (existsIdx >= 0) {
        const updated = [...prev.sessions];
        updated[existsIdx] = {
          ...updated[existsIdx],
          details: [...updated[existsIdx].details, newSession],
        };
        return { ...prev, sessions: updated };
      }
      return {
        ...prev,
        sessions: [...prev.sessions, { date: newSession.date, details: [newSession] }],
      };
    });
  };

  // Save edit
  const handleSaveEdit = (updated) => {
    setData((prev) => ({
      ...prev,
      sessions: prev.sessions.map((group) => ({
        ...group,
        details: group.details.map((s) => (s.id === updated.id ? updated : s)),
      })),
    }));
  };

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading Doubt Solving Sessions...
      </div>
    );
  }

  // Flatten for finding a single session by id
  const flat = data.sessions.flatMap((g) =>
    g.details.map((d) => ({ ...d, _groupDate: g.date }))
  );
  const session = id ? flat.find((d) => d.id === parseInt(id, 10)) : null;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <div className="flex-1 p-6 lg:p-10">
        {!id ? (
          <>
            <DoubtSolvingIntroCard />
            <DoubtSolvingDashboard
              data={data}
              onAdd={() => setShowAdd(true)}
              onEdit={(item) => {
                setEditItem(item);
                setShowEdit(true);
              }}
              onView={(sid) => navigate(`/programs/doubt-solving/view/${sid}`)}
            />
          </>
        ) : (
          <DoubtSolvingDetails
            session={session}
            onBack={() => navigate(-1)}
          />
        )}
      </div>

      <DoubtSolvingRightPanel
        data={data}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {/* Modals */}
      <AddDoubtSessionForm
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={handleAdd}
        nextIdHint={flat.length ? Math.max(...flat.map((x) => x.id)) + 1 : 1}
      />
      <EditDoubtSessionForm
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        session={editItem}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default DoubtSolving;
