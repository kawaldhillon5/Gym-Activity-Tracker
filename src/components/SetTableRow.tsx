import { useState } from "react";
import { MorpyhingArrow } from "./MorphyingArrowIcon";

interface SetLog {
  id: number | null;
  set_number: number;
  reps: number;
  weight_kg: number;
  comment: string | null; 
}

type EditButtonStatus = "On"|"Off"|"Saving"

export const TableRow = ({set,editStatus}:{set:SetLog,editStatus:EditButtonStatus})=>{

    const [isExpanded, setIsExpanded] = useState<boolean>(false)

    const handleOnclick = ()=>{
        editStatus === "On" ? handleRemoveSet() : setIsExpanded(prev => !prev)
    }

    const handleRemoveSet = ()=>{
        console.log('set Removed')
    }

    return(
        <>
            <div className="set-table-body-row" key={set.id}>
                <div className="set-table-reps-coloum">{set.reps}</div>
                <div className="set-table-weight-coloum">{set.weight_kg}</div>
                <div><button onClick={handleOnclick} className="set-table-remove-button"><MorpyhingArrow isArrow={editStatus === "Off" || editStatus==="Saving"?true:false} isExpanded={isExpanded}/></button></div>
                <div className={`set-table-comment-div ${isExpanded && "visible"}`} >{set.comment || 'No Comment'}</div>
            </div>            
        </>    
    )

}