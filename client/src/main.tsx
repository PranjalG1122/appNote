import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Auth from "./pages/auth";
import Page404 from "./pages/page404";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Terms from "./pages/terms";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "*",
    element: <Page404 />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
