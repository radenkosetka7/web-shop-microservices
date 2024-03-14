import {Navigate, Outlet} from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoutesUser = () =>
{
    const {loggedUser} = useSelector((state)=>state.users);
    const token = sessionStorage.getItem('access');
    return (
        token && loggedUser.role === 2 ? <Outlet/> : <Navigate to="/login"/>
    )
}

export default PrivateRoutesUser;