import { AddSetLogForm } from "./AddSetLog";

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

export const Exercise = ({exercise, loading, handleSetAdded}:{exercise:ExerciseLog, loading:boolean, handleSetAdded: (newSet:SetLog, id:number)=>void}) =>{

    return(
        <div className={loading ? "exercise_component_loading set_item" : "exercise_component set_item"} key={exercise.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px', marginBottom: '15px' }}>
            <h2>{exercise.exercise_name}</h2>
                <AddSetLogForm setNum = {exercise.set_logs.length + 1} exerciseLogId = {exercise.id} onSetAdded={(newSet) => handleSetAdded(newSet, exercise.id)} />              
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
        </div>
    )

}