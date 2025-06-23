import {
  createBrowserRouter,
} from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/home/Home";
import AuthLayOut from "../layouts/AuthLayOut";
import LogIn from "../pages/authentication/LogIn";
import Register from "../pages/authentication/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    Component:RootLayout,
    children:[
        {
            index:true,
            Component:Home
        }
    ]
  },
  {
    path:'/',
    Component:AuthLayOut,
    children:[
      {
        path:'login',
        Component:LogIn
      },
      {
        path:'register',
        Component:Register
      }
    ]
  }
]);