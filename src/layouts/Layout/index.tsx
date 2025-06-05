import Header from "../Header";
import Footer from "../Footer";
import { Outlet } from "react-router-dom";

interface Props {
  handelLogout: () => void;
  handleShowLoginModal: () => void;
}

function Layout(props: Props) {
  const { handelLogout, handleShowLoginModal } = props;

  return (
    <div>
      <Header handelLogout={handelLogout} handleShowLoginModal={handleShowLoginModal} />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Layout;
