import { useCallback, useEffect, useRef, useState } from "react";
import { MorpyhingArrow } from "./MorphyingArrowIcon";
import { Loader, QuoteIcon } from "lucide-react";
import { NumberPicker } from "./NumberPicker";
import { InputGroup } from "./InputGroup";

interface SetLog {
  id: number | null;
  set_number: number;
  reps: number;
  weight_kg: number;
  comment: string | null; 
}

interface FormSetData {
  reps: number;
  weight: number;
  comment: string | null;
}

type EditButtonStatus = "On"|"Off"|"Saving"
type RemoveButtonStatus = "Idle"|"Sucess"|"Error"|"Loading"

export const TableRow = ({set,editStatus, index, handleSetRemove, local, exerciseId, handleSetUpdate}:{handleSetUpdate: (index:null|number, exerciseId: number, local:boolean, newSet:SetLog)=>void,exerciseId:number,local:boolean,set:SetLog,editStatus:EditButtonStatus, index:number,handleSetRemove:(index:null|number, exerciseId:number, local:boolean)=>Promise<boolean>})=>{


    const [formData, setFormData] = useState<FormSetData>({
        reps: set.reps,
        weight: set.weight_kg,
        comment: set.comment,
    });

    const [isExpanded, setIsExpanded] = useState<boolean>(false)
    const [removeBtnState, setRemoveBtnState] = useState<RemoveButtonStatus>("Idle")
    const expandedRef = useRef<boolean>(false)

    const debounceTimeoutRef  = useRef<number | undefined>(undefined)

    const rowRef = useRef<HTMLDivElement>(null)

    const handleOnclick = ()=>{
        editStatus === "On" ? handleRemoveSet() : setIsExpanded(prev => {
            expandedRef.current = !prev
            return !prev
        })
        
    }

    const handleRemoveSet = async()=>{
        if(!local){
            setRemoveBtnState("Loading")
            setTimeout(async()=>{
                const res = await handleSetRemove(set.id,exerciseId,local)
                if(res === true){                                                         
                    setRemoveBtnState("Sucess")
                } else {
                    setRemoveBtnState("Error")
                }
            },200)
        } else{
            handleSetRemove(rowRef.current?.dataset.index ? Number(rowRef.current?.dataset.index):0 , exerciseId,local)
        }
    }

    const debouncedUpdate = useCallback((newSetData: any) => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            const newSet: SetLog = {
                    id:set.id,
                    reps:newSetData.reps,
                    weight_kg:newSetData.weight,
                    comment:newSetData.comment,
                    set_number:set.set_number
                }
                handleSetUpdate(index,exerciseId,local, newSet) 
        }, 1000);
    }, []);

    const handleChange = (name:string, value:number|string|null) => {
            setFormData(prev => {
                const newData = { ...prev, [name]: value };
                debouncedUpdate(newData)
                return newData;
            }); 
    };


    useEffect(()=>{
        let timeoutId = undefined;
        if(removeBtnState === "Error" || removeBtnState === "Sucess"){
            timeoutId = setTimeout(() => {
                setRemoveBtnState("Idle")
            }, 500);
        }

        return ()=> clearTimeout(timeoutId)
    },[removeBtnState]);

    useEffect(()=>{
        editStatus==="On" ? setIsExpanded(true) : setIsExpanded(expandedRef.current)
        
    },[editStatus])

    return(
        <>
            <div ref={rowRef} className="set-table-body-row" data-index={index} key={index}>
                <div className="set-table-reps-coloum">{editStatus=== "On" ? <NumberPicker name="reps" onChange={handleChange} initial={1} final={100} increment={1} numbr={formData.reps} editMode={editStatus === "On" ? true:false}/> : formData.reps}</div>
                <div className="set-table-weight-coloum">{editStatus=== "On" ? <NumberPicker name="weight" onChange={handleChange} initial={0} final={300} increment={5} numbr={formData.weight} editMode={editStatus === "On" ? true:false}/> : formData.weight}</div>
                <div>
                    <button 
                        onClick={handleOnclick} 
                        className={`set-table-remove-button ${(editStatus === "On" ) && "isMinus"} ${removeBtnState == "Error" && "remove-btn-error"} ${removeBtnState === "Sucess" && "remove-btn-sucess"}`}>
                        {removeBtnState === "Loading" ?<Loader/> :<MorpyhingArrow isArrow={editStatus === "Off" || editStatus==="Saving"?true:false} isExpanded={isExpanded}/>}
                    </button>
                </div>
                { editStatus === "On" ?
                    <div className={`set-table-comment-div ${isExpanded && "visible"}`}><InputGroup
                        icon={<QuoteIcon/>}
                        type="text"
                        name="comment"
                        value={formData.comment === null ? "": formData.comment}
                        placeholder={formData.comment === null || formData.comment === "" ? "No Comment": formData.comment}
                        onChange={(e)=>{handleChange("comment",e.target.value)}}
                        isValid={true}
                        isTouched={false}
                        errorMsg=""
                        
                    /></div> :
                    <div className={`set-table-comment-div ${isExpanded && "visible"}`} >{set.comment || 'No Comment'}</div>
                }
            </div>            
        </>    
    )

}