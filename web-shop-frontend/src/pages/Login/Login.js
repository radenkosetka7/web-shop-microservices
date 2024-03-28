import { useForm } from "react-hook-form";
import "./Login.css";
import { useDispatch, useSelector } from "react-redux";
import { getLoggedUser, login } from "../../redux-store/userSlice";
import { useEffect, useState } from "react";
import { statusCodeMessage } from "../../util/StatusCodeException/StatusCode";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [statusCode, setStatusCode] = useState(null);
  const [contentHeight, setContentHeight] = useState("calc(100vh - 73px)");
  const { authenticated, loading } = useSelector((state) => state.users);
  const navigate = useNavigate();


  const onSubmit = async (loginData) => {
    const response = await dispatch(login(loginData));
    if (response.payload?.data?.message) {
      setStatusCode("200");
      setTimeout(() => {
        navigate("/activateAccount", { state: { username: loginData.username } });
      }, 2000);
      return;
    } else if (response.error) {
      setStatusCode(response.error.message);
      return;
    }
    dispatch(getLoggedUser({}));
    nav("/");
  };


  useEffect(() => {
    if (authenticated)
      nav("/");
  }, [authenticated, nav, dispatch]);
  return (
    <div style={{ backgroundColor: "#f3f1f1", height: contentHeight }}>
      <div className="linearGradient">
        <form className="form2" onSubmit={handleSubmit(onSubmit)}>
          <p className="form-title">Sign in to your account</p>
          <div className="input-container">
            <input placeholder="Username" type="text"
                   name="username" {...register("username", {
              required: true
            })}

            />

            <span>
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#9ca3af" viewBox="0 0 24 24">
    <path
      d="M20 22h-2v-2a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v2H4v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v2zm-8-9a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
  </svg>
</span>

          </div>
          {errors.username && errors.username.type === "required" && (
            <p className="error">Username is required</p>)}

          <div className="input-container">
            <input placeholder="Password" type="password"

                   name="password" {...register("password", {
              required: true
            })} />

            <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#9ca3af"
                             viewBox="0 0 256 256"><path
                          d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Z"></path></svg>
                    </span>
          </div>
          {errors.password && errors.password.type === "required" && (
            <p className="error">Password is required</p>
          )}

          {
            statusCode &&
            <p className="error" style={{ maxWidth: "250px" }}>
              {statusCodeMessage(statusCode)}
            </p>

          }
          <button className="submit" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>

          <p className="signup-link">
            No account?
            <Link to="/register" className="LoginLink"> Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};
export default Login;
