import { useNavigate } from 'react-router-dom';
import "../css/LandingPage.css"

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      
      <div className="hero-section">
        <div className="logo-mark">C</div> 
        <h1 className="hero-title">
          PRECISION<br />
          IS THE<br />
          STANDARD.
        </h1>
        <p className="hero-subtitle">
          The professional tracker for serious strength training.
        </p>
      </div>

      <div className="action-zone">
        <button 
          className="btn-primary"
          onClick={() => navigate('/signup')}
        >
          Create Account
        </button>
        
        <button 
          className="btn-secondary"
          onClick={() => navigate('/login')}
        >
          Log In
        </button>
      </div>
      
    </div>
  );
};