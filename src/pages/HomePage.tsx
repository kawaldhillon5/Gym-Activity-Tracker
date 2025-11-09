import 'react-calendar/dist/Calendar.css';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import type { TileClassNameFunc } from 'react-calendar';
import Calendar from 'react-calendar';

interface CheckIn {
  id: number;
  check_in_date: string; 
  user_id: number;
}

export const HomePage = () => {
  const { token } = useAuth();
  const [checkIns, setCheckIns] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleCheckIn = async () =>{
    try{
      const response = await fetch("http://127.0.0.1:8000/checkins/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      if(!response.ok){
        throw new Error("Something went wrong while checking In!")
      }
      const newCheckIn: CheckIn = await response.json();
      setCheckIns(prevCheckIns => [...prevCheckIns, newCheckIn.check_in_date]);      
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
        const response = await fetch("http://127.0.0.1:8000/checkins/", {
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
    <div>
      <h1>Welcome to the Gym Tracker</h1>

      
      <style>{`
        .highlight {
          background: #d0f0c0; /* A light green */
          font-weight: bold;
          border-radius: 50%;
        }
      `}</style>
      
      <Calendar
        tileClassName={getTileClassName} 
      />

      <button onClick={handleCheckIn}>Check-in For Today</button>
      
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
};