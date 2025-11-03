import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import localData from "../data/masterClassData.json";

import MasterClassDashboard from "../components/MasterClassDashboard";
import MasterClassDetails from "../components/MasterClassDetails";
import MasterClassRightPanel from "../components/MasterClassRightPanel";
import MasterClassIntroCard from "../components/MasterClassIntroCard";
import AddMasterClassForm from "../components/AddMasterClassForm";
import EditMasterClassForm from "../components/EditMasterClassForm";

const MasterClasses = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState(null);

  // ✅ Load JSON Data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/data/masterClassData.json");
        if (response.ok) {
          const json = await response.json();
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

  // ✅ Add Event Handler
  const handleAddEvent = (newEvent) => {
    setData((prev) => ({
      ...prev,
      upcomingEvents: [...prev.upcomingEvents, newEvent],
    }));
  };

  // ✅ Edit Event Handler
  const handleSaveEdit = (updatedEvent) => {
    setData((prev) => ({
      ...prev,
      upcomingEvents: prev.upcomingEvents.map((e) =>
        e.id === updatedEvent.id ? updatedEvent : e
      ),
    }));
  };

  if (!data)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading Master Classes...
      </div>
    );

  // ✅ Find event if we're in "view mode"
  const event =
    id &&
    (data.upcomingEvents.find((e) => e.id === parseInt(id)) ||
      data.pastEvents.find((e) => e.id === parseInt(id)));

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <div className="flex-1 p-6 lg:p-10">
        {/* ✅ Conditional view: Dashboard or Single Event */}
        {!id ? (
          <>
            {/* Top Intro Card */}
            <MasterClassIntroCard />

            {/* Dashboard Section */}
            <MasterClassDashboard
              data={data}
              onAddEvent={() => setShowForm(true)}
              onEditEvent={(event) => {
                setEditData(event);
                setShowEditForm(true);
              }}
              onViewEvent={(eventId) =>
                navigate(`/programs/master-classes/view/${eventId}`)
              }
            />
          </>
        ) : (
          <MasterClassDetails event={event} onBack={() => navigate(-1)} />
        )}
      </div>

      {/* Shared Right Panel */}
      <MasterClassRightPanel
        data={data}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {/* Modals */}
      <AddMasterClassForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleAddEvent}
      />
      <EditMasterClassForm
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        eventData={editData}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default MasterClasses;
