import React, { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.scss";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "outlined"
  | "text";

export type ButtonSize = "small" | "medium" | "large";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  children,
  icon,
  iconPosition = "left",
  loading = false,
  fullWidth = false,
  className,
  disabled,
  ...rest
}) => {
  const buttonClasses = [
    "common-button",
    `common-button--${variant}`,
    `common-button--${size}`,
    loading && "common-button--loading",
    fullWidth && "common-button--full-width",
    disabled && "common-button--disabled",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={buttonClasses} disabled={disabled || loading} {...rest}>
      {loading && <span className="common-button__spinner" />}
      {icon && iconPosition === "left" && (
        <span className="common-button__icon common-button__icon--left">
          {icon}
        </span>
      )}
      <span className="common-button__text">{children}</span>
      {icon && iconPosition === "right" && (
        <span className="common-button__icon common-button__icon--right">
          {icon}
        </span>
      )}
    </button>
  );
};

export default Button;
