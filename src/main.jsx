import "./global.css";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ApiProvider } from "./context/apiContext.jsx";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
   <StrictMode>
      <BrowserRouter>
         <AuthProvider>
             <ApiProvider>
               <App />
            </ApiProvider>
         </AuthProvider>
      </BrowserRouter>
   </StrictMode>
);
