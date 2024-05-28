import "./App.css";
import { MainContainer } from "./component";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <MainContainer />
      <ToastContainer limit={1} />
    </>
  );
}

export default App;
