import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import '../css/workout_page.css'
import { Exercise } from '../components/Exercise';
import { AddExercise } from '../components/AddExercise';
import { Loader,  Pencil, Save, Weight } from 'lucide-react';
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

  const [localExerciseLogCount, setLocalExerciseLogCount] = useState<number>(1)
  const [exerciseNamesForAddList, setExerciseNamesForAddList] =  useState<string[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editStatus, setEditStatus] = useState<EditButtonStatus>("Off")

  const handleSaveSets = async (sets: SetLog[], exerciseLogId: number | null) => {
    const results = await Promise.allSettled(sets.map(async (set) => {
        const addSetResponse = await fetch(`${url}/workouts/set-logs/`, {
            method: "POST",
            headers: {
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

        if (!addSetResponse.ok) {
            const err = await addSetResponse.json();
            throw new Error(err.detail || `Set ${set.set_number} failed`);
        }

        return await addSetResponse.json();
    }));

    // 2. Separate the results
    const successfulSets: SetLog[] = [];
    const failedSets: string[] = []; 
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            successfulSets.push(result.value);
        } else {
            console.error(`Failed to save set ${sets[index].set_number}:`, result.reason);
            failedSets.push(`Set ${sets[index].set_number}`);
        }
    });

    return { successfulSets, failedSets };
}

  const handleRemoveExercisesPerma = async (name:string, id:number)=>{
    setError("")
    try{
      const response = await fetch(`${url}/workouts/exercise-logs/${id}`,{
        method:"DELETE",
        headers:{
          'Authorization': `Bearer ${token}`,
        }
      });

      if(!response.ok){
        const err = await response.json();
        throw new Error(err.detail || "Delete Exercise Failed")
      }

      setTimeout(()=>{setWorkout(prevWorkout => {
        if (!prevWorkout) return null; 

        return {
          ...prevWorkout,
          exercise_logs: prevWorkout.exercise_logs.filter(exercise => exercise.id !== id)
          };
      })}, 300);

    } catch (err: any){
      console.log(err)
      setError(err.message)
    }
    finally{
      return error ? false: true 
    }
  }

  const handleSaveExercises = async () =>{

    if (!token || !workout || !unsavedExercises || unsavedExercises.length === 0) {
      setEditStatus("Off");
      return;
    }
    setError(null);

    let totalFailedSets: string[] = [];
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
        const { successfulSets, failedSets } = await handleSaveSets(exercise.set_logs, newExerciseLog.id);

            newExerciseLog.set_logs = successfulSets;

            // Track failures
            if (failedSets.length > 0) {
                totalFailedSets.push(`${exercise.exercise_name}: [${failedSets.join(', ')}]`);
            }

            // 3. Update State
            remainingExercises = remainingExercises.filter(ex => ex !== exercise);
            setUnsavedExercises(remainingExercises);
        //updated workout state

        setWorkout(prevWorkout => {
            if (!prevWorkout) return null; 
            return {
            ...prevWorkout,
            exercise_logs: [...prevWorkout.exercise_logs, newExerciseLog]
            };
        });

        if (totalFailedSets.length > 0) {
            setError(`Saved with errors. Failed to save some sets: ${totalFailedSets.join(' | ')}`);
        }

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

  const handleRemoveExercise = (exerciseName:string ,id:number) =>{
    setUnsavedExercises(prevLogs => prevLogs.filter(exercise => exercise.exercise_name !== exerciseName));
    return true
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

  const handleSetRemove = async (index:null|number, exericseId:number, local:boolean) =>{

      if(index === null) index = 0

      if(local){
        setUnsavedExercises(prevExercises =>{
          const updatedExerciseLogs = prevExercises.map(exercise => {
            
            if (exercise.id !== exericseId) {
            return exercise;
            }

            return {
            ...exercise, 
            set_logs: exercise.set_logs.filter((log, i)=>{ 
                if(i !==index){
                  return log
                }
              }) 
            };
          });
        
          return updatedExerciseLogs;
        })
        return true
      }else {

        setError("")
        try{
          const response = await fetch(`${url}/workouts/set-logs/${index}`,{
            method:"DELETE",
            headers:{
              'Authorization': `Bearer ${token}`,
            }
          });

          if(!response.ok){
            const err = await response.json();
            throw new Error(err.detail || "Delete Set Failed")
          }

          setTimeout(()=>{setWorkout(prevWorkout => {
            if (!prevWorkout) return null; 

              const updatedExerciseLogs = prevWorkout.exercise_logs.map(exercise => {
              
              if (exercise.id !== exericseId) {
              return exercise;
              }

              return {
              ...exercise, 
              set_logs: exercise.set_logs.filter(log=> log.id !== index) 
              };
            });

            return {
              ...prevWorkout,
              exercise_logs: updatedExerciseLogs
              };
          })}, 300);

        } catch (err: any){
          console.log(err)
          setError(err.message)
        }
        finally{
          return error ? false: true 
        }
      } 
    }

  const handleSetUpdate =  async (index:null|number, exerciseId: number, local:boolean, newSet:SetLog)=>{
    if(index === null) index = 0

      if(local){
        setUnsavedExercises(prevExercises =>{
          const updatedExerciseLogs = prevExercises.map(exercise => {
            
            if (exercise.id !== exerciseId) {
            return exercise;
            }

            return {
            ...exercise, 
            set_logs: exercise.set_logs.map((log, i)=> i !== index? log: newSet) 
            };
          });
        
          return updatedExerciseLogs;
        })
      }else {

        setError("")
        try{
          const response = await fetch(`${url}/workouts/set-logs/${newSet.id}`,{
            method:"PATCH",
            headers:{
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({reps:newSet.reps,weight_kg:newSet.weight_kg,comment:newSet.comment})
          });

          if(!response.ok){
            const err = await response.json();
            throw new Error(err.detail || "Delete Set Failed")
          }

          setTimeout(()=>{setWorkout(prevWorkout => {
            if (!prevWorkout) return null; 

              const updatedExerciseLogs = prevWorkout.exercise_logs.map(exercise => {
              
              if (exercise.id !== exerciseId) {
              return exercise;
              }

              return {
              ...exercise, 
              set_logs: exercise.set_logs.map(log=> log.id !== index? log: newSet) 
              };
            });

            return {
              ...prevWorkout,
              exercise_logs: updatedExerciseLogs
              };
          })}, 300);

        } catch (err: any){
          console.log(err)
          setError(err.message)
        }
      } 
    }
  
    

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
        const filteredExerciseNames =  ExeciseNames.filter(exercise=> !existingExerciseNames.includes(exercise))
        setExerciseNamesForAddList(filteredExerciseNames)
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

  const selectedExeriseName = [...unsavedExercises.map(e => e.exercise_name)]

  if (loading) {
    return <div>Loading your workout...</div>;
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
          {editStatus === "On" && <AddExercise selectedExerciseNames={selectedExeriseName} exerciseNames={exerciseNamesForAddList} onSelected={handelAddExercise} onUnSelected={handleRemoveExercise}/> }
        </div>
        {workout.exercise_logs.length === 0 ? (
          <p>You haven't added any exercises to this workout yet.</p>
        ) : (
          // First map: Loop over the Exercises
          <div className='saved_exercises_div'>
          {
            workout.exercise_logs.map(exercise => (
            <Exercise setError={setError} handleSetRemove={handleSetRemove} handleSetUpdate={handleSetUpdate} key={exercise.id} editStatus={editStatus} exercise={exercise} loading={loading} handleRemove={handleRemoveExercisesPerma} handleSetAdded={handleSetAdded} local={false}/>
          ))
          }  
          </div>
        )}
        {unsavedExercises.length > 0  && <h3>Unsaved Exercises</h3>}
        <div className='unsaved_exercises_div'>
            {
              unsavedExercises.map(exercise => (
              <Exercise setError={setError}  handleSetRemove={handleSetRemove} handleSetUpdate={handleSetUpdate} key={exercise.exercise_name} editStatus={editStatus} exercise={exercise} loading={loading} handleRemove={handleRemoveExercise} handleSetAdded={handleLocalSetAdded} local={true}/>
              ))
            }
        </div>
      </div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
    </div>
  );
};