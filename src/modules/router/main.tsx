import { BrowserRouter } from "react-router-dom";
import CmsRouter from "../cms/router/cmsRouter";
import PwaRouter from "../pwa/router/PwaRouter";

const MainRouter = () => {
  return (
    <BrowserRouter>
      <PwaRouter />
      <CmsRouter />
    </BrowserRouter>
  );
};
export default MainRouter;
