
export function BenchPressIcon({size}:{size:number}){
  return(
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Bench */}
    <rect x="10" y="65" width="80" height="8" fill="#7a7a7aff"/> 
    <rect x="20" y="70" width="8" height="17" fill="#7a7a7aff"/> 
    <rect x="60" y="70" width="8" height="17" fill="#7a7a7aff"/> 
    
    {/* Torso */}
    <rect x="30" y="55" width="30" height="14" rx="4" fill="#d3d3d3ff"/>

    {/* Head */}
    <circle cx="25" cy="61" r="7" fill="#d3d3d3ff"/>

    {/* Legs */}
    <path d="M 58 63 L 72 63 L 72 82" stroke="#d3d3d3ff" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>

    {/* Foot */}
    <rect x="67" y="80" width="15" height="7" rx="2" fill="#d3d3d3ff"/> 

    {/* Arms */}
    <path d="M 40 63 L 40 45" stroke="#d3d3d3ff" strokeWidth="10" strokeLinecap="round"/>

    {/* Bar Bell */}
    <circle cx="40" cy="40" r="8" fill="#7a7a7aff"/>

   </svg>
  )
}

export const DefaultIcon = ({size}:{size:number}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 6.5h11" stroke="#52525b"/>
        <path d="M6.5 17.5h11" stroke="#52525b"/>
        <path d="M6.5 6.5v11" stroke="#52525b"/>
        <path d="M17.5 6.5v11" stroke="#52525b"/>
    </svg>
);


  