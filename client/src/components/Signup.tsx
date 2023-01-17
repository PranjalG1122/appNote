import React, { useEffect, useState } from "react";
import { CheckSquare, Square } from "react-feather";
import useSWRMutation from "swr/mutation";

async function createUser(
  url: string,
  {
    arg: { username, password },
  }: { arg: { username: string; password: string } }
) {
  console.log("executed");
  // await fetch("http://localhost:5000" + url, {
  //   method: "POST",
  //   headers: {
  //     "content-type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     username,
  //     password,
  //   }),
  // }).then((res) => {
  //   const responseMessage = res.json().then((data) => {
  //     console.log(data);
  //     return data;
  //   });
  //   console.log(responseMessage);
  // });
}

export default function Signup() {
  document.title = "Sign up";

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const USER_VALID = /^[a-zA-Z0-9_]{4,20}$/;

  const { trigger, isMutating, data, error } = useSWRMutation(
    "/signup",
    createUser
  );

  return (
    <div className="flex flex-col gap-2 justify-center items-center w-80">
      {/* <p>
        {JSON.stringify({
          isMutating,
          data,
          error,
        })}
      </p> */}
      <h1 className="desktop:text-3xl text-2xl font-semibold mb-6">Sign Up</h1>
      <div className="flex flex-col items-center gap-2 font-semibold">
        <input
          type="text"
          placeholder="Username"
          autoComplete="off"
          name="username"
          className="w-80 text-base px-4 py-2 rounded"
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          autoComplete="off"
          name="password"
          className="w-80 text-base px-4 py-2 rounded"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          autoComplete="off"
          name="matchPassword"
          className="w-80 text-base px-4 py-2 rounded"
          onChange={(e) => setConfirmPassword(e.target.value)}
        ></input>
        <button
          onClick={() => {
            setShowPassword(!showPassword);
          }}
          className="flex flex-row gap-1 py-1 text-base"
        >
          {showPassword ? <CheckSquare /> : <Square />}
          Show Password
        </button>
        <button
          disabled={isMutating}
          className="w-80 text-white bg-gradient-to-r from-violet-500 via-purple-600 to-fuchsia-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-800 shadow-lg shadow-purple-800/80 font-semibold rounded text-base px-4 py-2 text-center"
          onClick={async () => {
            if (!(username.length > 3)) {
              setErrorMessage("Username must be at least 4 characters long");
              return;
            }
            if (!USER_VALID.test(username)) {
              setErrorMessage(
                "Username must be alphanumeric and can only contain underscores"
              );
              return;
            }
            if (!(password.length > 7) || !(password.length < 25)) {
              setErrorMessage(
                "Password must be at least 8 characters long and less than 24"
              );
              return;
            }
            if (password !== confirmPassword) {
              setErrorMessage("Passwords do not match");
              return;
            }
            try {
              setErrorMessage("");
              const result = await trigger({ username, password });
              // console.log(result);
            } catch (e) {
              console.error(e);
            }
          }}
        >
          Create User
        </button>
        {errorMessage && (
          <p className="fixed bottom-10 mx-4 max-w-96 text-center font-semibold text-white bg-red-600 desktop:px-2 py-1 px-1 rounded desktop:text-base text-sm">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}
