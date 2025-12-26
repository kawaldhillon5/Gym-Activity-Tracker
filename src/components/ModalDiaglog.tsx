import { useLayoutEffect, useRef } from "react";

interface Props {
    isOpen:boolean;
    heading: string
    setIsOpen: (val:boolean)=>void
    onYes : () =>void;
}

export const Modal = (props:Props)=>{

    const dialogRef = useRef<HTMLDialogElement>(null)

    useLayoutEffect(() => {
        
        const dialog = dialogRef.current;
        if (!dialog) return;

        let timeoutId: number;

        if (props.isOpen && !dialog.open) {
            dialog.showModal();
        } 
        else if (!props.isOpen && dialog.open) {
            timeoutId = setTimeout(() => {
                dialog.close();
            }, 300); 
        }

        return () => clearTimeout(timeoutId);
    }, [props.isOpen])

    return (
        <dialog className={`exercise-modal ${!props.isOpen && "dia-close"}`} ref={dialogRef}>
                <h2>{props.heading}</h2>
                <div className="modal-btns">
                    <button className="btn-primary" onClick={props.onYes}>Yes</button>
                    <button className="btn-primary" onClick={()=>props.setIsOpen(false)}>No</button>
                </div>
        </dialog>
    )

}