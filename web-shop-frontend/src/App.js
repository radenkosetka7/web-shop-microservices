import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ActivateAccount from "./pages/ActivateAccount/ActivateAccount";
import NotFound from "./pages/NotFound/NotFound";
import { useEffect } from "react";
import { logout } from "./redux-store/userSlice";
import { useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";
import Profile from "./pages/Profile/Profile";
import ViewProduct from "./pages/ViewProduct/ViewProduct";
import Messages from "./pages/Messages/Messages";
import Categories from "./pages/Admin/Categories";
import PrivateRoutesUser from "./util/PrivateRoutesUser";
import PrivateRoutesSupport from "./util/PrivateRoutesSupport";
import PrivateRoutesAdmin from "./util/PrivateRoutesAdmin";
import Users from "./pages/Admin/Users";

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      const token = sessionStorage.getItem("access");
      if (!token) {
        clearInterval(interval);
        dispatch(logout());
      } else {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.exp * 1000 < Date.now()) {
            clearInterval(interval);
            dispatch(logout());
          }
        } catch (error) {
          clearInterval(interval);
          dispatch(logout());
        }
      }
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>

          <Route element={<PrivateRoutesUser />}>
            <Route path="/myProfile" element={<Profile />} exact />
          </Route>
          <Route element={<PrivateRoutesSupport />}>
            <Route path="/messages" element={<Messages />} exact />
          </Route>
          <Route element={<PrivateRoutesAdmin />}>
            <Route path="/users" element={<Users />} exact />
          </Route>
          <Route element={<PrivateRoutesAdmin />}>
            <Route path="/categories" element={<Categories />} exact />
          </Route>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} exact />
          <Route path="/register" element={<Register />} exact />
          <Route path="/activateAccount" element={<ActivateAccount />} exact />
          <Route path="/:id" element={<ViewProduct />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
