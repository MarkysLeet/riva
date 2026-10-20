"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

interface CardGalleryProps {
  images: string[];
  alt: string;
  badge?: string;
  typeBadge?: string;
  onFavoriteClick?: (e: React.MouseEvent) => void;
  isFavorite?: boolean;
}

export function CardGallery({
  images,
  alt,
  badge,
  typeBadge,
  onFavoriteClick,
  isFavorite = false,
}: CardGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex(index);
  };

  return (
    <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-[#EAE3D9] group select-none">
      {/* Current Image */}
      <img
        src={images[currentIndex] || images[0]}
        alt={`${alt} - фото ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-opacity duration-300"
      />

      {/* Badges on Top */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 flex-wrap">
          {badge && (
            <span className="bg-white/90 backdrop-blur-sm text-[#2A2421] text-[11px] font-medium px-2.5 py-0.5 rounded-md shadow-xs pointer-events-auto">
              {badge}
            </span>
          )}
          {typeBadge && (
            <span className="bg-[#8A9580]/90 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-0.5 rounded-md shadow-xs pointer-events-auto">
              {typeBadge}
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onFavoriteClick?.(e);
          }}
          className="p-1.5 rounded-full bg-black/20 backdrop-blur-xs text-white hover:text-[#C59A87] hover:bg-white transition-colors cursor-pointer pointer-events-auto shadow-xs"
          aria-label="В избранное"
        >
          <Heart
            className={`w-4 h-4 stroke-[2] ${
              isFavorite ? "fill-[#C59A87] text-[#C59A87]" : ""
            }`}
          />
        </button>
      </div>

      {/* Navigation Arrows (visible on hover) */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-[#2A2421] opacity-0 group-hover:opacity-100 hover:bg-white transition-all shadow-sm cursor-pointer z-10"
            aria-label="Предыдущее фото"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-[#2A2421] opacity-0 group-hover:opacity-100 hover:bg-white transition-all shadow-sm cursor-pointer z-10"
            aria-label="Следующее фото"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-2.5 left-0 right-0 flex items-center justify-center gap-1.5 z-10 pointer-events-none">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => goToImage(e, idx)}
              className={`h-1.5 rounded-full transition-all duration-300 pointer-events-auto cursor-pointer ${
                idx === currentIndex
                  ? "w-4 bg-white shadow-xs"
                  : "w-1.5 bg-white/60 hover:bg-white/90"
              }`}
              aria-label={`Перейти к фото ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
