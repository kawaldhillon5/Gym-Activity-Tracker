import { useEffect, useMemo, useRef, useState } from "react";
import type { UIEvent } from "react";
import '../css/NumberPicker.css';

interface Props {
    editMode: boolean; 
    name:string;
    numbr: number;     
    initial: number;   
    final: number;     
    increment: number; 
    onChange: (name:string,val: number|string|null) => void; 
}

const ITEM_HEIGHT = 20; 

export const NumberPicker = (props: Props) => {

    const numbersArr = useMemo(() => {
        let arr = [];
        arr.push(null); 
        
        for (let i = props.initial; i <= props.final; i += props.increment) {
            arr.push(Math.round(i * 100) / 100); 
        }
        
        arr.push(null);
        return arr;
    }, [props.initial, props.final, props.increment]);

    const containerRef = useRef<HTMLDivElement>(null);
    const [localMainNumber, setLocalMainNumber] = useState<number>(props.numbr);

    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        
        const scrollTop = e.currentTarget.scrollTop;

        const index = Math.round(scrollTop / ITEM_HEIGHT);

        const targetValue = numbersArr[index+1]; 

        if (typeof targetValue === 'number' && targetValue !== localMainNumber) {
            setLocalMainNumber(targetValue);
            props.onChange(props.name,targetValue)
        }
    };

    const mainNumberIndex = useMemo(()=>{
        return numbersArr.indexOf(localMainNumber)
    },[localMainNumber, numbersArr])

    // 4. Initial Scroll Position
    useEffect(() => {
        if (containerRef.current) {
            const dataIndex = numbersArr.indexOf(props.numbr);
            
            if (dataIndex > -1) {
                const scrollPos = (dataIndex - 1) * ITEM_HEIGHT;
                
                containerRef.current.scrollTo({
                    top: scrollPos,
                    behavior: 'instant' 
                });
            }
        }
    }, [props.numbr, numbersArr]); 

    return (
        <div 
            ref={containerRef}
            className="number-picker-main" 
            onScroll={handleScroll}
        >
            {numbersArr.map((num, index) => {
                const isSnapped = num === localMainNumber;
                
                if (num === null) {
                    return <p key={`pad-${index}`} className="num-padding">0</p>;
                }

                return (
                    <p 
                        key={num} 
                        className={`${isSnapped ? "num-snapped" : ""} ${mainNumberIndex < index ? "tilt-down": mainNumberIndex > index ?"tilt-up": ""}`}
                        onClick={() => {

                        }}
                    >
                        {num}
                    </p>
                );
            })}
        </div>
    );
}