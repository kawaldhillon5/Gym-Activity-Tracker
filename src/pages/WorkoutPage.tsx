import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';



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

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [exerciseNameInput, setExerciseNameInput] = useState <string >("")

  const handelAddExercise = async (e : React.FormEvent) =>{
    e.preventDefault();
    setError(null)

    if (!exerciseNameInput.trim() || !workout) {
      setError("Please enter an exercise name.");
      return;
    }

    try {
        const addExerciseResponse = await fetch("http://127.0.0.1:8000/workouts/exercise-logs/",
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
            if (!prevWorkout) return null; // Should never happen, but good for TS
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
  

  useEffect(() => {

    if (!token || !workoutId) {
      setLoading(false);
      return;
    }

    const fetchWorkout = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`http://127.0.0.1:8000/workouts/${workoutId}`, {
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
    <div style={{ padding: '20px' }}>
      <h1>{workout.name}</h1>
      <p>Workout ID: {workout.id} (Linked to Check-in ID: {workout.check_in_id})</p>
      
      <hr />

      <form onSubmit={handelAddExercise} style={{ marginBottom: '20px' }}>
        <h3>Add New Exercise</h3>
        <input 
          type="text"
          value={exerciseNameInput}
          onChange={(e) => setExerciseNameInput(e.target.value)}
          placeholder="e.g., Bench Press"
        />
        <button type="submit">Add Exercise</button>
      </form>

      <div style={{ marginTop: '20px' }}>
        {workout.exercise_logs.length === 0 ? (
          <p>You haven't added any exercises to this workout yet.</p>
        ) : (
          // First map: Loop over the Exercises
          workout.exercise_logs.map(exercise => (
            <div key={exercise.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px', marginBottom: '15px' }}>
              <h2>{exercise.exercise_name}</h2>
              
              <button>Add Set (Coming Soon)</button>
              
              {exercise.set_logs.length === 0 ? (
                <p>No sets logged for this exercise.</p>
              ) : (
                <table style={{ width: '100%', marginTop: '10px' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>Set</th>
                      <th style={{ textAlign: 'left' }}>Weight (kg)</th>
                      <th style={{ textAlign: 'left' }}>Reps</th>
                      <th style={{ textAlign: 'left' }}>Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercise.set_logs.map(set => (
                      <tr key={set.id}>
                        <td>{set.set_number}</td>
                        <td>{set.weight_kg}</td>
                        <td>{set.reps}</td>
                        <td>{set.comment || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};