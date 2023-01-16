import React, { useState } from "react";
import useSWRMutation from "swr/mutation";

async function createUser(
  url: string,
  {
    arg: { username, password },
  }: { arg: { username: string; password: string } }
) {
  await fetch("http://localhost:5000" + url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });
}

export default function Signup() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [matchPassword, setMatchPassword] = useState<string>("");
  const { trigger, isMutating, data, error } = useSWRMutation(
    "/signup",
    createUser
  );

  return (
    <div className="flex flex-col gap-2 justify-center items-center w-80 ">
      <p>
        {JSON.stringify({
          isMutating,
          data,
          error,
        })}
      </p>
      <input
        type="text"
        placeholder="Username"
        autoComplete="off"
        required
        name="username"
        onChange={(e) => setUsername(e.target.value)}
      ></input>
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        autoComplete="off"
        required
        name="password"
        onChange={(e) => setPassword(e.target.value)}
      ></input>
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Confirm Password"
        autoComplete="off"
        required
        name="matchPassword"
        onChange={(e) => setMatchPassword(e.target.value)}
      ></input>{" "}
      <button
        disabled={isMutating}
        onClick={async () => {
          if (password !== matchPassword) {
            console.error("Passwords do not match");
            return;
          } else {
            try {
              const result = await trigger({ username, password });
              console.log(result);
            } catch (e) {
              console.error(e);
            }
          }
        }}
      >
        Create User
      </button>
    </div>
  );
}
