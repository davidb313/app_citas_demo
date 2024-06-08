import { Routes, Route } from "react-router-dom";
import LayoutCms from "../layout";
import AppointmentScreen from "../screens/Appointments/AppointmentsScreen";
import LoginScreen from "../screens/Login/LoginScreen";
import ServicesScreen from "../screens/Services/ServicesScreen";

const CmsRouter = () => {
  return (
    <Routes>
      <Route path='cms' element={<LoginScreen />} />
      <Route path='app' element={<LayoutCms />}>
        <Route index element={<AppointmentScreen />} />
        <Route path='appointment' element={<AppointmentScreen />} />
        <Route path='services' element={<ServicesScreen />} />
      </Route>
    </Routes>
  );
};
export default CmsRouter;