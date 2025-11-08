import { useState } from "react";

type Props = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  required?: boolean;
};

export default function PasswordField({
  label,
  name,
  value,
  onChange,
  autoComplete = "new-password",
  required = true,
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <div>
      {label && (
        <label className="block mb-1 text-sm text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full border border-gray-200 rounded-[5px] py-2 px-3 pr-10 bg-gray-50 focus:border-[#00843d] outline-none"
          autoComplete={autoComplete}
          required={required}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Ocultar senha" : "Mostrar senha"}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {show ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.01 9.964 7.178.07.214.07.43 0 .644C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.01-9.964-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 3l18 18M10.584 10.587A3 3 0 0113.5 13.5m2.92 2.92C15.4 17.46 13.753 18 12 18 7.36 18 3.423 14.99 2.036 10.822a1.012 1.012 0 010-.644 12.042 12.042 0 013.249-5.02m3.03-1.788A9.956 9.956 0 0112 6c4.64 0 8.577 3.01 9.964 7.178.07.214.07.43 0 .644a12.045 12.045 0 01-2.805 4.21" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
