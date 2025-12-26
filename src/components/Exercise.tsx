import { Loader, Trash2Icon } from "lucide-react";
import { AddSetLogForm } from "./AddSetLog";
import { useEffect, useState } from "react";
import { Modal } from "./ModalDiaglog";

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

type EditButtonStatus = "On"|"Off"|"Saving"

type RemoveButtonStatus = "Idle"|"Sucess"|"Error"


export const Exercise = ({exercise, editStatus, loading, handleSetAdded, local, handleRemove}:{exercise:ExerciseLog ,loading:boolean, local:boolean ,editStatus: EditButtonStatus ,handleSetAdded: (newSet:SetLog, id:number)=>void, handleRemove: (name:string, id:number)=>Promise<boolean> | boolean}) =>{

    const [modalState, setModalState] = useState<boolean>(false)
    const [removeLoading, setRemoveLoading] = useState<boolean>(false)
    const [removeError, setRemoveError] = useState<RemoveButtonStatus>("Idle")

    const handleModalYes = async ()=>{
        setModalState(false)
        if(!local) {setRemoveLoading(true)}
        setTimeout(async ()=>{
            const res = await handleRemove(exercise.exercise_name,exercise.id)
            console.log(res)
            if(res === true){                                                         
                setRemoveLoading(false)
                setRemoveError("Sucess")
            } else {
                setRemoveLoading(false)
                setRemoveError("Error")
            }
        },200)
    }

    useEffect(()=>{
        let timeoutId = undefined;
        if(removeError){
            timeoutId = setTimeout(() => {
                setRemoveError("Idle")
            }, 500);
        }

        return ()=> clearTimeout(timeoutId)
    },[removeError])

    return(
        <div className={loading ? "exercise_component_loading set_item" : "exercise_component set_item"} key={exercise.id}>
            <div className="exercise-item-header">
                <h2>{exercise.exercise_name}</h2>
                {editStatus === "On" && <button
                    onClick={()=>{setModalState(prev => !prev)}}
                    className={`exercise-remove-btn ${removeError == "Error" && "remove-btn-error"} ${removeError == "Sucess" && "remove-btn-sucess"}`}
                >
                    { removeLoading ? <Loader/> : <Trash2Icon/>}
                </button>}
            </div>
            <AddSetLogForm setNum = {exercise.set_logs.length + 1} exerciseLogId = {exercise.id} local={local} onSetAdded={(newSet) => handleSetAdded(newSet, exercise.id)} />              
            {exercise.set_logs.length === 0 ? (
            <p>No sets logged for this exercise.</p>
            ) : (
            <table id='set_table' style={{ width: '100%', marginTop: '10px' }}>
                <thead>
                <tr>
                    <th >Set</th>
                    <th >Weight (kg)</th>
                    <th >Reps</th>
                    <th >Comment</th>
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
        <Modal heading={`Delete ${exercise.exercise_name}?`} isOpen={modalState} onYes={handleModalYes} setIsOpen={setModalState} />
        </div>
    )

}