import { Routes, Route } from "react-router-dom";
import LayoutCms from "../layout";
import AppointmentScreen from "../screens/Appointments/AppointmentsScreen";
import LoginScreen from "../screens/Login/LoginScreen";

const CmsRouter = () => {
  return (
    <Routes>
      <Route path="cms" element={<LoginScreen />} />
      <Route path="app" element={<LayoutCms />}>
        <Route index element={<AppointmentScreen />} />
        <Route path="appointment" element={<AppointmentScreen />} />
      </Route>
    </Routes>
  );
};
export default CmsRouter;
