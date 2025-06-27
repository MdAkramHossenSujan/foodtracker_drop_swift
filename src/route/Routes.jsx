import {
  createBrowserRouter,
} from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/home/Home";
import AuthLayOut from "../layouts/AuthLayOut";
import LogIn from "../pages/authentication/LogIn";
import Register from "../pages/authentication/Register";
import Coverage from "../pages/coverage/Coverage";
import SendParcel from "../pages/sendparcel/SendParcel";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import MyParcels from "../pages/dashboard/MyParcels";

export const router = createBrowserRouter([
  {
    path: "/",
    Component:RootLayout,
    children:[
        {
            index:true,
            Component:Home
        },
        {
          path:'coverage',
          Component:Coverage,
          loader:()=>fetch('/warehouses.json')
        },
        {
          path:'sendParcel',
          Component:SendParcel,
          loader:()=>fetch('/warehouses.json')
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
  },
  {
    path:'/dashboard',
    element:<PrivateRoute>
      <DashboardLayout/>
    </PrivateRoute>,
    children:[
      {
        path:'myParcels',
        Component:MyParcels
      }
    ]
  }
]);