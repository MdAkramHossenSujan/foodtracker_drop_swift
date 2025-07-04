import {
  createBrowserRouter,
} from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/home/Home";
import AuthLayOut from "../layouts/AuthLayOut";
import LogIn from "../pages/authentication/LogIn";
import Register from "../pages/authentication/Register";
import Coverage from "../pages/coverage/Coverage";

import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import MyParcels from "../pages/dashboard/MyParcels";
import SendParcel from "../pages/sendparcel/SendParcel";
import Payment from "../pages/dashboard/payment/Payment";
import PaymentHIstory from "../pages/dashboard/payment/PaymentHIstory";
import TrackParcel from "../pages/dashboard/trackparcel/TrackParcel";

import PendingRiders from "../pages/dashboard/PendingRiders";
import ActiveRiders from "../pages/dashboard/ACtiveRiders";
import BeaRider from "../pages/rider/BeaRider";

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
          element:<PrivateRoute>
     <SendParcel/>
          </PrivateRoute>,
          loader:()=>fetch('/warehouses.json')
        },
        {
          path:'bearider',
          element:<PrivateRoute>
            <BeaRider/>
          </PrivateRoute>
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
      },
      {
        path:'payment/:id',
        Component:Payment
      },{
        path:'paymentsHistory',
        Component:PaymentHIstory
      },
      {
        path:'track',
        Component:TrackParcel
      },
      {
        path:'/dashboard/active-rider',
        Component:ActiveRiders
      },
      {
        path:'/dashboard/pending-riders',
        Component:PendingRiders
      }
    ]
  }
]);