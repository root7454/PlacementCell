import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../../main";
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks"; 
import PopularCategories from "./PopularCategories";
import PopularCompanies from "./PopularCompanies";
import UserList from "./Students";

const Home = () => {
  const { isAuthorized, user } = useContext(Context); // Get user role
  if (!isAuthorized) {
    return <Navigate to={"/login"} />;
  }
  return (
    <>
      <section id="profile" >
        {/* Conditionally render HowItWorks based on user's role */}
        {user && user.role === "Student" ? null :<HeroSection /> }
        {/* Conditionally render HowItWorks based on user's role */}
        {user && user.role === "Student" ? null :<HowItWorks /> }
        {user && user.role === "Student" ? null :<UserList /> }
        <PopularCategories />
        <PopularCompanies />
      </section>
    </>
  );
};

export default Home;
