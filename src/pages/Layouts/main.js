import React from "react";
import { Container } from "@material-ui/core";
import SideBar from "../../components/SideBar";
import { ToastContainer } from "react-toastify";

export default function Body(props) {
  return (
    <Container>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
        <SideBar>{props.children}</SideBar>
    </Container>
  );
}
