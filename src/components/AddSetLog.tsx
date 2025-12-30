import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Loader, Plus } from 'lucide-react';

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
  setError: (val: string|null) => void; 
}

type ButtonStatus = "Idle"|"Sucess"|"Error"|"Loading"


export const AddSetLogForm = (props: AddSetLogFormProps) =>{

    const [buttonState, setButtonState] = useState<ButtonStatus>("Idle")

    const {token} = useAuth()

    const handleAddSet = async () =>{
        props.setError(null)
        setButtonState("Loading")
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
                        reps: 1,
                        weight_kg: 0,
                        comment: "",
                    })
                });

                if(!addSetResponse.ok){
                const err = await addSetResponse.json();
                throw new Error(err.detail || "Error Occured While Trying to create Set Log.");
                }

                setButtonState("Sucess")

                const newSetLog: SetLog = await addSetResponse.json();
                props.onSetAdded(newSetLog);

            } catch (err: any) {
                setButtonState("Error")
                props.setError(err.message);
            }
        } else {
            const newSetLog: SetLog = {
                id: props.setNum,
                set_number: props.setNum,
                reps: 1,
                weight_kg: 0,
                comment: ""
            }
            setButtonState("Sucess")
            props.onSetAdded(newSetLog);

        }
    }

    useEffect(()=>{
        let timeOutId = undefined
        if(buttonState ==="Error" || buttonState === "Sucess"){
            timeOutId = setTimeout(()=>{
                setButtonState("Idle")
            },400)
        }

        return ()=>{clearTimeout(timeOutId)}
    },[buttonState])

    return (
        <div className="add_set_form">
            <>            
                <h4 className='add-set-form-header-text'>Sets</h4>
                {props.editOn &&<button className={`add-set-btn ${buttonState}`} onClick={handleAddSet}>{buttonState === "Loading"? <Loader/> :<Plus/>}</button>}
            </>
        </div>
    )
}