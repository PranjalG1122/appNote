import { useEffect } from "react";

export const API_URL = import.meta.env.API_URL || "/api";

export const getNotes = async (url: string) => {
  return await fetch(API_URL + url, {
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
  return await fetch(API_URL + url, {
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
  return await fetch(API_URL + url, {
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
  return await fetch(API_URL + url, {
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
