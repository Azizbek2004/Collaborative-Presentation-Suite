function Toolbar({ role, addSlide, startPresentation }) {
  return (
    <div className="bg-gray-800 p-3 flex space-x-3 shadow-md">
      {role === 'creator' && (
        <button
          onClick={addSlide}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
        >
          Add Slide
        </button>
      )}
      <button
        onClick={startPresentation}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Start Presentation
      </button>
    </div>
  );
}

export default Toolbar;
