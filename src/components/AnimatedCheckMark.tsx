import "../css/AnimatedCheckMark.css"

interface Props {
  height: number,
  width: number
}

export function AnimatedCheckmark(props : Props){
    return (
    <div className="animated_check_mark">
      <div className="relative">
        <svg
          width={props.width}
          height={props.height}
          viewBox="0 0 100 100"
          className="checkmark-svg"
        >
          <path
            d="M 25 50 L 42 67 L 75 34"
            fill="none"
            stroke="#000000"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="checkmark-path"
          />
        </svg>
      </div>
    </div>
  );
}