import Draggable from 'react-draggable';
import ReactMarkdown from 'react-markdown';

function TextBlock({ textBlock, slideId, role, updateTextBlock }) {
  const handleDragStop = (e, data) => {
    if (role !== 'viewer') {
      updateTextBlock(textBlock.content, data.x, data.y);
    }
  };

  return (
    <Draggable
      position={{ x: textBlock.x || 0, y: textBlock.y || 0 }}
      onStop={handleDragStop}
      disabled={role === 'viewer'}
    >
      <div className="absolute bg-white border rounded-lg p-3 shadow-md cursor-move">
        <textarea
          value={textBlock.content}
          onChange={(e) =>
            updateTextBlock(e.target.value, textBlock.x, textBlock.y)
          }
          disabled={role === 'viewer'}
          className="w-64 h-24 border rounded resize focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          placeholder="Type here (Markdown supported)"
        />
        <div className="prose text-gray-700">
          <ReactMarkdown>{textBlock.content}</ReactMarkdown>
        </div>
      </div>
    </Draggable>
  );
}

export default TextBlock;
