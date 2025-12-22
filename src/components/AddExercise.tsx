import { useEffect, useRef, useState } from 'react';
import * as AllIcons from '../assets/data/Exercise_icons/ExerciseIcons';
import { XIcon } from 'lucide-react';
import { useOnClickOutside } from '../contexts/OnClickOutside';

import "../css/AddExercise.css"

interface CreateItemProps {
    isOpen:boolean
    exerciseName: string;
    onSelected : (name:string) =>void;
    onUnSelected : (name:string) =>void
    delay: string
}

interface AddExerciseProps{
    onSelected : (name:string) =>void;
    onUnSelected : (name:string) =>void
    exerciseNames : string[]
}

export  function AddExercise({onSelected, onUnSelected, exerciseNames}: AddExerciseProps){

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(dropdownRef, () => {
            setIsOpen(false)
        }
    );

    
    return (

        <div ref ={dropdownRef}
            className='add_exercise_div'
        >
            <button
                onClick={()=>{setIsOpen((prev)=> !prev)}}
                className={`add_exercise_btn ${isOpen ? "add_exercise_btn_open":""}`}
            >
            <XIcon className={`${isOpen && "add-btn-active"}`}/>
            </button>
            <div 
                className={`add_exercise_modal ${isOpen ? "add_exercise_modal_expanded":""}`}
                style={{ padding: isOpen ? "60px 15px 15px 15px": "0px", border: isOpen ? "1px solid var(--border-subtle)" : "0px" , width: isOpen ? "200px": "50px"}}
            >
                {exerciseNames.map((name, i)=>(
                    <CreateListItem key={name} isOpen={isOpen} exerciseName={name} onSelected={onSelected} onUnSelected={onUnSelected} delay={`${(i + 1)}00ms`}/>
                ))
                }
            </div>
        </div>
    )
}

function CreateListItem({isOpen ,exerciseName, onSelected, onUnSelected, delay}:CreateItemProps){

    const [isSelected, setIsSelcted]= useState<boolean>(false)

    const [transitionDelay, setTransitionDelay] = useState<string>("0ms")

    const iconComponentName = `${exerciseName.replace(/\s+/g, '')}Icon`;
    const IconComponent = (AllIcons as any)[iconComponentName] || AllIcons.DefaultIcon;

    useEffect(()=>{
        setTransitionDelay(delay)
        let timeOut = undefined
        if (isOpen)
            {timeOut = setTimeout(()=>{
                setTransitionDelay("0ms")
            },1000)
        }

        return () =>clearTimeout(timeOut)
    },[isOpen])

    useEffect(()=>{
        isSelected ? onSelected(exerciseName) : onUnSelected(exerciseName)
    },[isSelected])

    return (
        <button
            key={exerciseName} 
            onClick={()=> setIsSelcted(prev => !prev)}
            className={`${isSelected && 'item_selected'} add_exercise_item `}
            style={{transitionDelay:transitionDelay}}
        >
            <div className="add_exercise_item_icon">
                <IconComponent size={40} />
            </div>

            <div className="add_exercise_item_name" >
            {exerciseName}
            </div>

        </button>
    );
}
