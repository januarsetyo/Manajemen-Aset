import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode; // Isi tombol (text/element)
  size?: "sm" | "md"; // Ukuran tombol
  variant?: "primary" | "outline"; // Style tombol
  startIcon?: ReactNode; // Icon sebelum text
  endIcon?: ReactNode; // Icon setelah text
  onClick?: () => void; // Event klik
  disabled?: boolean; // State disabled
  className?: string; // Custom class tambahan
  type?: "button" | "submit" | "reset"; // Tipe tombol
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  type = "button",
}) => {
  // Mapping class size
  const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-3 text-base",
  };

  // Mapping class variant
  const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-brand-500 text-white shadow hover:bg-brand-600 disabled:bg-brand-300",
    outline:
      "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${sizeClasses[size]} ${variantClasses[variant]} ${className} ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      <span>{children}</span>
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
