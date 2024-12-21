import { ReactNode } from "react";

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return <div className="bg-black text-white min-h-screen">{children}</div>;
};

export default ThemeProvider;
