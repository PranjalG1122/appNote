import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Link } from "react-router-dom";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Home page</p>
      <Link to="/auth">Go to Auth</Link>
    </div>
  );
}
