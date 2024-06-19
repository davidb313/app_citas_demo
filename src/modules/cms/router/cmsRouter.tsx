import { Routes, Route } from "react-router-dom";
import LayoutCms from "../layout";
import LoginScreen from "../screens/Login/LoginScreen";
import ServicesScreen from "../screens/Services/ServicesScreen";
import AppointmentsTab from "../screens/Appointments/AppointmentsTab";

const CmsRouter = () => {
  return (
    <Routes>
      <Route path='cms' element={<LoginScreen />} />
      <Route path='app' element={<LayoutCms />}>
        <Route index element={<AppointmentsTab />} />
        <Route path='appointment' element={<AppointmentsTab />} />
        <Route path='services' element={<ServicesScreen />} />
      </Route>
    </Routes>
  );
};
export default CmsRouter;
