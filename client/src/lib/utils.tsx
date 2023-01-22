import { useEffect } from "react";

export const getNotes = async (url: string) => {
  return await fetch("http://localhost:3000/api" + url, {
    method: "GET",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
  }).then((res) => {
    return res.json();
  });
};

export const createNote = async (url: string) => {
  return await fetch("http://localhost:3000/api" + url, {
    method: "GET",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
  }).then((res) => {
    return res.json();
  });
};

export const deleteNote = async (
  url: string,
  { arg: { id } }: { arg: { id: number } }
) => {
  return await fetch("http://localhost:3000/api" + url, {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      id,
    }),
  }).then((res) => {
    return res.json();
  });
};

export const updateNote = async (
  url: string,
  {
    arg: { id, title, content },
  }: { arg: { id: number; title: string; content: string } }
) => {
  return await fetch("http://localhost:3000/api" + url, {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      id,
      title,
      content,
    }),
  }).then((res) => {
    return res.json();
  });
};

export function useOnClickOutside(ref: any, handler: any) {
  useEffect(() => {
    const listener = (event: any) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
