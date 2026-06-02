import { db, auth } from "@/service/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FiEdit2, FiCheck, FiX, FiShare2 } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Footer from "../components/Footer";
import Hotels from "../components/Hotels";
import InfoSection from "../components/InfoSection";
import PlacesToVisit from "../components/PlacesToVisit";

function Viewtrip() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip]       = useState({});
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [editedTrip, setEditedTrip] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { 
    if (!tripId) return;
    const unsubscribe = auth.onAuthStateChanged((user) => {
      GetTripData(user);
    });
    return () => unsubscribe();
  }, [tripId]);

  const GetTripData = async (user) => {
    setLoading(true);
    try {
      const docRef  = doc(db, "AITrips", tripId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.isPublic || (user && user.email === data.userEmail)) {
          setTrip(data);
        } else {
          toast.error("This trip is private.");
          navigate("/");
        }
      } else {
        toast.error("No trip found!");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load trip.");
    } finally {
      setLoading(false);
    }
  };

  const enterEditMode = () => {
    setEditedTrip(JSON.parse(JSON.stringify(trip)));
    setEditMode(true);
  };

  const cancelEdit = () => {
    setEditedTrip(null);
    setEditMode(false);
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, "AITrips", tripId);
      await updateDoc(docRef, { tripData: editedTrip.tripData });
      setTrip(editedTrip);
      setEditMode(false);
      toast.success("Trip saved!");
    } catch (err) {
      toast.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    try {
      if (!trip.isPublic) {
        const docRef = doc(db, "AITrips", tripId);
        await updateDoc(docRef, { isPublic: true });
        setTrip({ ...trip, isPublic: true });
      }
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied! Anyone with this link can view your trip.");
    } catch (err) {
      toast.error("Failed to share trip.");
    }
  };

  const removeHotel = (index) => {
    const updated = { ...editedTrip };
    updated.tripData.hotels.splice(index, 1);
    setEditedTrip(updated);
  };

  const removePlace = (dayKey, placeIndex) => {
    const updated = { ...editedTrip };
    updated.tripData.itinerary[dayKey].activities.splice(placeIndex, 1);
    setEditedTrip(updated);
  };

  const updatePlace = (dayKey, placeIndex, field, value) => {
    const updated = { ...editedTrip };
    updated.tripData.itinerary[dayKey].activities[placeIndex][field] = value;
    setEditedTrip(updated);
  };

  const reorderPlaces = (dayKey, oldIndex, newIndex) => {
    const updated = { ...editedTrip };
    const activities = updated.tripData.itinerary[dayKey].activities;
    const [moved] = activities.splice(oldIndex, 1);
    activities.splice(newIndex, 0, moved);
    setEditedTrip(updated);
  };

  const updateHotels = (newHotels) => {
    const updated = { ...editedTrip };
    updated.tripData.hotels = newHotels;
    setEditedTrip(updated);
  };

  const updateDayItinerary = (dayKey, newDayData) => {
    const updated = { ...editedTrip };
    updated.tripData.itinerary[dayKey] = newDayData;
    setEditedTrip(updated);
  };

  const activeTrip = editMode ? editedTrip : trip;
  const isOwner = auth.currentUser?.email && auth.currentUser.email === activeTrip?.userEmail;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-6 md:px-20 lg:px-44 transition-colors duration-300">
        <div className="animate-pulse">
          <div className="h-[340px] bg-gray-200 dark:bg-gray-800 rounded-3xl mb-6" />
          <div className="h-7 bg-gray-200 dark:bg-gray-800 rounded-full w-1/3 mb-3" />
          <div className="flex gap-3 mb-10">
            <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded-full w-24" />
            <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded-full w-24" />
            <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded-full w-24" />
          </div>
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-1/4 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-[180px] bg-gray-200 dark:bg-gray-800 rounded-2xl" />)}
          </div>
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-1/4 mb-4" />
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-[140px] bg-gray-200 dark:bg-gray-800 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 md:px-10 py-8">
        
        {/* Toolbar */}
        <div className="flex justify-end mb-4 gap-2">
          {!editMode ? (
            isOwner && (
              <>
                <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <FiShare2 /> Share
                </button>
                <button onClick={enterEditMode} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-violet-600 dark:text-violet-400 bg-white dark:bg-gray-900 border border-violet-200 dark:border-violet-700 rounded-lg shadow-sm hover:bg-violet-50 dark:hover:bg-violet-950/40 transition-colors">
                  <FiEdit2 /> Edit Trip
                </button>
              </>
            )
          ) : (
            <div className="flex gap-2">
              <button onClick={cancelEdit} disabled={saving} className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50">
                Cancel
              </button>
              <button onClick={saveChanges} disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-blue-600 rounded-lg shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                {saving ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FiCheck />}
                Save Changes
              </button>
            </div>
          )}
        </div>

        {activeTrip?.isPublic && (
          <div className="mb-3 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-full dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
              🌍 Public
            </span>
          </div>
        )}

        <InfoSection trip={activeTrip} />
        <Hotels         
          trip={activeTrip} 
          editMode={editMode}
          onRemoveHotel={removeHotel}
          onRegenerateHotels={updateHotels}
          userSelection={activeTrip?.userSelection}
        />
        <PlacesToVisit  
          trip={activeTrip} 
          editMode={editMode}
          onRemovePlace={removePlace}
          onUpdatePlace={updatePlace}
          onReorderPlaces={reorderPlaces}
          onRegenerateDay={updateDayItinerary}
          userSelection={activeTrip?.userSelection}
        />
        <Footer />
      </div>
    </div>
  );
}

export default Viewtrip;
