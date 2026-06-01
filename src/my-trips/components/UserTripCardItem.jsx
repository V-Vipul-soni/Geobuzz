import { getPlaceImage } from "@/service/GlobalApi";
import { Image } from "@/components/custom/Image";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaUsers, FaWallet, FaArrowRight } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";

function UserTripCardItem({ trip }) {
  const [photoUrl, setPhotoUrl] = useState("/placeholder.jpg");

  useEffect(() => {
    if (trip?.userSelection?.location?.label) GetPlacePhoto();
  }, [trip?.userSelection?.location?.label]);

  const GetPlacePhoto = async () => {
    const url = await getPlaceImage(trip?.userSelection?.location?.label, 'place');
    setPhotoUrl(url);
  };

  const createdDate = trip?.id
    ? new Date(parseInt(trip.id)).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";

  const cityName = trip?.userSelection?.location?.label?.split(",")[0] || "Unknown";

  return (
    <Link to={"/view-trip/" + trip?.id}>
      <div className="group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-800 hover:border-violet-200 dark:hover:border-violet-700 transition-all duration-300 cursor-pointer">

        {/* Image */}
        <div className="relative h-[200px] overflow-hidden">
          <Image
            src={photoUrl}
            alt={cityName}
            fallbackSrc="/placeholder.jpg"
            className="h-[200px] group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white">
            <MdLocationOn className="text-sm" />
            <span className="text-sm font-semibold">{cityName}</span>
          </div>
          <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
            <FaArrowRight className="text-xs" />
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h2 className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-1 line-clamp-1">
            {trip?.userSelection?.location?.label?.split(",").slice(0, 2).join(",")}
          </h2>
          {createdDate && (
            <p className="text-gray-400 dark:text-gray-500 text-xs mb-3">Created {createdDate}</p>
          )}
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1 text-xs bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 border border-violet-100 dark:border-violet-800 px-3 py-1 rounded-full font-medium">
              <FaCalendarAlt className="text-[10px]" /> {trip?.userSelection?.noOfDays} days
            </span>
            <span className="flex items-center gap-1 text-xs bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800 px-3 py-1 rounded-full font-medium">
              <FaUsers className="text-[10px]" /> {trip?.userSelection?.traveler}
            </span>
            <span className="flex items-center gap-1 text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 px-3 py-1 rounded-full font-medium">
              <FaWallet className="text-[10px]" /> {trip?.userSelection?.budget}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default UserTripCardItem;
