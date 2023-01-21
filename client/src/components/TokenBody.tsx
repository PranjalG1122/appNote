import React from "react";

export const TokenBody = (
  token: string
): {
  username: string;
  iat: number;
  exp: number;
} => {
  return JSON.parse(atob(token.split(".")[1]));
};
