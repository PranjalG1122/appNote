import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import Signup from "../components/Signup";
import Signin from "../components/Signin";

export default function auth() {
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  return (
    <div>
      <h1>Auth</h1>
      <Link to="/">Back to Home</Link>

      {(isRegistered && <></>) || (
        <>
          <Signup />
        </>
      )}
    </div>
  );
}
