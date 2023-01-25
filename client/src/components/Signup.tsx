import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckSquare, Square } from "react-feather";
import useSWRMutation from "swr/mutation";
import { API_URL } from "../lib/utils";

export default function Signup() {
  const navigate = useNavigate();
  document.title = "Sign up";
  const createUser = async (
    url: string,
    {
      arg: { username, password },
    }: { arg: { username: string; password: string } }
  ) => {
    return await fetch(API_URL + url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    }).then((res) => {
      return res.json();
    });
  };

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
      <h1 className="desktop:text-3xl text-2xl mb-6 font-semibold">Sign Up</h1>
      <input
        type="text"
        placeholder="Username"
        autoComplete="off"
        name="username"
        className="w-80 text-base px-0.5 py-2 bg-white border-b-2 border-neutral-400 focus:border-black placeholder:text-neutral-600 focus:outline-none"
        onChange={(e) => setUsername(e.target.value)}
      ></input>
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        autoComplete="off"
        name="password"
        className="w-80 text-base px-0.5 py-2 bg-white border-b-2 border-neutral-400 focus:border-black placeholder:text-neutral-600 focus:outline-none"
        onChange={(e) => setPassword(e.target.value)}
      ></input>
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Confirm Password"
        autoComplete="off"
        name="matchPassword"
        className="w-80 text-base px-0.5 py-2 bg-white border-b-2 border-neutral-400 focus:border-black placeholder:text-neutral-600 focus:outline-none"
        onChange={(e) => setConfirmPassword(e.target.value)}
      ></input>
      <button
        onClick={() => {
          setShowPassword(!showPassword);
        }}
        className="flex flex-row gap-1 px-2 py-1 text-base"
      >
        {showPassword ? <CheckSquare /> : <Square />}
        Show Password
      </button>
      <button
        disabled={isMutating}
        className="text-white w-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:bg-gradient-to-br focus:outline-none shadow-sm shadow-blue-800/80 font-semibold rounded text-xl p-2 text-center"
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
          await trigger({ username, password })
            .then((res) => {
              if (res.success) {
                document.cookie = `token=;`;
                setErrorMessage("");
                navigate(0);
              } else {
                setErrorMessage(res.message);
              }
            })
            .catch((e) => {
              console.log(e.message);
            });
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
  );
}
