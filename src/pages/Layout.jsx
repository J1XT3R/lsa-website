/* eslint-disable react/prop-types */
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
export default function Layout(props) {
  const clubData = props.clubData;

  return (
    <>
      <Navbar clubData={clubData} />
      <Outlet />
      <Footer />
    </>
  );
}
