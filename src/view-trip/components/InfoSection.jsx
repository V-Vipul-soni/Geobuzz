import { Button } from "@/components/ui/button";
import { getPlaceImage } from "@/service/GlobalApi";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IoIosSend } from "react-icons/io";
import { FaCalendarAlt, FaUsers, FaWallet, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState("/placeholder.jpg");

  useEffect(() => {
    if (trip?.userSelection?.location?.label) GetPlacePhoto();
  }, [trip?.userSelection?.location?.label]);

  const GetPlacePhoto = async () => {
    const url = await getPlaceImage(trip?.userSelection?.location?.label, 'place');
    setPhotoUrl(url);
  };

  const cityName = trip?.userSelection?.location?.label?.split(",")[0] || "";

  const handleShare = async () => {
    const url = window.location.href;
    const title = `${cityName} Trip Plan`;
    if (navigator.share) {
      try {
        await navigator.share({ title, text: `Check out my AI-generated trip to ${cityName}!`, url });
      } catch (err) {
        if (err.name !== "AbortError") {
          await navigator.clipboard.writeText(url);
          toast.success("Link copied to clipboard!");
        }
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="mb-8">

      {/* Hero image */}
      <div className="relative h-[380px] rounded-3xl overflow-hidden shadow-xl">
        <img
          src={photoUrl}
          onError={(e) => { e.target.src = "/placeholder.jpg"; }}
          className="w-full h-full object-cover"
          alt={cityName}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                <FaMapMarkerAlt className="text-violet-300" />
                <span>Your Trip Destination</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                {trip?.userSelection?.location?.label?.split(",").slice(0, 2).join(",")}
              </h1>
            </div>
            <Button onClick={handleShare} className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 rounded-xl">
              <IoIosSend className="mr-2" /> Share
            </Button>
          </div>
        </div>
      </div>

      {/* Info badges */}
      <div className="flex flex-wrap gap-3 mt-5">
        <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-violet-100 dark:border-violet-800 shadow-sm px-4 py-2.5 rounded-2xl">
          <div className="w-8 h-8 bg-violet-100 dark:bg-violet-950/40 rounded-xl flex items-center justify-center">
            <FaCalendarAlt className="text-violet-600 dark:text-violet-400 text-sm" />
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Duration</p>
            <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">{trip?.userSelection?.noOfDays} Days</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-blue-100 dark:border-blue-800 shadow-sm px-4 py-2.5 rounded-2xl">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-950/40 rounded-xl flex items-center justify-center">
            <FaWallet className="text-blue-600 dark:text-blue-400 text-sm" />
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Budget</p>
            <p className="font-bold text-gray-800 dark:text-gray-200 text-sm capitalize">{trip?.userSelection?.budget}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-pink-100 dark:border-pink-800 shadow-sm px-4 py-2.5 rounded-2xl">
          <div className="w-8 h-8 bg-pink-100 dark:bg-pink-950/40 rounded-xl flex items-center justify-center">
            <FaUsers className="text-pink-600 dark:text-pink-400 text-sm" />
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Travelers</p>
            <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">{trip?.userSelection?.traveler}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default InfoSection;
