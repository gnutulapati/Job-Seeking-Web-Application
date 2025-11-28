import React, { useContext } from "react";
import { FaUserPlus } from "react-icons/fa";
import { MdFindInPage } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../../config";

const HowItWorks = () => {
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  const handleCreateAccount = async () => {
    if (isAuthorized) {
      try {
        const response = await axios.get(`${API_URL}/api/v1/user/logout`, {
          withCredentials: true,
        });
        toast.success(response.data.message);
        setIsAuthorized(false);
        navigateTo("/register");
      } catch (error) {
        toast.error(error.response.data.message);
        setIsAuthorized(false);
        navigateTo("/register");
      }
    } else {
      navigateTo("/register");
    }
  };

  const handleMiddleCard = () => {
    if (user && user.role === "Employer") {
      navigateTo("/job/post");
    } else {
      navigateTo("/job/getall");
    }
  };

  const handleLastCard = () => {
    navigateTo("/job/getall");
  };

  return (
    <>
      <div className="howitworks">
        <div className="container">
          <h3>How JobZee Works</h3>
          <div className="banner">
            <div className="card" onClick={handleCreateAccount}>
              <FaUserPlus />
              <p>Create Account</p>
              <p>
                Sign up quickly to create your professional profile and start
                your journey.
              </p>
            </div>
            <div className="card" onClick={handleMiddleCard}>
              <MdFindInPage />
              <p>Find a Job/Post a Job</p>
              <p>
                Browse thousands of job listings or post your open positions to
                find top talent.
              </p>
            </div>
            <div className="card" onClick={handleLastCard}>
              <IoMdSend />
              <p>Apply For Job/Recruit Suitable Candidates</p>
              <p>
                Apply to your dream jobs with a single click or manage
                applications efficiently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowItWorks;
