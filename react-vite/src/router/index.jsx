import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import CollectionPage from "../components/CollectionPage/CollectionPage";
import ForumPage from "../components/ForumPage/ForumPage"; 
import Layout from './Layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome!</h1>,
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
    ],
  },
]);