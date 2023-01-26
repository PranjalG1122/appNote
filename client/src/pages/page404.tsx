import React from "react";
import { Link } from "react-router-dom";
import Container from "../components/Container";

export default function Page404() {
  return (
    <Container>
      <div className="flex flex-col gap-2 items-center">
        <h1 className="desktop:text-6xl text-4xl font-semibold leading-none">
          404
        </h1>
        <p className="m-0">It seems you've entered something wrong</p>
        <Link to="/">
          <p className="text-white w-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:bg-gradient-to-br focus:outline-none shadow-sm shadow-blue-800/80 font-semibold rounded text-xl p-2 text-center">
            Back to Home
          </p>
        </Link>
      </div>
    </Container>
  );
}
