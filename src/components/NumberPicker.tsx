import {  useEffect, useMemo, useRef, } from "react";
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
    const containerRef = useRef<HTMLDivElement>(null);
    

    const pickerValues = useMemo(() => {
        const arr: (number | null)[] = [null]; 
        for (let i = props.initial; i <= props.final; i += props.increment) {
            arr.push(i);
        }
        arr.push(null); 
        return arr;
    }, [props.initial, props.final, props.increment]);


    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
        const scrollTop = e.currentTarget.scrollTop;
        
        const visualIndex = Math.round(scrollTop / ITEM_HEIGHT);
        

        const selectedValue = pickerValues[visualIndex + 1];

        if (typeof selectedValue === 'number') {
            if (selectedValue !== props.numbr) {
               props.onChange(props.name, selectedValue);
            }
        }
    };

    useEffect(() => {
        if (containerRef.current) {

            const targetIndex = pickerValues.indexOf(props.numbr);

            if (targetIndex > 0) {

                const scrollPos = (targetIndex - 1) * ITEM_HEIGHT;

                requestAnimationFrame(() => {
                    containerRef.current?.scrollTo({
                        top: scrollPos,
                        behavior: 'instant' 
                    });
                });
            }
        }
    }, []); 

    return (
        <div 
            ref={containerRef}
            className="number-picker-main" 
            onScroll={handleScroll}
            style={{ height: ITEM_HEIGHT * 3 }}
        >
            {pickerValues.map((val, index) => {
                if (val === null) {
                    return <div key={`pad-${index}`} className="num-padding" style={{height: ITEM_HEIGHT}} />;
                }
                
                const isSelected = val === props.numbr;
                
                return (
                    <div 
                        key={val} 
                        className={`num-item ${isSelected ? 'num-snapped' : ''}`}
                        style={{height: ITEM_HEIGHT, lineHeight: `${ITEM_HEIGHT}px`}}
                    >
                        {val}
                    </div>
                );
            })}
        </div>
    );
}