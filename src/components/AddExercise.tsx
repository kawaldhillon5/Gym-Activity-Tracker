import { useEffect, useRef, useState } from 'react';
import * as AllIcons from '../assets/data/Exercise_icons/ExerciseIcons';
import { XIcon } from 'lucide-react';
import { useOnClickOutside } from '../contexts/OnClickOutside';

import "../css/AddExercise.css"

interface CreateItemProps {
    isOpen:boolean
    exerciseName: string;
    isSelected: boolean;
    onSelected : (name:string) =>void;
    onUnSelected : (name:string, id:number) =>void
    delay: string
}

interface AddExerciseProps{
    onSelected : (name:string) =>void;
    onUnSelected : (name:string, id:number) =>void;
    exerciseNames : string[];
    selectedExerciseNames: string[];
}

export  function AddExercise({onSelected, onUnSelected, exerciseNames, selectedExerciseNames}: AddExerciseProps){

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
            <XIcon className={`${isOpen ? "add-btn-active":"add-btn-inactive"}`}/>
            </button>
            <div 
                className={`add_exercise_modal ${isOpen ? "add_exercise_modal_expanded":""}`}
                style={{ padding: isOpen ? "60px 15px 15px 15px": "0px", border: isOpen ? "1px solid var(--border-subtle)" : "0px" , width: isOpen ? "200px": "50px"}}
            >
                {exerciseNames.map((name, i)=>(
                    <CreateListItem key={name} isOpen={isOpen} isSelected={selectedExerciseNames.includes(name)} exerciseName={name} onSelected={onSelected} onUnSelected={onUnSelected} delay={`${(i + 1)}00ms`}/>
                ))
                }
            </div>
        </div>
    )
}

function CreateListItem({isOpen ,exerciseName, isSelected, onSelected, onUnSelected, delay}:CreateItemProps){


    const [transitionDelay, setTransitionDelay] = useState<string>("0ms")

    const iconComponentName = `${exerciseName.replace(/\s+/g, '')}Icon`;
    const IconComponent = (AllIcons as any)[iconComponentName] || AllIcons.DefaultIcon;

    const handleClick = ()=>{
        if (isSelected) {
            onUnSelected(exerciseName, 0);
        } else {
            onSelected(exerciseName);
        }
    };

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


    return (
        <button
            key={exerciseName} 
            onClick={handleClick}
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
