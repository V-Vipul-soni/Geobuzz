import { Button } from "@/components/ui/button";
import { Image } from "@/components/custom/Image";
import { getPlaceImage } from "@/service/GlobalApi";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaMapLocationDot } from "react-icons/fa6";
import { FaTicketAlt } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function PlaceCardItem({ place, editMode, onRemove, onUpdate, sortableId }) {
  const [photoUrl, setPhotoUrl] = useState("/placeholder.jpg");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: sortableId ?? "static", disabled: !editMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (place?.placeName) GetPlacePhoto();
  }, [place?.placeName]);

  const GetPlacePhoto = async () => {
    const url = await getPlaceImage(place?.placeName, 'place');
    setPhotoUrl(url);
  };

  const Wrapper = editMode ? "div" : Link;

  return (
    <Wrapper 
      {...(!editMode ? { to: `https://www.google.com/maps/search/?api=1&query=${place?.placeName}`, target: "_blank" } : {})}
    >
      <motion.div 
        ref={setNodeRef}
        style={style}
        whileHover={!editMode ? { scale: 1.02 } : {}}
        className={`bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 flex relative ${editMode ? 'border-violet-300 dark:border-violet-700 ring-1 ring-violet-100 dark:ring-violet-900 border' : 'border-gray-100 dark:border-gray-800 border hover:shadow-lg hover:border-violet-200 dark:hover:border-violet-700 cursor-pointer'}`}
      >
        {editMode && (
          <div 
            {...attributes} 
            {...listeners}
            className="w-8 flex-shrink-0 bg-gray-50 dark:bg-gray-800 flex items-center justify-center cursor-grab active:cursor-grabbing border-r border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FiMenu className="text-gray-400 dark:text-gray-500" />
          </div>
        )}

        {/* Image */}
        <div className="relative w-[120px] flex-shrink-0 overflow-hidden">
          <Image
            src={photoUrl}
            alt={place?.placeName}
            fallbackSrc="/placeholder.jpg"
            className="w-[120px] h-full"
          />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col justify-between flex-1 min-w-0 relative">
          {editMode && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(); }}
              className="absolute top-2 right-2 w-6 h-6 bg-red-100 hover:bg-red-500 rounded-full flex items-center justify-center text-red-500 hover:text-white z-20 shadow-sm transition-colors"
            >
              <FiX className="text-xs" />
            </button>
          )}

          <div>
            {!editMode ? (
              <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight line-clamp-1 mb-1">{place?.placeName}</h3>
            ) : (
              <input 
                type="text" 
                value={place?.placeName || ""}
                onChange={(e) => onUpdate("placeName", e.target.value)}
                className="font-bold text-gray-900 dark:text-white text-base leading-tight mb-1 w-full bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-violet-400 dark:focus:border-violet-500 focus:outline-none pr-6"
              />
            )}

            {!editMode ? (
              <p className="text-gray-400 dark:text-gray-500 text-xs line-clamp-2 leading-relaxed">{place?.placeDetails}</p>
            ) : (
              <textarea 
                rows="2"
                value={place?.placeDetails || ""}
                onChange={(e) => onUpdate("placeDetails", e.target.value)}
                className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed w-full bg-gray-50 dark:bg-gray-800 rounded p-1 resize-none border border-gray-200 dark:border-gray-700 focus:border-violet-400 dark:focus:border-violet-500 focus:outline-none"
              />
            )}
          </div>

          <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
            {!editMode ? (
              place?.ticketPricing && (
                <span className="flex items-center gap-1 text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-800 px-2 py-1 rounded-lg font-medium">
                  <FaTicketAlt className="text-[10px]" /> {place.ticketPricing}
                </span>
              )
            ) : (
              <div className="flex items-center gap-1">
                <FaTicketAlt className="text-[10px] text-amber-600 dark:text-amber-500" />
                <input 
                  type="text"
                  value={place?.ticketPricing || ""}
                  onChange={(e) => onUpdate("ticketPricing", e.target.value)}
                  className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-700 rounded px-1 w-24 focus:outline-none focus:border-amber-400 dark:focus:border-amber-500"
                  placeholder="Price..."
                />
              </div>
            )}
            
            {!editMode && (
              <Button size="sm" className="bg-gradient-to-r from-violet-600 to-blue-600 text-white border-0 rounded-xl text-xs h-7 px-3 hover:opacity-90">
                <FaMapLocationDot className="mr-1 text-[10px]" /> Map
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </Wrapper>
  );
}

export default PlaceCardItem;
