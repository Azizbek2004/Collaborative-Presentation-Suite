import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import SlideNav from './components/SlideNav';
import TextBlock from './components/TextBlock';
import UserPanel from './components/UserPanel';
import Toolbar from './components/Toolbar';
import PresentationMode from './components/PresentationMode';

const socket = io('http://localhost:3000');

function PresentationRoom() {
  const { id } = useParams();
  const [presentation, setPresentation] = useState(null);
  const [role, setRole] = useState('viewer');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);
  const [error, setError] = useState(null);
  const nickname = localStorage.getItem('nickname') || '';
  const navigate = useNavigate();

  useEffect(() => {
    if (!nickname) {
      navigate('/');
      return;
    }

    socket.emit('join', { presentationId: id, nickname });

    socket.on('init', ({ presentation, role }) => {
      setPresentation(presentation);
      setRole(role);
    });

    socket.on('slideAdded', (slide) => {
      setPresentation((prev) => ({ ...prev, slides: [...prev.slides, slide] }));
    });

    socket.on('textBlockUpdated', ({ slideId, textBlockId, content, x, y }) => {
      setPresentation((prev) => {
        const updatedSlides = prev.slides.map((s) => {
          if (s._id === slideId) {
            const updatedTextBlocks = s.textBlocks.map((tb) =>
              tb._id === textBlockId ? { ...tb, content, x, y } : tb
            );
            return { ...s, textBlocks: updatedTextBlocks };
          }
          return s;
        });
        return { ...prev, slides: updatedSlides };
      });
    });

    socket.on('updateUsers', (users) => {
      setPresentation((prev) => ({ ...prev, users }));
    });

    socket.on('slideRemoved', (slideId) => {
      setPresentation((prev) => {
        const newSlides = prev.slides.filter((s) => s._id !== slideId);
        const newIndex = Math.min(currentSlide, newSlides.length - 1);
        setCurrentSlide(newIndex >= 0 ? newIndex : 0);
        return { ...prev, slides: newSlides };
      });
    });

    socket.on('error', (err) => setError(err.message || err));

    return () => {
      socket.off('init');
      socket.off('slideAdded');
      socket.off('textBlockUpdated');
      socket.off('updateUsers');
      socket.off('slideRemoved');
      socket.off('error');
    };
  }, [id, navigate]);

  if (!nickname) return null;
  if (error)
    return <div className="p-4 text-red-600 text-center">Error: {error}</div>;
  if (!presentation)
    return <div className="p-4 text-center text-gray-600">Loading...</div>;

  const slide = presentation.slides[currentSlide] || {};

  return isPresenting ? (
    <PresentationMode
      slide={slide}
      currentSlide={currentSlide}
      totalSlides={presentation.slides.length}
      setCurrentSlide={setCurrentSlide}
      exitPresentation={() => setIsPresenting(false)}
    />
  ) : (
    <div className="flex flex-col h-screen bg-gray-50">
      <Toolbar
        role={role}
        addSlide={() => socket.emit('addSlide', { presentationId: id })}
        startPresentation={() => setIsPresenting(true)}
      />
      <div className="flex flex-1 overflow-hidden">
        <SlideNav
          slides={presentation.slides}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          removeSlide={(slideId) =>
            socket.emit('removeSlide', { presentationId: id, slideId })
          }
          role={role}
        />
        <div className="flex-1 p-6 overflow-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {presentation.name}
          </h1>
          <div className="relative border h-[80vh] p-4 rounded-lg bg-white shadow-md">
            {(role === 'creator' || role === 'editor') && (
              <button
                onClick={() =>
                  socket.emit('addTextBlock', {
                    presentationId: id,
                    slideId: slide._id,
                  })
                }
                className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Add Text
              </button>
            )}
            {slide.textBlocks &&
              slide.textBlocks.map((tb) => (
                <TextBlock
                  key={tb._id}
                  textBlock={tb}
                  slideId={slide._id}
                  role={role}
                  updateTextBlock={(content, x, y) =>
                    socket.emit('editTextBlock', {
                      presentationId: id,
                      slideId: slide._id,
                      textBlockId: tb._id,
                      content,
                      x,
                      y,
                    })
                  }
                />
              ))}
          </div>
        </div>
        {role === 'creator' && (
          <UserPanel
            users={presentation.users}
            changeRole={(userNickname, newRole) =>
              socket.emit('changeRole', {
                presentationId: id,
                userNickname,
                newRole,
              })
            }
          />
        )}
      </div>
    </div>
  );
}

export default PresentationRoom;
