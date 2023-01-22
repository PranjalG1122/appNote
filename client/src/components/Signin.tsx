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
    <div className="flex flex-col gap-2 justify-center items-center w-80 font-semibold">
      <h1 className="desktop:text-3xl text-2xl mb-6">Sign In</h1>
      <input
        type="text"
        placeholder="Username"
        autoComplete="off"
        required
        name="username"
        className="w-80 text-base px-4 py-2 rounded bg-neutral-800 focus:bg-neutral-700 focus:outline-none"
        onChange={(e) => setUsername(e.target.value)}
      ></input>
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        autoComplete="off"
        required
        name="password"
        className="w-80 text-base px-4 py-2 rounded bg-neutral-800 focus:bg-neutral-700 focus:outline-none"
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
        className="w-80 text-white bg-gradient-to-r from-violet-500 via-purple-600 to-fuchsia-600 hover:bg-gradient-to-br focus:ring-2 focus:outline-none focus:ring-purple-800 shadow-md shadow-purple-800/80 font-semibold rounded text-base px-4 py-2 text-center"
        onClick={async () => {
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
