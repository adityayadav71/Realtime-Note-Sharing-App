import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import FormErrors from "./FormErrors";
import { AuthContext } from "../../App";
import { login, checkLogInStatus } from "../../api/authDataAPI";
import { io } from "socket.io-client";

const Login = (props) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [apiErrors, setAPIErrors] = useState();
  const [status, setStatus] = useState();
  const { setIsLoggedIn, setUserData, setSocket } = useContext(AuthContext);

  const onSubmit = async (formData) => {
    setStatus("waiting");
    try {
      await login(formData);
      const status = await checkLogInStatus();
      setIsLoggedIn(status.isLoggedIn);
      setUserData(status.userData);
      const socket = io(import.meta.env.MODE === "production" ? import.meta.env.VITE_API_URL : import.meta.env.DEV_API_URL, {
        path: "/api/v1/socket.io",
      });
      setSocket(socket);
      navigate("/", { replace: true });
    } catch (err) {
      setAPIErrors(<FormErrors message={err.response.data.message} />);
    }
    setStatus("");
  };

  return (
    <div className="flex flex-row items-center grow w-full py-9 px-9">
      <form className="flex flex-col w-[400px] max-w-7xl mx-auto items-center justify-center gap-y-6 text-white" onSubmit={handleSubmit(onSubmit)}>
        <p className="text-4xl text-black font-bold">IBOOK</p>
        <div className="w-full">
          <input
            type="text"
            className={`w-full text-black rounded-xl h-18 p-6 text-base 
            ${errors.username ? "border border-hardRed" : ""} 
            outline-none border-2 relative`}
            name="emailOrUsername"
            placeholder="Username or Email"
            {...register("emailOrUsername", {
              required: "Please provide a username or email.",
            })}
          ></input>
          {errors.emailOrUsername && <span className="mt-2 text-red-600">{errors.emailOrUsername.message}</span>}
        </div>
        <div className="w-full">
          <input
            type="password"
            className={`w-full text-black rounded-xl h-18 p-6 text-base 
            ${errors.password ? "border border-hardRed" : ""} 
            outline-none border-2`}
            name="password"
            placeholder="Password"
            {...register("password", {
              required: "Please provide a password.",
            })}
          ></input>
          {errors.password && <span className="mt-2 text-red-600">{errors.password.message}</span>}
        </div>
        {apiErrors}
        <button disabled={status === "waiting"} className="flex gap-x-3 items-center justify-center mt-6 text-2xl w-full rounded-xl h-18 px-6 py-6 font-bold text-white bg-black">
          {status === "waiting" && <div className="spinner-border"></div>}
          Login
        </button>
        <div className="flex flex-row text-grey1 w-full items-center justify-between">
          Don't have an account?
          <Link className="text-black text-base" to="/signup">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
