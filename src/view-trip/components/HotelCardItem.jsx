import { getPlaceImage } from "@/service/GlobalApi";
import { useEffect, useState } from "react";
import { Image } from "@/components/custom/Image";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { FiX } from "react-icons/fi";

function HotelCardItem({ hotel, editMode, onRemove }) {
  const [photoUrl, setPhotoUrl] = useState("/placeholder.jpg");

  useEffect(() => {
    if (hotel?.hotelName) GetPlacePhoto();
  }, [hotel?.hotelName]);

  const GetPlacePhoto = async () => {
    const url = await getPlaceImage(hotel?.hotelName, 'hotel');
    setPhotoUrl(url);
  };

  const Wrapper = editMode ? "div" : Link;

  return (
    <Wrapper
      {...(!editMode ? { to: `https://www.google.com/maps/search/?api=1&query=${hotel?.hotelName},${hotel?.hotelAddress}`, target: "_blank" } : {})}
      className="block"
    >
      <div className={`group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border transition-all duration-300 ${editMode ? 'border-violet-300 dark:border-violet-700 ring-1 ring-violet-100 dark:ring-violet-900' : 'border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-700 cursor-pointer'}`}>
        
        {/* Image */}
        <div className="relative h-[160px] overflow-hidden">
          {editMode && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(); }}
              className="absolute top-2 left-2 w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white z-20 shadow-md transition-colors"
            >
              <FiX className="text-sm" />
            </button>
          )}

          <Image
            src={photoUrl}
            alt={hotel?.hotelName}
            fallbackSrc="/placeholder.jpg"
            className={`h-[160px] transition-transform duration-500 ${!editMode ? 'group-hover:scale-110' : ''}`}
          />
          {hotel?.rating && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm z-10">
              <FaStar className="text-yellow-400 text-xs" />
              <span className="text-xs font-bold text-gray-800 dark:text-gray-100">{hotel?.rating}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight line-clamp-1 mb-1">{hotel?.hotelName}</h3>
          <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500 text-xs mb-2">
            <FaMapMarkerAlt className="text-[10px] flex-shrink-0" />
            <span className="line-clamp-1">{hotel?.hotelAddress}</span>
          </div>
          {hotel?.price && (
            <div className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold px-2 py-1 rounded-lg border border-emerald-100 dark:border-emerald-800">
              💵 {hotel?.price}
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
}

export default HotelCardItem;
