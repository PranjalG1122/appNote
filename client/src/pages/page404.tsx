import React from "react";
import { Link } from "react-router-dom";
import Container from "../components/Container";

export default function Page404() {
  return (
    <Container>
      <div className="flex flex-col gap-2 items-center">
        <h1 className="desktop:text-6xl text-4xl font-semibold leading-none">404</h1>
        <p className="m-0">It seems you've entered something wrong</p>
        <Link to="/">
          <p className="text-white bg-gradient-to-r from-violet-500 via-purple-600 to-fuchsia-600 hover:bg-gradient-to-br focus:ring-2 focus:outline-none focus:ring-purple-800 shadow-md shadow-purple-800/80 font-semibold rounded text-base px-4 py-2 text-center">
            Back to Home
          </p>
        </Link>
      </div>
    </Container>
  );
}
