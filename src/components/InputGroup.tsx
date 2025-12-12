import type { ReactNode } from "react";
import { CheckCircle, AlertCircle} from "lucide-react";
import "../css/Inputgroup.css";

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: ReactNode;
  isValid: boolean;
  isTouched: boolean;
  errorMsg: string;
}

export function InputGroup({ icon, isValid, isTouched, errorMsg, ...props }: InputGroupProps){

  const hasValue = props.value && (props.value as string).length > 0;
  
  let fieldClass = "input-field";
  let iconClass = "icon-default";

  if (isTouched) {
    if (isValid) {
      fieldClass += " valid";
      iconClass = "icon-valid";
    } else if (hasValue) {
      fieldClass += " error";
      iconClass = "icon-error";
    }
  }

  return (
    <div className="input-group-container">
      <div className={`input-icon-wrapper ${iconClass}`}>
        {icon}
      </div>
      <input
        {...props}
        className={fieldClass}
      />
      {/* Validation Status Indicator */}
      <div className="status-icon-wrapper">
        {isTouched && isValid && <CheckCircle size={18} className="text-emerald-500" />}
        {isTouched && !isValid && hasValue && <AlertCircle size={18} className="text-red-500" />}
      </div>
      
      {/* Error Message */}
      <div className={`error-message-container ${isTouched && !isValid && hasValue ? 'visible' : ''}`}>
        <p className="error-text">{errorMsg}</p>
      </div>
    </div>
  );

}