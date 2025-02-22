import { PropsWithChildren } from "react";
import ReactDOM from "react-dom";
import "./BackDrop.css";

const BackDrop = ({ children }: PropsWithChildren) => {
  return ReactDOM.createPortal(<div className="BackDrop">{children}</div>, document.body);
};

export default BackDrop;
