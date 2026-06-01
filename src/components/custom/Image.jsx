import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function Image({ src, alt, className, fallbackSrc = "/placeholder.jpg", ...props }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Skeleton loader while loading */}
      {!loaded && (
        <motion.div 
          className="absolute inset-0 bg-gray-200"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      <img
        src={imgSrc || fallbackSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
        onLoad={() => setLoaded(true)}
        onError={() => setImgSrc(fallbackSrc)}
        {...props}
      />
    </div>
  );
}
