import { useState } from 'react';

function SlideNav({
  slides,
  currentSlide,
  setCurrentSlide,
  removeSlide,
  role,
}) {
  return (
    <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto border-r border-gray-200">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Slides</h2>
      {slides.length === 0 ? (
        <p className="text-gray-600">No slides yet</p>
      ) : (
        slides.map((s, index) => (
          <div key={s._id} className="flex justify-between items-center mb-2">
            <span
              onClick={() => setCurrentSlide(index)}
              className={`p-2 rounded cursor-pointer w-full text-gray-800 ${
                index === currentSlide ? 'bg-blue-200' : 'hover:bg-gray-200'
              }`}
            >
              Slide {index + 1}
            </span>
            {role === 'creator' && (
              <button
                onClick={() => removeSlide(s._id)}
                className="ml-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-200"
              >
                X
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default SlideNav;
