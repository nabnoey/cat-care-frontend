import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AddCat from "./pages/cats/AddCat";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/HomePages";
import Booking from "./pages/booking/Booking";
import MyBookings from "./pages/booking/MyBookings";
import Profile from "./pages/profile/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* protected */}
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/cats/add" element={<AddCat />} />
          <Route path="/booking/:serviceId?" element={<Booking />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
