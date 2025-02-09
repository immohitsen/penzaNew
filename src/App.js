import './App.css';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Router and Routes
import Dashboard from './components/Dashboard'; // Assuming Dashboard is in the components folder
import LoginPage from './components/LoginPage'; // Assuming LoginPage is in the components folder
import SignupPage from './components/SignUpPage';
import ProfilePage from './components/ProfilePage';



const App = () => {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <Routes>
          {/* Route for Dashboard */}
          <Route path="/" element={<Dashboard />} />

          {/* Route for Login Page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Route for SignUp Page */}
          <Route path="/signup" element={<SignupPage />} />

          {/* Route for Profile Page */}
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
