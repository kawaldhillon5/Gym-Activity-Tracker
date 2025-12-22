import '../css/MorphyingUserIcon.css'

export default function MorphUser({isUser}:{isUser:boolean}) {

  return (
          <svg
            width="30"
            height="30"
            viewBox="0 0 100 100"
            className="morph-icon"
          >
            {/* Head/Top-left to bottom-right line */}
            <circle
              cx="50"
              cy="30"
              r="15"
              fill="none"
              stroke="#ffffffff"
              strokeWidth="6"
              strokeLinecap="round"
              className={`morph-head ${isUser ? 'user-mode' : 'x-mode'}`}
            />
            
            {/* Body/Bottom-left to top-right line */}
            <path
              d="M 25 85 Q 25 60, 50 60 Q 75 60, 75 85"
              fill="none"
              stroke="#ffffffff"
              strokeWidth="6"
              strokeLinecap="round"
              className={`morph-body ${isUser ? 'user-mode' : 'x-mode'}`}
            />

            {/* X lines (hidden in user mode) */}
            <line
              x1="30"
              y1="30"
              x2="70"
              y2="70"
              stroke="#ffffffff"
              strokeWidth="6"
              strokeLinecap="round"
              className={`x-line-1 ${isUser ? 'hidden-line' : 'visible-line'}`}
            />
            <line
              x1="70"
              y1="30"
              x2="30"
              y2="70"
              stroke="#ffffffff"
              strokeWidth="6"
              strokeLinecap="round"
              className={`x-line-2 ${isUser ? 'hidden-line' : 'visible-line'}`}
            />
          </svg>
  );
}