import 'react-calendar/dist/Calendar.css';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import type { TileClassNameFunc } from 'react-calendar';
import Calendar from 'react-calendar';
import { useNavigate } from 'react-router-dom';

import '../css/HomePage.css'
import { CalendarDays } from 'lucide-react';
import { LineWobble } from 'ldrs/react';
import { useError } from '../contexts/ErrorContext';

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

type CheckInStatus = 'idle' | 'Loading';


export const HomePage = () => {
  const { token } = useAuth();
  const [checkIns, setCheckIns] = useState<string[]>([]);
  const {setError} = useError();
  const navigate = useNavigate()

  const [CheckInStatus, setCheckInStatus] = useState<CheckInStatus>("idle")
  const [loading, setLoading] = useState<boolean>(false);
  

  const localDateString = (date: Date) => {
    const dateLocal  =  date.toLocaleDateString()
    const dateArray = dateLocal.split("/")
    dateArray[0].length < 2 ? dateArray[0] = "0"+ dateArray[0] : dateArray[0]
    dateArray[1].length < 2 ? dateArray[1] = "0"+ dateArray[1] : dateArray[1]
    return `${dateArray[2]}-${dateArray[0]}-${dateArray[1]}`
  }

  const dateToday = localDateString(new Date());
  const isCheckedInToday = checkIns.includes(dateToday);

  const displayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).toUpperCase()

  const getPreviousCheckInDate = (): string | null => {
    const history = checkIns.filter(date => date !== dateToday);
    history.sort((a, b) => b.localeCompare(a));

    return history.length > 0 ? history[0] : null;
  };

  const handleClickDate = async (date: Date) =>{
    const dateString = localDateString(date)
        if (!token) {
        setError("You must be logged in to View Workout.");
        return;
    }
    console.log(dateString)
    if(checkIns.includes(dateString)) {
      try {
        setCheckInStatus("Loading")
        const response = await fetch(`${url}/workouts/checkin-info/${dateString}`,{
          method: "GET",
          headers:{
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if(!response.ok){
          const err = await response.json()
          throw new Error( err.detail || "Error Loading Workout")
        }
        
        const workout : WorkoutRead = await response.json()
        setCheckInStatus("idle")
        const lastDate = getPreviousCheckInDate();
        navigate(`/workout/${workout.id}`,{state:{lastCheckInDate:lastDate, checkInDate: dateString }});

      }catch (err: any){
        console.error(err)
        setError(err.message)
        setCheckInStatus("idle")
      }
      
    } else {
      setError("No Workout Data Avaliable for this date");
    }
  }


  const handleCheckIn = async () =>{
    if (!token) {
        setError("You must be logged in to check in.");
        return;
    }

    if(checkIns.includes(dateToday)) {
      handleClickDate(new Date())
      return
    }
    try{
      setCheckInStatus("Loading")
      const response = await fetch(`${url}/checkins/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      if(!response.ok){
        const err = await response.json()
        throw new Error( err.detail || "Check-in Failed")
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
                name: "Today's Workout"
            })
        });

        if (!workoutResponse.ok) {
            
            const err = await workoutResponse.json();
            throw new Error(err.detail || "Check-in succeeded, but failed to create workout.");
        }

        const newWorkout: WorkoutRead = await workoutResponse.json();
        const lastDate = getPreviousCheckInDate();
        navigate(`/workout/${newWorkout.id}`,{state:{lastCheckInDate:lastDate}});

    } catch (err: any) { 
      console.error(err)
      setError(err.message)
    } finally{
      setCheckInStatus("idle")

    }
  }

  const getTileClassName: TileClassNameFunc = ({ date, view }) => {
    if(loading) return "loading"
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
        setLoading(true)
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
        setCheckIns(dates);

      } catch (err: any) {
        console.error(err);
        setError(err.message);
      }
      finally{
        setLoading(false)
      }
    };

    if (token) {
      fetchCheckIns();
    }
  }, [token]); 

  useEffect(()=>{
    return ()=>{setError(null)}
  },[])
  
  return (
    <div id='home_page'>
      
      {/* 1. Heads Up Display */}
      <div className="dashboard-header">
        <p className="date-display">{displayDate}</p>
        <h1 className={loading ? "welcome-text welcome-text-loading": "welcome-text"}>
            {isCheckedInToday ? "SESSION ACTIVE" : "READY TO TRAIN?"}
        </h1>
      </div>

      {/* 2. Hero Action Card */}
      <div className={loading ? `action-card ${isCheckedInToday ? 'active' : ''} action-card-loading`: `action-card ${isCheckedInToday ? 'active' : ''}`}>
        
        
        <div style={{ width: '100%' }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
                {isCheckedInToday ? "Current Session" : "Start New Session"}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.9rem' }}>
                {isCheckedInToday ? "Continue logging your sets." : "Log a new workout for today."}
            </p>
        </div>

        <button 
            onClick={handleCheckIn}
            className="checkin-btn"
        >
            
          {CheckInStatus === 'idle' ? isCheckedInToday ? "RESUME LOGGING" : "LOG WORKOUT" : <LineWobble /> }
             
        </button>
      </div>

      {/* 3. The Calendar */}
      <h3 style={{ alignSelf: 'flex-start', fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <CalendarDays size={16} /> SESSION HISTORY
      </h3>
      
      <Calendar
        tileClassName={getTileClassName}
        onClickDay={(value) =>{handleClickDate(value)}} 
        calendarType='iso8601' // Starts week on Monday
      />
    </div>
  );
};