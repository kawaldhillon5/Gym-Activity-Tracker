import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import '../css/workout_page.css'
import { Exercise } from '../components/Exercise';
import { AddExercise } from '../components/AddExercise';
import { Pencil, Save } from 'lucide-react';

const url = import.meta.env.VITE_API_URL


interface SetLog {
  id: number;
  set_number: number;
  reps: number;
  weight_kg: number;
  comment: string | null; 
}

interface ExerciseLog {
  id: number;
  exercise_name: string;
  set_logs: SetLog[];
}

interface Workout {
  id: number;
  name: string;
  check_in_id: number;
  exercise_logs: ExerciseLog[];
}



export const WorkoutPage = () => {
  const { workoutId } = useParams<{ workoutId: string }>();
  const { token } = useAuth();
  const location = useLocation();

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [exerciseNameInput, setExerciseNameInput] = useState <string >("");
  const [editOn, setEditOn] = useState<boolean>(false)

  const handelAddExercise = async (e : React.FormEvent) =>{
    e.preventDefault();
    setError(null)

    if (!exerciseNameInput.trim() || !workout) {
      setError("Please enter an exercise name.");
      return;
    }

    try {
        const addExerciseResponse = await fetch(`${url}/workouts/exercise-logs/`,
            {
                method: "POST",
                headers:{
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    exercise_name: exerciseNameInput,
                    workout_id: workoutId
                })
            }
        );
        if(!addExerciseResponse.ok){
            const err = await addExerciseResponse.json();
            throw new Error(err.detail || "Error Occured While Trying to create Exercise Log.");
        }

        const newExerciseLog : ExerciseLog = await addExerciseResponse.json();

        setWorkout(prevWorkout => {
            if (!prevWorkout) return null; 
            return {
            ...prevWorkout,
            exercise_logs: [...prevWorkout.exercise_logs, newExerciseLog]
            };
        });

        setExerciseNameInput("");
        } catch (err: any) {
        setError(err.message);
        }
    }

    const handleSetAdded = (newSet: SetLog, exerciseId: number) => {
        setWorkout(prevWorkout => {
        if (!prevWorkout) return null;

        const updatedExerciseLogs = prevWorkout.exercise_logs.map(exercise => {
            
            if (exercise.id !== exerciseId) {
            return exercise;
            }

            return {
            ...exercise, 
            set_logs: [...exercise.set_logs, newSet] 
            };
        });

        return {
            ...prevWorkout, 
            exercise_logs: updatedExerciseLogs 
        };
        });
    };
  

    useEffect(() => {

    if (!token || !workoutId) {
      setLoading(false);
      return;
    }

    const fetchWorkout = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${url}/workouts/${workoutId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.detail || "Failed to fetch workout data.");
        }

        const data: Workout = await response.json();
        setWorkout(data);
        console.log("Fetched workout data:", data);

      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [token, workoutId]); 

  if (loading) {
    return <div>Loading your workout...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (!workout) {
    return <div>Workout not found.</div>;
  }

  return (
    <div className='workout_div' >
      <div className='workout_div_header'>
        <h2>{workout.name}</h2>
        <button onClick={()=>{setEditOn((prev)=> !prev)}}>{editOn ? <Save/> :<Pencil/>}</button>
      </div>
      
      {/* <form id='add_exercise_form' onSubmit={handelAddExercise} style={{ marginBottom: '20px' }}>
        <h3>Add New Exercise</h3>
        <input 
          type="text"
          value={exerciseNameInput}
          onChange={(e) => setExerciseNameInput(e.target.value)}
          placeholder="e.g., Bench Press"
        />
        <button type="submit">Add Exercise</button>
      </form> */}
      {/* <AddExercise /> */}


      <div className='exercise_component' style={{ marginTop: '20px' }}>
        <div className='exercise_div_header'>
          <h3>Exercises</h3>
          {editOn && <AddExercise /> }
        </div>
        {workout.exercise_logs.length === 0 ? (
          <p>You haven't added any exercises to this workout yet.</p>
        ) : (
          // First map: Loop over the Exercises
          workout.exercise_logs.map(exercise => (
            <Exercise exercise={exercise} loading={loading} handleSetAdded={handleSetAdded}/>
          ))
        )}
      </div>
    </div>
  );
};