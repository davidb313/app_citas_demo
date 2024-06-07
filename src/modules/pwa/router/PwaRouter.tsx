import { Route, Routes } from "react-router-dom";
import ClientScreen from "../screens/Client/ClientScreen";

const PwaRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<ClientScreen />} />
    </Routes>
  );
};
export default PwaRouter;
