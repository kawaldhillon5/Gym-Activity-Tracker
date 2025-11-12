// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { Navbar } from './components/Navbar';
import { AuthRequired } from './components/AuthRequired';
import { WorkoutPage } from './pages/WorkoutPage';

import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <div id='routes'>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          < Route element = {<AuthRequired />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/workout/:workoutId" element={<WorkoutPage />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;