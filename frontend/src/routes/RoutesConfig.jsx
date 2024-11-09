import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import Layout from "../layout/Layout";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorPage from "../pages/ErrorPage";
import PageNotFound from "../pages/PageNotFound";
import ProtectedRoutes from "./ProtectedRoutes.jsx";

/* eslint-disable react-refresh/only-export-components */
const Home = lazy(() => import("../pages/Home"));
const Explore = lazy(() => import("../pages/Explore"));
const Notifications = lazy(() => import("../pages/Notifications"));
const Profile = lazy(() => import("../pages/Profile"));
const Settings = lazy(() => import("../pages/Settings"));
const SignIn = lazy(() => import("../pages/SignIn"));
/* eslint-enable react-refresh/only-export-components */

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <ProtectedRoutes />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "explore",
            element: <Explore />,
          },
          {
            path: "notifications",
            element: <Notifications />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
        ],
      },
    ],
  },
  {
    path: "/signin",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <SignIn />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <PageNotFound />
      </Suspense>
    ),
  },
]);

export default router;
