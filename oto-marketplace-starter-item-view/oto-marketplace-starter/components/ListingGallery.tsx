'use client';

import { useState } from 'react';

type ListingGalleryProps = {
  images: string[];
  title: string;
};

export default function ListingGallery({ images, title }: ListingGalleryProps) {
  const gallery = images.length > 0 ? images : [''];
  const [selectedImage, setSelectedImage] = useState(gallery[0]);

  return (
    <div className="grid gap-3 lg:grid-cols-[88px_minmax(0,1fr)]">
      <div className="max-h-[580px] overflow-y-auto pr-1">
        <div className="space-y-2">
          {gallery.map((image, index) => {
            const isActive = image === selectedImage;

            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedImage(image)}
                className={`block h-20 w-20 overflow-hidden rounded-2xl border bg-white ${
                  isActive ? 'border-slate-900' : 'border-slate-200'
                }`}
              >
                <img src={image} alt={`${title} thumbnail ${index + 1}`} className="h-full w-full object-cover" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] bg-white ring-1 ring-slate-200">
        <div className="h-[540px] bg-slate-100">
          <img src={selectedImage} alt={title} className="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  );
}
