import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import '../css/workout_page.css'
import { Exercise } from '../components/Exercise';
import { AddExercise } from '../components/AddExercise';
import { Loader,  Pencil, Save } from 'lucide-react';
import { ExeciseNames } from '../assets/data/Exercises';

const url = import.meta.env.VITE_API_URL


interface SetLog {
  id: number | null;
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

type EditButtonStatus = "On"|"Off"|"Saving"



export const WorkoutPage = () => {
  const { workoutId } = useParams<{ workoutId: string }>();
  const { token } = useAuth();
  const location = useLocation();

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [unsavedExercises, setUnsavedExercises] = useState<ExerciseLog[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localExerciseLogCount, setLocalExerciseLogCount] = useState<number>(1)
  const [exerciseNamesForAddList, setExerciseNamesForAddList] =  useState<string[]>([])

  const [editStatus, setEditStatus] = useState<EditButtonStatus>("Off")

  const handleSaveSets = async (sets: SetLog[], exerciseLogId:number| null)=>{

    return Promise.all(sets.map(async set => {
      const addSetResponse  = await fetch(`${url}/workouts/set-logs/`,
                {
                    method: "POST",
                    headers:{
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        exercise_log_id: exerciseLogId,
                        set_number: set.set_number,
                        reps: set.reps,
                        weight_kg: set.weight_kg,
                        comment: set.comment,
                    })
                });

                if(!addSetResponse.ok){
                const err = await addSetResponse.json();
                throw new Error(err.detail || "Error Occured While Trying to create Set Log.");
                }

                const newSetLog: SetLog = await addSetResponse.json();
                return newSetLog
    }))
  }

  const handleSaveExercises = async () =>{

    if (!token || !workout || !unsavedExercises || unsavedExercises.length === 0) {
      setEditStatus("Off");
      return;
    }
    setError(null);

    let remainingExercises = [...unsavedExercises];

    try {
      // Loop through unsaved exercises and send post requests for each
      for (const exercise of unsavedExercises) {
      
        const addExerciseResponse = await fetch(`${url}/workouts/exercise-logs/`,
            {
                method: "POST",
                headers:{
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    exercise_name: exercise.exercise_name,
                    workout_id: workoutId
                })
            }
        );
        if(!addExerciseResponse.ok){
            const err = await addExerciseResponse.json();
            throw new Error(err.detail || "Failed to Save Exercise");
        }

        const newExerciseLog : ExerciseLog = await addExerciseResponse.json();
        // loop through exercises sets and send post requests
        newExerciseLog.set_logs = await handleSaveSets(exercise.set_logs, newExerciseLog.id)

        // remove exercise from unsaved exercise array if sucessfully saved

        remainingExercises = remainingExercises.filter(ex => ex != exercise)
        setUnsavedExercises(remainingExercises)

        //updated workout state

        setWorkout(prevWorkout => {
            if (!prevWorkout) return null; 
            return {
            ...prevWorkout,
            exercise_logs: [...prevWorkout.exercise_logs, newExerciseLog]
            };
        });
      };
    } 
    catch (err: any) {
      console.log(err)
      setError(err.message);
      setUnsavedExercises(remainingExercises)
    }
    finally{
      setEditStatus("Off")
    }

  }

  const handelAddExercise = (exerciseName: string) =>{
    setUnsavedExercises(prevLogs => [...prevLogs, {exercise_name:exerciseName,id:localExerciseLogCount,set_logs:[]}])
    setLocalExerciseLogCount(prev => prev + 1)  
  }

  const handleRemoveExercise = (exerciseName:string) =>{
    setUnsavedExercises(prevLogs => prevLogs.filter(exercise => exercise.exercise_name !== exerciseName));
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

    const handleLocalSetAdded = (newSet: SetLog, id:number)=>{
      setUnsavedExercises(prevExercises=>{

          const updatedExerciseLogs = prevExercises.map(exercise => {
            
            if (exercise.id !== id) {
            return exercise;
            }

            return {
            ...exercise, 
            set_logs: [...exercise.set_logs, newSet] 
            };
        });
        
        return updatedExerciseLogs;
        })
    }

    useEffect(()=>{
      if(editStatus === "Saving"){
        handleSaveExercises()
      }
    },[editStatus])

    useEffect(()=>{
      if(workout){
        const existingExerciseNames = workout.exercise_logs.map(log => log.exercise_name); 
        setExerciseNamesForAddList(ExeciseNames.filter(exercise=> !existingExerciseNames.includes(exercise)))
      }
    },[workout?.exercise_logs])
  
    // Initial Fetch
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
    <div className='workout_div' style={{pointerEvents: editStatus=== "Saving" ?  "none" : "all" }}>
      <div className='workout_div_header'>
        <h2>{workout.name}</h2>
        <button onClick={()=>{setEditStatus((prev)=> prev ===  "On" ? "Saving": "On")}}>{editStatus === "On" && <Save/>} {editStatus === "Off" && <Pencil/>} {editStatus === "Saving" && <Loader/>}</button>
      </div>      
      <div className='exercise_component_div' style={{ marginTop: '20px' }}>
        <div className='exercise_div_header'>
          <h3>Exercises</h3>
          {editStatus === "On" && <AddExercise exerciseNames={exerciseNamesForAddList} onSelected={handelAddExercise} onUnSelected={handleRemoveExercise}/> }
        </div>
        {workout.exercise_logs.length === 0 ? (
          <p>You haven't added any exercises to this workout yet.</p>
        ) : (
          // First map: Loop over the Exercises
          <div className='saved_exercises_div'>
          {
            workout.exercise_logs.map(exercise => (
            <Exercise key={exercise.id} exercise={exercise} loading={loading} handleSetAdded={handleSetAdded} local={false}/>
          ))
          }  
          </div>
        )}
        {unsavedExercises.length > 0  && <h3>Unsaved Exercises</h3>}
        <div className='unsaved_exercises_div'>
            {
              unsavedExercises.map(exercise => (
              <Exercise key={exercise.exercise_name} exercise={exercise} loading={loading} handleSetAdded={handleLocalSetAdded} local={true}/>
              ))
            }
        </div>
      </div>
      
    </div>
  );
};