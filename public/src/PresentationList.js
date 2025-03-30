import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PresentationList() {
  const [nickname, setNickname] = useState(
    localStorage.getItem('nickname') || ''
  );
  const [presentations, setPresentations] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/presentations')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch presentations');
        return res.json();
      })
      .then((data) => setPresentations(data))
      .catch((err) => setError(err.message));
  }, []);

  const createPresentation = () => {
    if (!nickname) return alert('Please enter a nickname');
    fetch('/api/presentations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `Presentation by ${nickname}`,
        creator: nickname,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to create presentation');
        return res.json();
      })
      .then((data) => navigate(`/presentation/${data._id}`))
      .catch((err) => setError(err.message));
  };

  if (error)
    return <div className="p-4 text-red-600 text-center">Error: {error}</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Presentation Suite
        </h1>
        <input
          type="text"
          placeholder="Your Nickname"
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
            localStorage.setItem('nickname', e.target.value);
          }}
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={createPresentation}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Create Presentation
        </button>
        <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">
          Join Existing
        </h2>
        <ul className="space-y-3">
          {presentations.map((p) => (
            <li
              key={p._id}
              className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm"
            >
              <span className="text-gray-800">{p.name}</span>
              <button
                onClick={() => navigate(`/presentation/${p._id}`)}
                className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600 transition duration-200"
              >
                Join
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PresentationList;
