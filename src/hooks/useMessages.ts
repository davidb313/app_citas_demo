import { message } from "antd";

export const useMessages = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const showSuccess = (content: string, duration = 7) => {
    messageApi.open({
      type: "success",
      content,
      duration,
    });
  };

  const showError = (content: string) => {
    messageApi.open({
      type: "error",
      content,
    });
  };

  const showInfo = (content: string) => {
    messageApi.open({
      type: "info",
      content,
    });
  };

  return { showSuccess, showError, showInfo, contextHolder };
};
