import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";

import MasterClassDashboard from "../components/MasterClassDashboard";
import MasterClassDetails from "../components/MasterClassDetails";
import MasterClassRightPanel from "../components/MasterClassRightPanel";
import MasterClassIntroCard from "../components/MasterClassIntroCard";
import AddMasterClassForm from "../components/AddMasterClassForm";
import EditMasterClassForm from "../components/EditMasterClassForm";
import { vtsApi } from "../services/apiService";

const MasterClasses = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  // ✅ Load Masterclass Data with Admin Token
  useEffect(() => {
    let isCancelled = false; // Flag to track if component unmounted

    const loadData = async () => {
      try {
        setLoading(true);
        const result = await vtsApi.get('/api/masterclass');

        // Don't update state if component unmounted (StrictMode cleanup)
        if (isCancelled) return;

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
        if (!isCancelled) {
          console.error("Error fetching masterclasses:", err);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    // Cleanup function: runs when component unmounts or before re-running effect
    return () => {
      isCancelled = true;
    };
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

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading Master Classes...</p>
        </div>
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
