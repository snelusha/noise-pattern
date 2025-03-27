import type React from "react";
import type { ReactNode } from "react";

interface PaperProps {
  children: ReactNode;
}

const Paper: React.FC<PaperProps> = ({ children }) => {
  return <div className="relative">{children}</div>;
};

export default Paper;
