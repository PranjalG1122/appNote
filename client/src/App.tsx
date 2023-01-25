import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
          <div className="flex flex-col items-center gap-2 text-black">
            <h1 className="desktop:text-6xl text-4xl font-semibold">appNote</h1>
            <p className="desktop:text-2xl text-lg text-center px-2 py-1">
              The best <span className="font-semibold">app</span>
              lication to write a{" "}
              <span className="font-semibold">note</span>
            </p>
            <Link to="/auth">
              <p 
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:bg-gradient-to-br focus:outline-none shadow-md shadow-blue-800/80 font-semibold rounded text-xl p-2 text-center">
              Start now
              </p>
            </Link>
          </div>
        </Container>
      )}
    </>
  );
}
