"use client";

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  LogIn,
  BookOpen,
  Building,
  Briefcase,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";
import google from "../assets/google.svg";
import { useAuthClientStore } from "../clients/authClientStore";
import { useAlert } from "../providers/AlertContext";
import { useGoogleLogin } from "@react-oauth/google";
import Dropdown from "../components/Dropdown";
import { universityHalls } from "../constants/constants";
import axios from "axios";

// Enhanced TextField component with animations and better styling
const TextField = ({
  value,
  onChange,
  placeholder,
  hint,
  icon: Icon,
  type = "text",
  isSecured = false,
  error = "",
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isSecured
    ? showPassword
      ? "text"
      : "password"
    : type || "text";

  return (
    <motion.div
      className="w-full relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="block text-sm font-medium text-[#475569] mb-1.5">
        {hint}
      </label>
      <div
        className={`flex items-center border ${
          focused
            ? "border-[#4f46e5] ring-1 ring-[#4f46e5]/20"
            : "border-[#cbd5e1]"
        } 
                   ${error ? "border-red-500 bg-red-50" : "bg-white"} 
                   rounded-lg px-3 py-2.5 transition-all duration-200`}
      >
        <Icon
          className={`w-5 h-5 mr-2 ${
            focused ? "text-[#4f46e5]" : "text-[#94a3b8]"
          }`}
        />
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent text-sm outline-none text-[#1e293b] placeholder-[#94a3b8]"
        />
        {isSecured && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-[#94a3b8] hover:text-[#4f46e5] transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <div className="text-red-500 text-xs mt-1 flex items-center">
          <AlertCircle size={12} className="mr-1" />
          {error}
        </div>
      )}
    </motion.div>
  );
};

// Password strength indicator component
const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  // Simple password strength calculation
  const getStrength = (pass: string) => {
    if (!pass) return { strength: 0, label: "Empty", color: "bg-gray-200" };
    if (pass.length < 6)
      return { strength: 1, label: "Weak", color: "bg-red-500" };
    if (pass.length < 10)
      return { strength: 2, label: "Medium", color: "bg-yellow-500" };
    return { strength: 3, label: "Strong", color: "bg-green-500" };
  };

  const { strength, label, color } = getStrength(password);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-[#475569]">
          Password strength:
        </span>
        <span
          className={`text-sm font-medium ${
            color === "bg-red-500"
              ? "text-red-500"
              : color === "bg-yellow-500"
              ? "text-yellow-500"
              : "text-green-500"
          }`}
        >
          {label}
        </span>
      </div>
      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${(strength / 3) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};

const StaffRoles = [
  { id: 1, label: "Hall Admin" },
  { id: 2, label: "Head of Department" },
  { id: 3, label: "Bursar" },
  { id: 4, label: "Hall Porter" },
  { id: 5, label: "Department Secretary" },
  { id: 6, label: "Bursary Staff" },
];

function SignupScreen() {
  const { showAlert } = useAlert();
  const [fullname, setFullname] = useState("");
  const [matricNo, setMatricNo] = useState("");
  const [hallName, setHallName] = useState("");
  const [school, setSchool] = useState("");
  const [department, setDepartment] = useState("");
  // const [hallName, setHallName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [staffRole, setStaffRole] = useState<{
    id: number;
    label: string;
  } | null>(null);
  const { loading, createStudent, createStaff } = useAuthClientStore();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "student";

  const handleGoogleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      try {
        const { data } = await axios.post(
          "http://localhost:8000/google/student-signup",
          { token: tokenResponse.access_token }
        );
        fetch("http://localhost:8000/google/student-signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });

        console.log("User Signed Up:", data);
        localStorage.setItem("token", data.access_token);
      } catch (error) {
        console.error("Signup failed", error);
      }
    },
    onError: (error) => console.error("Google Signup Error:", error),
    flow: "implicit",
  });

  const validateForm = () => {
    const newErrors = {};

    if (role === "student") {
      if (!fullname) newErrors.fullname = "Full name is required";
      if (!matricNo) newErrors.matricNo = "Matric number is required";
      if (!email) newErrors.email = "Email is required";
      if (!hall) newErrors.hall = "Hall is required";
      else if (!/\S+@\S+\.\S+/.test(email))
        newErrors.email = "Email is invalid";
      if (!password) newErrors.password = "Password is required";
      else if (password.length < 6)
        newErrors.password = "Password must be at least 6 characters";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    } else {
      if (!fullname) newErrors.fullname = "Full name is required";
      // if (!matricNo) newErrors.matricNo = "Matric number is required";
      if (!email) newErrors.email = "Email is required";
      // if (!hall) newErrors.hall = "Hall is required";
      else if (!/\S+@\S+\.\S+/.test(email))
        newErrors.email = "Email is invalid";
      if (!password) newErrors.password = "Password is required";
      else if (password.length < 6)
        newErrors.password = "Password must be at least 6 characters";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }
  };

  async function signup() {
    console.log("Hello");
    let result: boolean;

    if (!validateForm()) {
      console.log("Not validated");
      return;
    }

    if (role === "student") {
      result = await createStudent(
        fullname,
        matricNo,
        school,
        email,
        password,
        department,
        hallName
      );

      if (result) {
        showAlert("Successfully created student", "success");
        navigate("/login?role=student");
      } else {
        showAlert("An error occurred", "error");
      }
    } else {
      result = await createStaff(
        email,
        fullname,
        department,
        staffRole!.id!,
        password,
        hallName
      );

      if (result) {
        showAlert("Successfully created student", "success");
        navigate("/login?role=admin");
      } else {
        showAlert("An error occurred", "error");
      }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="font-jaka min-h-screen flex items-center justify-center bg-[#F8FAFC] py-10">
      <motion.div
        className="w-full max-w-2xl px-6 py-8 bg-white rounded-2xl shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1e293b] mb-2">
            {role === "admin" ? "Admin Sign Up" : "Student Sign Up"}
          </h1>
          <p className="text-base md:text-lg font-normal text-[#475569]">
            Join BU Voice and make your concerns heard
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div variants={itemVariants}>
              <TextField
                value={fullname}
                onChange={setFullname}
                placeholder="John Doe"
                hint="Full Name"
                icon={User}
                error={errors.fullname}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              {role === "student" ? (
                <TextField
                  value={matricNo}
                  onChange={setMatricNo}
                  placeholder="22/1203"
                  hint="Matric No"
                  icon={Briefcase}
                  error={errors.matricNo}
                />
              ) : (
                <Dropdown
                  sourceData={StaffRoles.map((value) => value.label)}
                  label="Role"
                  value={staffRole?.label ?? ""}
                  onChange={(value) => {
                    const selectedRole = StaffRoles.find(
                      (role) => role.label === value
                    );

                    if (selectedRole) {
                      setStaffRole(selectedRole);
                    }
                  }}
                  hint="Select your Role"
                />
              )}
            </motion.div>
          </div>

          <div
            className={`${
              role === "student"
                ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                : null
            }`}
          >
            {role === "student" ? (
              <motion.div variants={itemVariants}>
                <TextField
                  value={school}
                  onChange={setSchool}
                  placeholder="Computing"
                  hint="School"
                  icon={BookOpen}
                />
              </motion.div>
            ) : null}

            {role === "student" ? (
              <motion.div variants={itemVariants}>
                <TextField
                  value={department}
                  onChange={setDepartment}
                  placeholder="Software Engineering"
                  hint="Department"
                  icon={Building}
                />
              </motion.div>
            ) : staffRole?.label.slice(0, 4).toLowerCase() ===
              "hall" ? null : staffRole?.id === 3 ||
              staffRole?.id === 6 ? null : (
              <motion.div variants={itemVariants}>
                <TextField
                  value={department}
                  onChange={setDepartment}
                  placeholder="Software Engineering"
                  hint="Department"
                  icon={Building}
                />
              </motion.div>
            )}
          </div>

          <motion.div variants={itemVariants}>
            {role === "student" ? (
              <div>
                <Dropdown
                  sourceData={universityHalls}
                  label="Hall Name"
                  value={hallName}
                  onChange={(value) => setHallName(value)}
                  hint="Select your Hall"
                  error={errors.hall}
                  required={true}
                />
                {/* {errors.hall && <div>{errors.hall}</div>} */}
              </div>
            ) : staffRole?.label.slice(0, 4).toLowerCase() === "hall" ? (
              <div>
                <Dropdown
                  sourceData={universityHalls}
                  label="Hall Name"
                  value={hallName}
                  onChange={(value) => setHallName(value)}
                  hint="Select your Hall"
                  error={errors.hall}
                  required={true}
                />
                {errors.hall && <div>{errors.hall}</div>}
              </div>
            ) : null}
          </motion.div>

          <motion.div variants={itemVariants}>
            <TextField
              value={email}
              type="email"
              onChange={setEmail}
              placeholder={
                role === "student"
                  ? "student@babcock.edu.ng"
                  : "tolutech2004@gmail.com"
              }
              hint="Email Address"
              icon={Mail}
              error={errors.email}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <TextField
              value={password}
              onChange={setPassword}
              type="password"
              isSecured={true}
              placeholder="••••••••"
              hint="Password"
              icon={Lock}
              error={errors.password}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <PasswordStrengthIndicator password={password} />
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={signup}
              disabled={loading}
              className="bg-[#4f46e5] w-full text-white py-3.5 font-bold mb-6 text-center rounded-xl cursor-pointer hover:bg-[#4338ca] transition-colors flex items-center justify-center"
            >
              {loading ? (
                <ClipLoader color="white" size={20} />
              ) : (
                <div className="flex items-center justify-center">
                  <span>Sign Up</span>
                  <LogIn className="ml-2 h-5 w-5" />
                </div>
              )}
            </button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex justify-center items-center text-sm text-[#1e293b] font-medium"
          >
            Already have an account?
            <button
              onClick={() => navigate(`/login?role=${role}`)}
              className="text-[#4f46e5] ml-1.5 font-bold hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </motion.div>

          {role === "student" ? (
            <>
              <div className="relative flex items-center my-4">
                <div className="flex-grow border-t border-[#cbd5e1]"></div>
                <span className="flex-shrink mx-4 text-[#94a3b8]">
                  or continue with
                </span>
                <div className="flex-grow border-t border-[#cbd5e1]"></div>
              </div>

              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={() => handleGoogleSignup()}
                  className="w-full flex items-center justify-center bg-white border border-[#cbd5e1] py-3.5 font-medium text-[#1e293b] rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={google || "/placeholder.svg"}
                    alt="Google"
                    className="mr-3 h-5 w-5"
                  />
                  <span>Sign Up with Google</span>
                </button>
              </motion.div>
            </>
          ) : null}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default SignupScreen;
