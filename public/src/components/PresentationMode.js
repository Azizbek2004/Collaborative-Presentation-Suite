import ReactMarkdown from 'react-markdown';

function PresentationMode({
  slide,
  currentSlide,
  totalSlides,
  setCurrentSlide,
  exitPresentation,
}) {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center">
      <button
        onClick={exitPresentation}
        className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
      >
        Exit
      </button>
      <div className="text-white text-2xl mb-4">
        Slide {currentSlide + 1} of {totalSlides}
      </div>
      <div className="bg-white p-6 rounded-lg w-3/4 h-3/4 overflow-auto shadow-lg">
        {!slide.textBlocks || slide.textBlocks.length === 0 ? (
          <p className="text-gray-600 text-center">No content yet</p>
        ) : (
          slide.textBlocks.map((tb) => (
            <div key={tb._id} className="border p-3 mb-3 rounded bg-gray-50">
              <ReactMarkdown>{tb.content}</ReactMarkdown>
            </div>
          ))
        )}
      </div>
      <div className="flex space-x-4 mt-4">
        <button
          onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
          disabled={currentSlide === 0}
        >
          Previous
        </button>
        <button
          onClick={() =>
            setCurrentSlide(Math.min(totalSlides - 1, currentSlide + 1))
          }
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
          disabled={currentSlide === totalSlides - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PresentationMode;
