import { useState } from "react";
import TextField from "../components/TextField";
import Checkbox from "@mui/material/Checkbox";
import google from "../assets/google.svg";
import emailImage from "../assets/email.svg";
import passwordImage from "../assets/padlock.svg";
import ClipLoader from "react-spinners/ClipLoader";
import { LucideLogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthClientStore } from "../clients/authClientStore";
import { useAlert } from "../providers/AlertContext";

function LoginScreen() {
  const { showAlert } = useAlert();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, studentLogin } = useAuthClientStore();

  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const navigate = useNavigate();

  async function login() {
    const result = await studentLogin(email, password);
    if (result) {
      showAlert("Successfully logged in", "success");
      navigate("/student");
    } else {
      showAlert("Invalid credentials", "error");
    }
  }

  const ButtonData = () => {
    if (loading) {
      return <ClipLoader color="white" size={20} />;
    } else {
      return (
        <div className="flex flex-row items-center justify-center">
          <div>Sign In</div>
          <LucideLogIn className="ml-2" />
        </div>
      );
    }
  };

  return (
    <div className="font-jaka min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="w-full max-w-lg px-6 py-8">
        <div className="text-center  mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary-black mb-2">
            Sign In To Your Account.
          </h1>
          <p className="text-base md:text-lg font-normal text-secondary-black">
            Unleash your inner sloth 4.0 right now.
          </p>
        </div>
        <div className="mb-3">
          {/* Email */}
          <TextField
            value={email}
            onChange={setEmail}
            placeholder="Email"
            hint="Email Address"
            icon={emailImage}
          />

          <div className="h-6" />

          {/* Password */}
          <TextField
            value={password}
            onChange={setPassword}
            isSecured={true}
            placeholder="Password"
            hint="Password"
            icon={passwordImage}
          />
        </div>
        {/* Remember me & Forgot Password */}
        <div className="flex flex-row justify-between mb-6">
          <div className="text-primary-black text-sm font-semibold">
            <Checkbox
              {...label}
              defaultChecked
              sx={{
                color: "#4f46e5",
                "&.Mui-checked": {
                  color: "#4f46e5",
                },
                borderRadius: { height: 20 },
              }}
            />
            Remember For 30 Days
          </div>
          <button
            onClick={() => {
              navigate("/forgot-password");
            }}
            className="text-primary-purple text-sm font-bold cursor-pointer"
          >
            Forgot Password
          </button>
        </div>
        <div className="mb-6">
          {/* Primary Button */}
          <button
            onClick={login}
            className="bg-primary-purple w-full text-white py-3 font-bold mb-6 rounded-full cursor-pointer"
          >
            <ButtonData />
          </button>

          <div className="flex flex-row justify-center items-center text-sm text-primary-black font-bold">
            Don’t have an account?
            <button
              onClick={() => {
                navigate("/signup");
              }}
              className="text-primary-purple ml-1"
            >
              Sign Up
            </button>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center font-extrabold text-xs text-primary-grey">
          <div className="border-1 w-full h-0 mr-3 b border-border-color" />
          OR
          <div className="border-1 w-full h-0 ml-3 b border-border-color" />
        </div>

        <div className="flex flex-row w-full bg-white border-1 border-border-color py-3 mt-8 font-bold mb-6 text-center rounded-full cursor-pointer items-center justify-center ">
          <img src={google} className="mr-3" />
          <span className="font-bold text-primary-black text-base cursor-pointer">
            Sign Up With Google
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
