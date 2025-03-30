import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PresentationList from './PresentationList';
import PresentationRoom from './PresentationRoom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PresentationList />} />
        <Route path="/presentation/:id" element={<PresentationRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
