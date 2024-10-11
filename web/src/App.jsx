import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Houses from './pages/houses';
import Login from './pages/login';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/houses" element={<Houses />} />
        <Route path="/" element={<h1>Welcome to the Home Page</h1>} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;