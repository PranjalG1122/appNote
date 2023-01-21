import React, { useEffect, useState } from "react";
import "./App.css";
import { Link } from "react-router-dom";
import useSWRMutation from "swr/mutation";
import { TokenBody } from "./components/TokenBody";
import Container from "./components/Container";
import { useNavigate } from "react-router-dom";
import Notes from "./components/Notes";



export default function App() {
  const navigate = useNavigate();
  document.title = "appNote";
  
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  useEffect(() => {
    const cookie = document.cookie.split(";")[0].split("=")[1];
    if (cookie === "" || cookie === undefined) {
      setIsSignedIn(false);
      return;
    }
    if (TokenBody(cookie)?.exp > Date.now() / 1000) {
      setIsSignedIn(true);
      return;
    }
    setIsSignedIn(false);
  }, []);
  return (
    <>
      {(isSignedIn && <Notes></Notes>) || (
        <Container>
          <div className="flex flex-col items-center gap-2">
            <h1 className="desktop:text-6xl text-4xl font-semibold">appNote</h1>
            <p className="desktop:text-2xl text-lg text-center px-2 py-1 bg-black text-gray-300">
              The best <span className="font-semibold text-gray-100">app</span>
              lication to write a{" "}
              <span className="font-semibold text-gray-100">note</span>
            </p>
            <Link to="/auth">
              <p className="text-white bg-gradient-to-r from-violet-500 via-purple-600 to-fuchsia-600 hover:bg-gradient-to-br focus:ring-2 focus:outline-none focus:ring-purple-800 shadow-md shadow-purple-800/80 font-semibold rounded text-base px-4 py-2 text-center">
                Start now
              </p>
            </Link>
          </div>
        </Container>
      )}
    </>
  );
}
