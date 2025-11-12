import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";

import localData from "../../data/doubtSolvingData.json";
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

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/data/doubtSolvingData.json");
        setData(res.ok ? await res.json() : localData);
      } catch {
        setData(localData);
      }
    };
    load();
  }, []);

  const handleAdd = (newSession) => {
    setData((prev) => {
      const updated = { ...prev };
      const idx = updated.sessions.findIndex((g) => g.date === newSession.date);
      if (idx >= 0) updated.sessions[idx].details.push(newSession);
      else updated.sessions.push({ date: newSession.date, details: [newSession] });
      return updated;
    });
  };

  const handleSaveEdit = (updatedSession) => {
    setData((prev) => ({
      ...prev,
      sessions: prev.sessions.map((group) => ({
        ...group,
        details: group.details.map((d) =>
          d.id === updatedSession.id ? { ...d, ...updatedSession } : d
        ),
      })),
    }));
  };

  if (!data)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading sessions...
      </div>
    );

  const flat = data.sessions.flatMap((g) =>
    g.details.map((d) => ({ ...d, _groupDate: g.date }))
  );
  const selected = id ? flat.find((s) => s.id === parseInt(id)) : null;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Left main section */}
      <div className="flex-1 p-4 sm:p-6 lg:p-10">
        {!id ? (
          <DoubtSolvingDashboard
            data={data}
            onAdd={() => setShowAdd(true)}
            onEdit={(s) => {
              setEditItem(s);
              setShowEdit(true);
            }}
            onView={(sid) => navigate(`/programs/doubt-solving/view/${sid}`)}
          />
        ) : (
          <DoubtSolvingDetails
            session={selected}
            onBack={() => navigate("/programs/doubt-solving")}
          />
        )}
      </div>

      {/* Right panel (collapses on mobile) */}
      <div className="hidden lg:block w-[320px] bg-white">
        <DoubtSolvingRightPanel
          data={data}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>

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
