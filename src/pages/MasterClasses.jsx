import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";

import MasterClassDashboard from "../components/MasterClassDashboard";
import MasterClassDetails from "../components/MasterClassDetails";
import MasterClassRightPanel from "../components/MasterClassRightPanel";
import MasterClassIntroCard from "../components/MasterClassIntroCard";
import AddMasterClassForm from "../components/AddMasterClassForm";
import EditMasterClassForm from "../components/EditMasterClassForm";

const MasterClasses = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  // ✅ Load Masterclass Data
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/masterclass`);
        const result = await res.json();

        if (result.success && Array.isArray(result.data)) {
          setData(result.data);

          const upcoming = result.data.filter((e) => e.status === "scheduled");
          const past = result.data.filter(
            (e) => e.status === "completed" || e.status === "cancelled"
          );

          setUpcomingEvents(upcoming);
          setPastEvents(past);
        } else {
          console.error("Invalid API response:", result);
        }
      } catch (err) {
        console.error("Error fetching masterclasses:", err);
      }
    };

    loadData();
  }, []);

  // ✅ Add New Event
  const handleAddEvent = (newEvent) => {
    setUpcomingEvents((prev) => [...prev, newEvent]);
  };

  // ✅ Save Edited Event
  const handleSaveEdit = (updatedEvent) => {
    setUpcomingEvents((prev) =>
      prev.map((e) => (e._id === updatedEvent._id ? updatedEvent : e))
    );
  };

  if (!data.length)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading Master Classes...
      </div>
    );

  // ✅ Render Dashboard or Details
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <div className="flex-1 p-6 lg:p-10">
        {!id ? (
          <>
            <MasterClassIntroCard />
            <MasterClassDashboard
              data={data}
              upcomingEvents={upcomingEvents}
              pastEvents={pastEvents}
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
          <MasterClassDetails onBack={() => navigate(-1)} />
        )}
      </div>

      {/* Right Panel */}
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
