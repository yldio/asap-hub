import { Button } from "@repo/ui/button";
import { createRoot } from "react-dom/client";
import "./style.css";

const App = () => (
  <div>
   <Button>HI</Button>
  </div>
);

createRoot(document.getElementById("app")!).render(<App />);
