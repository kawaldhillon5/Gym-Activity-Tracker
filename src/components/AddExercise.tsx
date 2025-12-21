import { useRef, useState } from 'react';
import * as AllIcons from '../assets/data/Exercise_icons/ExerciseIcons';
import { ExeciseNames } from '../assets/data/Exercises';
import { Plus, XIcon } from 'lucide-react';
import { useOnClickOutside } from '../contexts/OnClickOutside';

import "../css/AddExercise.css"

interface Props {
    exerciseName: string;
    onClick: () => void;
    delay: string
}

export  function AddExercise(){

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
                {isOpen ? <XIcon/>:<Plus />}
            </button>
            <div 
                className={`add_exercise_modal ${isOpen ? "add_exercise_modal_expanded":""}`}
                style={{ padding: isOpen ? "60px 15px 15px 15px": "0px", border: isOpen ? "1px solid var(--border-subtle)" : "0px" , width: isOpen ? "200px": "50px"}}
            >
                {ExeciseNames.map((name, i)=>(
                    <CreateListItem exerciseName={name} onClick={()=>{console.log(name)}} delay={`${(i + 1)}00ms`}/>
                ))
                }
            </div>
        </div>
    )
}

function CreateListItem({exerciseName, onClick, delay}:Props){
        const iconComponentName = `${exerciseName.replace(/\s+/g, '')}Icon`;
        const IconComponent = (AllIcons as any)[iconComponentName] || AllIcons.DefaultIcon;

        return (
        <button 
            onClick={onClick}
            className="add_exercise_item"
            style={{transitionDelay:delay}}
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
