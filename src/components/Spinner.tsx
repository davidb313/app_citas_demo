import { Spin } from "antd";

export const Spinner = () => (
  <div style={style.spiinercontainer}>
    <Spin size="large" />
  </div>
);

const style = {
  spiinercontainer: {
    display: "flex",
    justifyContent: "center",
  },
};
