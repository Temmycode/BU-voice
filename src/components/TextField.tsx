import { ChangeEvent, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface TextFieldProps {
  hint: string;
  value: string;
  borderRadius?:
    | "rounded-full"
    | "rounded-sm"
    | "rounded-md"
    | "rounded-lg"
    | "rounded-xl";
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "password" | "email" | "number";
  error?: string;
  isSecured?: boolean;
  required?: boolean;
  icon?: string;
}

export default function TextField({
  hint,
  value,
  borderRadius = "rounded-full",
  onChange,
  placeholder,
  type,
  error,
  isSecured,
  icon,
}: TextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = isSecured
    ? showPassword
      ? "text"
      : "password"
    : type || "text";

  return (
    <div className="font-jaka flex flex-col w-full">
      <label className="text-sm font-bold mb-2 text-primary-black">
        {hint}
      </label>
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`font-jaka w-full bg-white ${borderRadius} border-1 border-border-color py-3 px-3 ${
            icon ? "pl-10" : "pl-3"
          } focus:outline-none focus:ring-2 transition duration-150 ease-in-out`}
        />
        <img src={icon} className="absolute left-3 top-1/2 -translate-y-1/2" />
        {isSecured && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
}
