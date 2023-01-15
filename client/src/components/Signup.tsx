import React, { useState } from "react";

export default function Signup() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [matchPassword, setMatchPassword] = useState<string>("");
  return (
    <div className="flex flex-col gap-2 ">
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
    </div>
  );
}
