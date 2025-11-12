import 'react-calendar/dist/Calendar.css';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import type { TileClassNameFunc } from 'react-calendar';
import Calendar from 'react-calendar';
import { useNavigate } from 'react-router-dom';

import '../css/HomePage.css'

const url = import.meta.env.VITE_API_URL


interface CheckIn {
  id: number;
  check_in_date: string; 
  user_id: number;
}

interface WorkoutRead {
  id: number;
  name: string;
  check_in_id: number;
  exercise_logs: any[]; 
}

export const HomePage = () => {
  const { token } = useAuth();
  const [checkIns, setCheckIns] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate()


  const todayDate = () => {
    const date  =  new Date().toLocaleDateString()
    const dateArray = date.split("/")
    return `${dateArray[2]}-${dateArray[0]}-${dateArray[1]}`
  }

  const dateToday = todayDate();


  const handleCheckIn = async () =>{
    if (!token) {
        setError("You must be logged in to check in.");
        return;
    }

    if(checkIns.includes(dateToday)) {
      setError("Already Checked in for Today")
      return;
    }
    try{
      const response = await fetch(`${url}/checkins/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      if(!response.ok){
        const err = await response.json()
        throw new Error( err.detail || "Something went wrong while checking In!")
      }
      const newCheckIn: CheckIn = await response.json();
      setCheckIns(prevCheckIns => [...prevCheckIns, newCheckIn.check_in_date]);
      
      const workoutResponse = await fetch(`${url}/workouts/`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                check_in_id: newCheckIn.id,
                name: "Today's Workout" // We can let the user rename this later
            })
        });

        if (!workoutResponse.ok) {
            
            const err = await workoutResponse.json();
            throw new Error(err.detail || "Check-in succeeded, but failed to create workout.");
        }

        const newWorkout: WorkoutRead = await workoutResponse.json();
        console.log(`Navigating to /workout/${newWorkout.id}`);
        navigate(`/workout/${newWorkout.id}`);

    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
  }

  const getTileClassName: TileClassNameFunc = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      if (checkIns.includes(dateString)) {
        return 'highlight';
      }
    }
    return null; 
  };


  useEffect(() => {
    const fetchCheckIns = async () => {
      try {
        const response = await fetch(`${url}/checkins/`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Something went wrong fetching check-ins.");
        }

        const data: CheckIn[] = await response.json();

        const dates = data.map(checkin => checkin.check_in_date);
        console.log("Fetched check-in dates:", dates);

        setCheckIns(dates);

      } catch (err: any) {
        console.error(err);
        setError(err.message);
      }
    };

    if (token) {
      fetchCheckIns();
    }
  }, [token]); 

 
  
  return (
    <div id='home_page'>
      <h1>Welcome to the Gym Tracker</h1>

      <Calendar
        tileClassName={getTileClassName} 
      />
      <button 
        onClick={handleCheckIn}
        className={checkIns.includes(dateToday) ? 'greyed': ''}
      >Check-in For Today</button>
      
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
};