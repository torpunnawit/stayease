import { message } from "antd";
import { NavigateFunction } from "react-router-dom";

export const checkSession = (navigate: NavigateFunction): boolean => {
  const cookies = document.cookie.split("; ");
  const sessionCookie = cookies.find((cookie) =>
    cookie.startsWith("session_id=")
  );

  if (!sessionCookie) {
    message.error("You must be logged in to access this page.");
    navigate("/");
    return false;
  }

  return true;
};
