import "../css/MorphyingArrowIcon.css"

export const MorpyhingArrow = ({isArrow, isExpanded}:{isArrow:boolean, isExpanded:boolean})=>{
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 100 100"
            className="morph-icon"
          >
            {/* Left line of arrow / left part of minus */}
            <line
              x1="5"
              y1="45"
              x2="50"
              y2="65"
              stroke={isArrow ? "Black": "Red"}
              strokeWidth="6"
              strokeLinecap="round"
              className={`arrow-left ${isExpanded && isArrow ? "arrow-up-mode" : !isExpanded && isArrow ? 'arrow-down-mode' : 'minus-mode'}`}
            />
            
            {/* Right line of arrow / right part of minus */}
            <line
              x1="95"
              y1="45"
              x2="50"
              y2="65"
              stroke={isArrow ? "Black": "Red"}
              strokeWidth="6"
              strokeLinecap="round"
              className={`arrow-right ${isExpanded && isArrow ? "arrow-up-mode" : !isExpanded && isArrow ? 'arrow-down-mode' : 'minus-mode'}`}
            />
          </svg>
    )
}