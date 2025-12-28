import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus } from 'lucide-react';

const url = import.meta.env.VITE_API_URL

interface SetLog {
  id: number | null;
  set_number: number;
  reps: number;
  weight_kg: number;
  comment: string | null; 
}

interface AddSetLogFormProps {
  exerciseLogId: number | null;
  setNum: number;
  local:boolean
  onSetAdded: (newSet: SetLog) => void;
  editOn:boolean; 
}

export const AddSetLogForm = (props: AddSetLogFormProps) =>{
    const [newSetReps, setNewSetReps] = useState <number>(0)
    const [newSetWeights, setNewSetWeights] = useState <number>(0)
    const [newSetComments, setNewSetComments] = useState <string> ("")
    
    const [isActive, setIsActive] = useState <Boolean>(false)
    const [error, setError] = useState <string | null>(null)

    const {token} = useAuth()

    const changeActiveState = () =>{
        setIsActive((prev) => {return !prev})
    }

    const handleAddSet = async (e : React.FormEvent) =>{
        e.preventDefault()
        setError(null)
        if(props.local == false){
            try {
                const addSetResponse  = await fetch(`${url}/workouts/set-logs/`,
                {
                    method: "POST",
                    headers:{
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        exercise_log_id: props.exerciseLogId,
                        set_number: props.setNum,
                        reps: newSetReps,
                        weight_kg: newSetWeights,
                        comment: newSetComments,
                    })
                });

                if(!addSetResponse.ok){
                const err = await addSetResponse.json();
                throw new Error(err.detail || "Error Occured While Trying to create Set Log.");
                }

                const newSetLog: SetLog = await addSetResponse.json();
                props.onSetAdded(newSetLog);

                changeActiveState()
                setNewSetReps(0)
                setNewSetWeights(0)
                setNewSetComments("")
            } catch (err: any) {
                setError(err.message);
            }
        } else {
            const newSetLog: SetLog = {
                id: props.setNum,
                set_number: props.setNum,
                reps: newSetReps,
                weight_kg: newSetWeights,
                comment: newSetComments
            }

            props.onSetAdded(newSetLog);

                changeActiveState()
                setNewSetReps(0)
                setNewSetWeights(0)
                setNewSetComments("")
        }
    }



    return (
        <div className={isActive ? "add_set_form_active":"add_set_form"}>
            { isActive ?
                <>
                    <form onSubmit={handleAddSet}>
                        <h3>Add Set no. {props.setNum}</h3>
                        <fieldset>
                        <label htmlFor="setReps">Set Reps </label>
                        <input
                            required
                            name='setReps' 
                            type="number" 
                            value={newSetReps}
                            onChange={(e)=>{setNewSetReps(Number(e.target.value))}}
                        />
                        </fieldset>
                        <fieldset>
                            <label htmlFor="setWeight">Weights(kg) </label>
                            <input
                                required
                                type="number" 
                                name='setWeight'
                                value={newSetWeights}
                                onChange={(e)=>{setNewSetWeights(Number(e.target.value))}}    
                            />
                        </fieldset>
                        <fieldset>
                            <label htmlFor="setComment">Comments </label>
                            <input 
                                type="text" 
                                name='setComments'
                                value={newSetComments}
                                onChange={(e)=>{setNewSetComments(e.target.value)}}    
                            />
                        </fieldset>
                        <div>
                            <button type='submit'>Add Set</button>
                            <button onClick={changeActiveState} type='button'>Close</button>
                        </div>
                    </form>
                {error && <p style={{color: 'red'}}>{error}</p>}
                </>
                :
                <>            
                    <h4 className='add-set-form-header-text'>Sets</h4>
                    {props.editOn &&<button onClick={changeActiveState}>{<Plus/>}</button>}
                </>
            }
        </div>
    )
}