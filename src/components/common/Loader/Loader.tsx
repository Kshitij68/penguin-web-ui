import React from "react";

// CSS
import "./Loader.scss";

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = "Loading..." }) => {
  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className="loader-spinner"></div>
        <p className="loader-message">{message}</p>
      </div>
    </div>
  );
};

export default Loader;
