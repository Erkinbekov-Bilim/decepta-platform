import { createContext, useContext, useState } from "react";
import "../styles/_variables.scss";

const IconConfigContext = createContext();

export const IconConfigProvider = ({ children })  => {

  const [iconConfig, setIconConfig] = useState({
    width: "32px",
    height: "32px",
    color: "var(--light-btn-primary-bg)",
  });

  return (
    <IconConfigContext.Provider value={{ iconConfig }}>
      {children}
    </IconConfigContext.Provider>
  )
}

export const useIconConfig = () => useContext(IconConfigContext);