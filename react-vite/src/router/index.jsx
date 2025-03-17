import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import CollectionPage from "../components/CollectionPage/CollectionPage";
import ForumPage from "../components/ForumPage/ForumPage";
import TarantulaDetail from "../components/TarantulaDetail/TarantulaDetail"; 
import MyForumsPage from "../components/MyForumPage/MyForumPage"; 
import FavoritesPage from "../components/FavoritePage/FavoritePage";
import HomePage from "../components/HomePage/HomePage";
import ForumRepliesPage from "../components/ForumRepliesPage/ForumRepliesPage";
import Layout from './Layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "/collection",
        element: <CollectionPage />,
      },
      {
        path: "/forums",
        element: <ForumPage />,
      },
      {
        path: "/forums/:forumId",
        element: <ForumRepliesPage />,
      },
      {
        path: "/tarantulas/:tarantulaId",
        element: <TarantulaDetail />,
      },
      {
        path: "/my-forums", 
        element: <MyForumsPage />,
      },
      {
        path: "/favorites", 
        element: <FavoritesPage />,
      },
    ],
  },
]);