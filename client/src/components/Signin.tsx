import React, { useState } from "react";
import { CheckSquare, Square } from "react-feather";
import useSWRMutation from "swr/mutation";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../lib/utils";

export default function Signin() {
  const navigate = useNavigate();
  document.title = "Sign in";
  const getUser = async (
    url: string,
    {
      arg: { username, password },
    }: { arg: { username: string; password: string } }
  ) => {
    return await fetch(API_URL + url, {
      method: "POST",
      credentials: "include",
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

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { trigger, isMutating, data, error } = useSWRMutation(
    "/signin",
    getUser
  );

  return (
    <div className="flex flex-col gap-2 justify-center items-center w-80">
      <h1 className="desktop:text-3xl text-2xl mb-6 font-semibold">Sign In</h1>
      <input
        type="text"
        spellCheck={false}
        placeholder="Username"
        autoComplete="off"
        required
        name="username"
        className="w-80 text-base px-1 py-2 bg-neutral-800 focus:bg-neutral-700 placeholder:text-neutral-400 focus:outline-none rounded"
        onChange={(e) => setUsername(e.target.value)}
      ></input>
      <input
        type={showPassword ? "text" : "password"}
        spellCheck={false}
        placeholder="Password"
        autoComplete="off"
        required
        name="password"
        className="w-80 text-base px-1 py-2 bg-neutral-800 focus:bg-neutral-700 placeholder:text-neutral-400 focus:outline-none rounded"
        onChange={(e) => setPassword(e.target.value)}
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
          if (username.length === 0 || password.length === 0) {
            setErrorMessage("Fields cannot be empty");
            return;
          }
          await trigger({ username, password })
            .then((res) => {
              if (res.success) {
                setErrorMessage("");
                navigate("/");
              } else {
                setErrorMessage(res.message);
              }
            })
            .catch((e) => {
              setErrorMessage(e.message);
            });
        }}
      >
        Sign In
      </button>
      {errorMessage && (
        <p className="fixed bottom-10 mx-4 max-w-96 text-center font-semibold text-white bg-red-600 desktop:px-2 py-1 px-1 rounded desktop:text-base text-sm">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
