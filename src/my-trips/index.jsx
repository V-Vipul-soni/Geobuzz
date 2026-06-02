import { db } from "@/service/firebaseConfig";
import { collection, getDocs, query, where, doc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MdFlightTakeoff, MdExplore } from "react-icons/md";
import UserTripCardItem from "./components/UserTripCardItem";
import { toast } from "sonner";

function MyTrips() {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => { GetUserTrip(); }, []);

  const GetUserTrip = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) { navigate("/"); return; }
    setLoading(true);
    const q             = query(collection(db, "AITrips"), where("userEmail", "==", user?.email));
    const querySnapshot = await getDocs(q);
    const trips         = [];
    querySnapshot.forEach((doc) => trips.push(doc.data()));
    setUserTrips(trips);
    setLoading(false);
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      await deleteDoc(doc(db, "AITrips", tripId));
      setUserTrips(prev => prev.filter(trip => trip.id !== tripId));
      toast.success("Trip deleted successfully!");
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast.error("Failed to delete trip.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">

      {/* Header banner */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 bg-white/20 text-white text-sm px-4 py-1.5 rounded-full mb-3 border border-white/30">
              <MdExplore /> Your Adventures
            </span>
            <h1 className="text-4xl font-extrabold text-white">My Trips</h1>
            <p className="text-white/70 mt-1">
              {userTrips.length > 0
                ? `${userTrips.length} trip${userTrips.length > 1 ? "s" : ""} planned`
                : "Start your first adventure"}
            </p>
          </motion.div>
          <Link to="/create-trip">
            <button className="flex items-center gap-2 bg-white dark:bg-gray-900 text-violet-700 dark:text-violet-400 font-bold px-6 py-3 rounded-2xl hover:bg-violet-50 dark:hover:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-lg">
              <MdFlightTakeoff className="text-lg" /> Plan New Trip
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 animate-pulse">
                <div className="h-[200px] bg-gray-200 dark:bg-gray-800" />
                <div className="p-5 flex flex-col gap-3">
                  <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-full w-3/4" />
                  <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full w-1/2" />
                  <div className="flex gap-2 mt-1">
                    <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded-full w-16" />
                    <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded-full w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && userTrips.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-8xl mb-6">🗺️</div>
            <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-200 mb-3">No trips yet!</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mb-8">
              Start planning your first journey. Our AI will craft the perfect itinerary for you.
            </p>
            <Link to="/create-trip">
              <button className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg shadow-violet-200 dark:shadow-none text-lg">
                <MdFlightTakeoff className="text-xl" /> Create Your First Trip
              </button>
            </Link>
          </motion.div>
        )}

        {/* Trips grid */}
        {!loading && userTrips.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userTrips.map((trip, index) => (
              <motion.div key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07 }}>
                <UserTripCardItem trip={trip} onDelete={handleDeleteTrip} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTrips;
