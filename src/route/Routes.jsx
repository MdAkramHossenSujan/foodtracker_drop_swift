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
import BeaRider from "../pages/rider/BeaRider";
import ApprovedRiders from "../pages/dashboard/ApprovedRiders";
import MakeAdmin from "../pages/MakeAdmin";
import Forbidden from "../pages/forbidden/Forbidden";
import AdminRoute from "./AdminRoute";
import AssignRider from "../pages/asignrider/AssignRider";
import PendingDeliveries from "../pages/dashboard/pendingDeliveries/PendingDeliveries";
import RiderRoute from "./RiderRoute";
import CompletedDelivery from "../pages/dashboard/completeddelivery/CompletedDelivery";
import RiderEarning from "../pages/dashboard/riderearning/RiderEarning";

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
path:'forbidden',
Component:Forbidden
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
     //Rider links
      {
        path:'pending-deliveries',
        element:<RiderRoute>
          <PendingDeliveries/>
        </RiderRoute>
      },
      {
        path:'completed-deliveries',
        element:<RiderRoute>
          <CompletedDelivery/>
        </RiderRoute>
      },
      {
        path:'rider-earning',
        element:<RiderRoute>
          <RiderEarning/>
        </RiderRoute>
      },
     //Admin Links
      {
        path:'pending-riders',
       element:<AdminRoute>
        <PendingRiders/>
       </AdminRoute>
      },{
        path:'active-rider',
       element:<AdminRoute>
        <ApprovedRiders/>
       </AdminRoute>
      },{
        path:'makeadmin',
        element:<AdminRoute>
          <MakeAdmin/>
        </AdminRoute>
      },
      {
        path:'assign-rider',
        element:<AdminRoute>
          <AssignRider/>
        </AdminRoute>
      }
    ]
  }
]);