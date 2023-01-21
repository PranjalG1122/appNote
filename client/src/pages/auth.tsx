import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Signup from "../components/Signup";
import Signin from "../components/Signin";
import Container from "../components/Container";
import { TokenBody } from "../components/TokenBody";
import { useNavigate } from "react-router-dom";

export default function auth() {
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  useEffect(() => {
    const cookie = document.cookie.split(";")[0].split("=")[1];
    if (cookie === "" || cookie === undefined) {
      setIsRegistered(false);
      return;
    }
    if (TokenBody(cookie)?.exp > Date.now() / 1000) {
      navigate("/");
      return;
    }
    setIsRegistered(true);
  }, []);

  return (
    <>
      {(isRegistered && (
        <Container>
          <Signin />
          <div>
            Don't have an account? Sign up
            <button
              onClick={() => {
                setIsRegistered(!isRegistered);
              }}
              className="text-blue-600 hover:underline ml-1 mt-4"
            >
              here
            </button>
          </div>
        </Container>
      )) || (
        <Container>
          <Signup />
          <div>
            Already have an account? Sign in
            <button
              onClick={() => {
                setIsRegistered(!isRegistered);
              }}
              className="text-blue-500 hover:underline ml-1 mt-4"
            >
              here
            </button>
          </div>
          <div className="flex flex-col text-base items-center text-neutral-400 mt-2">
            By creating an account you agree to our
            <div className="ml-1 text-blue-500 hover:underline">
              <Link to="/terms">Terms of Service</Link>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}
