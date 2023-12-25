import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ImageUploader from './Components/sender';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/products" element={<ImageUploader />} />
      </Routes>
    </Router>
  );
}