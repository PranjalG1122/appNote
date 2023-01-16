import React, { useEffect, useState } from "react";
import "./App.css";
import { Link } from "react-router-dom";
import useSWRMutation from "swr/mutation";

async function getNotes(url: string) {
  await fetch("http://localhost:5000" + url, {
    method: "GET",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
  });
}

export default function App() {
  document.title = "Home";

  const { trigger, isMutating, data, error } = useSWRMutation(
    "/notes",
    getNotes
  );

  return (
    <div>
      <p>Home page</p>
      <Link to="/auth">Go to Auth</Link>
      <button
        disabled={isMutating}
        onClick={async () => {
          try {
            const result = await trigger();
            console.log(result);
          } catch (e) {
            console.error(e);
          }
        }}
      >
        Get Notes
      </button>
      <p>{JSON.stringify({ data })}</p>
    </div>
  );
}
