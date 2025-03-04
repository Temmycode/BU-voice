import { useState } from "react";
import TextField from "../components/TextField";
import google from "../assets/google.svg";
import personImage from "../assets/person.svg";
import emailImage from "../assets/email.svg";
import passwordImage from "../assets/padlock.svg";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";
import { useAuthClientStore } from "../clients/authClientStore";
import { LucideLogIn } from "lucide-react";
import { useAlert } from "../providers/AlertContext";

function SignupScreen() {
  const { showAlert } = useAlert();
  const [fullname, setFullname] = useState("");
  const [matricNo, setMatricNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, createStudent } = useAuthClientStore();

  const navigate = useNavigate();

  const ButtonData = () => {
    if (loading) {
      return <ClipLoader color="white" size={20} />;
    } else {
      return (
        <div className="flex flex-row items-center justify-center">
          <div>Sign Up</div>
          <LucideLogIn className="ml-2" />
        </div>
      );
    }
  };

  const signup = async () => {
    const result = await createStudent(
      fullname,
      matricNo,
      "",
      email,
      password,
      "",
      ""
    );
    if (result) {
      showAlert("Successfully created student", "success");
      navigate("/login");
    } else {
      showAlert("An error occurred", "error");
    }
  };

  return (
    <div className="font-jaka min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="w-full max-w-lg px-6 py-8">
        <div className="text-center  mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary-black mb-2">
            Sign Up For Free.
          </h1>
          <p className="text-base md:text-lg font-normal text-secondary-black">
            Unleash your inner sloth 4.0 right now.
          </p>
        </div>
        <div className="mb-3">
          <div className="flex flex-row gap-2 items-center justify-center">
            {/* Fullname */}
            <TextField
              value={fullname}
              onChange={setFullname}
              placeholder="X_AE_A13b"
              hint="Full Name"
              icon={personImage}
            />

            {/* Matric No */}
            <TextField
              value={matricNo}
              onChange={setMatricNo}
              placeholder="22/1203"
              hint="Matric No"
              icon={personImage}
            />
          </div>

          <div className="h-6" />

          <div className="flex flex-row gap-2 items-center justify-center">
            {/* School */}
            <TextField
              value={email}
              onChange={setEmail}
              placeholder="Computing"
              hint="School"
              icon={personImage}
            />

            <div className="h-6" />

            {/* Department */}
            <TextField
              value={email}
              onChange={setEmail}
              placeholder="Software Eng"
              hint="Department"
              icon={personImage}
            />
          </div>

          <div className="h-6" />

          {/* Hall name */}
          <TextField
            value={email}
            onChange={setEmail}
            placeholder="Neal Wilson"
            hint="Hall name"
            icon={personImage}
          />

          <div className="h-6" />

          {/* Email */}
          <TextField
            value={email}
            type="email"
            onChange={setEmail}
            placeholder="elementary221b@gmail.com"
            hint="Email Address"
            icon={emailImage}
          />

          <div className="h-6" />

          {/* Password */}
          <TextField
            value={password}
            onChange={setPassword}
            type="password"
            isSecured={true}
            placeholder="Password"
            hint="Password"
            icon={passwordImage}
          />
        </div>
        <div className="text-sm font-medium mb-6 text-secondary-black">
          Password strength: Strong
        </div>

        <div className="mb-8">
          {/* Primary Button */}
          <div
            onClick={signup}
            className="bg-primary-purple w-full text-white py-3 font-bold mb-6 text-center rounded-full cursor-pointer"
          >
            <ButtonData />
          </div>

          <div className="flex flex-row justify-center items-center text-sm text-primary-black font-bold">
            Already have an account?
            <button
              onClick={() => {
                navigate("/login");
              }}
              className="text-primary-purple ml-1 cursor-pointer"
            >
              Sign In.
            </button>
          </div>
        </div>

        <div className="flex flex-row w-full bg-white border-1 border-border-color  py-3 font-bold mb-6 text-center rounded-full cursor-pointer items-center justify-center ">
          <img src={google} className="mr-3" />
          <span className="font-bold text-primary-black text-base ">
            Sign Up With Google
          </span>
        </div>

        {/* <div className="w-full border-1" /> */}
      </div>
    </div>
  );
}

export default SignupScreen;
