import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import ProtectedRoutes from "./ProtectedRoutes";
import ErrorPage from "../pages/ErrorPage";
import PageNotFound from "../pages/PageNotFound";
import LoadingSpinner from "../components/ui/LoadingSpinner";

import Layout from "../layout/Layout";
import FollowInfo from "../components/ui/Profile/FollowInfo";
import Home from "../pages/Home";
import Explore from "../pages/Explore";
import Notifications from "../pages/Notifications";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import SignIn from "../pages/SignIn";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <Layout />,
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
            path: "search",
            element: <Explore />,
          },
          {
            path: "notifications",
            element: <Notifications />,
          },
          {
            path: ":username",
            element: <Profile />,
          },
          {
            path: ":username/:followinfo",
            element: <FollowInfo />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
          {
            path: "*",
            element: <PageNotFound />,
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
]);

export default router;
