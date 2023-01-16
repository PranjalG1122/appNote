import React, { useState } from "react";
import useSWRMutation from "swr/mutation";

async function getUser(
  url: string,
  {
    arg: { username, password },
  }: { arg: { username: string; password: string } }
) {
  // preflight
  // await fetch("http://localhost:3000/api/testing", {
  //   method: "GET",
  //   headers: {
  //     "Access-Control-Allow-Origin": "http://localhost:3000",
  //     "Access-Control-Allow-Credentials": "true",
  //     "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  //     "Access-Control-Allow-Headers": "Origin, Content-Type, Accept",
  //     "Access-Control-Expose-Headers": "Set-Cookie",
  //   },
  // });
  await fetch("http://localhost:3000/api" + url, {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });
}

export default function Signin() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { trigger, isMutating, data, error } = useSWRMutation(
    "/signin",
    getUser
  );

  return (
    <div className="">
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
      <button
        disabled={isMutating}
        onClick={async () => {
          try {
            const result = await trigger({ username, password });
            console.log({ result });
          } catch (e) {
            console.error(e);
          }
        }}
      >
        Submit
      </button>
    </div>
  );
}
