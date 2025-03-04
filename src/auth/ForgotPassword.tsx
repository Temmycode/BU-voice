import { useState } from "react";
import TextField from "../components/TextField";
import emailImage from "../assets/email.svg";
import lock from "../assets/lock-white.svg";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useNavigate } from "react-router-dom";

function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  return (
    <div className="font-jaka min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="w-full max-w-lg px-6 py-8">
        <div className="text-center  mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary-black mb-2">
            Reset Your Password
          </h1>
          <p className="text-base md:text-lg font-normal text-secondary-black">
            Forgot your password? No worries, then let’s submit password reset.
            It will be send to your email.
          </p>
        </div>
        <div className="mb-3">
          {/* Email */}
          <TextField
            value={email}
            onChange={setEmail}
            placeholder="elementary221b@gmail.com"
            hint="Email Address"
            icon={emailImage}
          />

          <div className="h-6" />
        </div>

        <div className="mb-6">
          {/* Primary Button */}
          <div className="bg-primary-purple flex flex-row justify-center w-full text-white py-3 font-bold mb-6 text-center rounded-full cursor-pointer">
            Reset Password <img src={lock} className="ml-2 text-white" />
          </div>

          <div
            onClick={() => {
              navigate("/login");
            }}
            className="flex flex-row justify-center items-center text-sm text-primary-purple font-bold cursor-pointer"
          >
            <ChevronLeftIcon />
            <div className=" ml-2">Back to login screen</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordScreen;
