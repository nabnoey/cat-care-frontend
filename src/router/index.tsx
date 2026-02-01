import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/HomePages";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import MainLayout from "../layouts/MainLayout";
import About from "../pages/About";
import Services from "../pages/Services";
import Contact from "../pages/Contact";
import Catlist from "../pages/cats/Catlist";
import AddCat from "../pages/cats/AddCat";
import Booking from "../pages/booking/Booking";
import MyBookings from "../pages/booking/MyBookings";
import Profile from "../pages/profile/Profile";
import ServiceDetail from "../pages/ServiceDetail";
import AdminDashboard from "../pages/auth/admin/AdminDashboard";
import AdminServices from "../pages/auth/admin/AdminServices";
import EditCat from "../pages/cats/EditCat";

const router = createBrowserRouter([
    {
        path:"/",
        element:<MainLayout/>,
        children:[
            {
                path:"/",
                element:<Home/>
            },
            {
                path:"/about",
                element:<About/>
            },
            {
                path:"/services",
                element:<Services/>
            },
            {
                path:"/services/:id",
                element:<ServiceDetail/>
            },
            {
                path:"/contact",
                element:<Contact/>
            },
            {
                path:"/cats",
                element:<Catlist/>
            },
            {
                path:"/cats/add",
                element:<AddCat/>
            },
            {
                path:"/cats/edit/:id",
                element:<EditCat/>
            },
            {
                path:"/booking/:serviceId?",
                element:<Booking/>
            },
            {
                path:"/my-bookings",
                element:<MyBookings/>
            },
            {
                path:"/profile",
                element:<Profile/>
            },
            {
                path:"/admin",
                element:<AdminDashboard/>
            },
            {
                path:"/admin/services",
                element:<AdminServices/>
            }
        ]
    },
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    },
    
])

export default router;