import { useAuthStore } from "../../stores";

const logoutUser = () => {
  useAuthStore.getState().logout();
};

export default logoutUser;
