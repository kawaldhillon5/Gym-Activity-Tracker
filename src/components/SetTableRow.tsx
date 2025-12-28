import { useEffect, useRef, useState } from "react";
import { MorpyhingArrow } from "./MorphyingArrowIcon";
import { Loader } from "lucide-react";

interface SetLog {
  id: number | null;
  set_number: number;
  reps: number;
  weight_kg: number;
  comment: string | null; 
}

type EditButtonStatus = "On"|"Off"|"Saving"
type RemoveButtonStatus = "Idle"|"Sucess"|"Error"

export const TableRow = ({set,editStatus, index, handleSetRemove, local, exerciseId}:{exerciseId:number,local:boolean,set:SetLog,editStatus:EditButtonStatus, index:number,handleSetRemove:(index:null|number, exerciseId:number, local:boolean)=>Promise<boolean>})=>{

    const [isExpanded, setIsExpanded] = useState<boolean>(false)
    const [removeLoading, setRemoveLoading] = useState<boolean>(false)
    const [removeError, setRemoveError] = useState<RemoveButtonStatus>("Idle")




    const rowRef = useRef<HTMLDivElement>(null)

    const handleOnclick = ()=>{
        editStatus === "On" ? handleRemoveSet() : setIsExpanded(prev => !prev)
    }

    const handleRemoveSet = async()=>{
        if(!local){
            setRemoveLoading(true)
            setTimeout(async()=>{
                const res = await handleSetRemove(set.id,exerciseId,local)
                if(res === true){                                                         
                    setRemoveLoading(false)
                    setRemoveError("Sucess")
                } else {
                    setRemoveLoading(false)
                    setRemoveError("Error")
                }
            },200)
        } else{
            handleSetRemove(rowRef.current?.dataset.index ? Number(rowRef.current?.dataset.index):0 , exerciseId,local)
        }
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
        <>
            <div ref={rowRef} className="set-table-body-row" data-index={index} key={index}>
                <div className="set-table-reps-coloum">{set.reps}</div>
                <div className="set-table-weight-coloum">{set.weight_kg}</div>
                <div>
                    <button 
                        onClick={handleOnclick} 
                        className={`set-table-remove-button ${removeError == "Error" && "remove-btn-error"} ${removeError == "Sucess" && "remove-btn-sucess"}`}>
                        {removeLoading ?<Loader/> :<MorpyhingArrow isArrow={editStatus === "Off" || editStatus==="Saving"?true:false} isExpanded={isExpanded}/>}
                    </button>
                </div>
                <div className={`set-table-comment-div ${isExpanded && "visible"}`} >{set.comment || 'No Comment'}</div>
            </div>            
        </>    
    )

}