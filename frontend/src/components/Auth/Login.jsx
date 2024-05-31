import React, { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import Lottie from 'react-lottie';
import animationData from '../AnimationPage/Login.json'

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  renderer: 'svg'
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const { isAuthorized, setIsAuthorized } = useContext(Context);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        { email, password, role },
        {
          
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
        
      );
      toast.success(data.message);
      setEmail("");
      setPassword("");
      setRole("");
      setIsAuthorized(true);
    } catch (error) {
      toast.error(error.response.data.message);
    }
    
  };

  

  if(isAuthorized){
    return <Navigate to={'/'}/>
  }

  return (
    <>
      <section className="vh-100" style={{ backgroundColor: '#eee' }}>
  <div className="container h-100">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-lg-12 col-xl-11">
        <div className="card text-black"  style={{ borderRadius: '25px' }}>
          <div className="card-body p-md-5">
            <div className="row justify-content-center">
              <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">

                <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign In</p>

                <form className="mx-1 mx-md-4">
                <div className="d-flex flex-row align-items-center mb-4">
                    <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                    <div className="form-outline flex-fill mb-0">
                      <select id="form3Example2c" className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="">Select Role</option>
                        <option value="TPO">TPO</option>
                        <option value="Student">Student</option>
                      </select>
                    </div>
                  </div>
                
             
                <div className="d-flex flex-row align-items-center mb-4">
                    <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                    <div className="form-outline flex-fill mb-0">
                      <input type="email" id="form3Example3c" className="form-control"  value={email}
                  onChange={(e) => setEmail(e.target.value)} />
                      <label className="form-label">Your Email</label>
                    </div>
                  </div>
               
   
                <div className="d-flex flex-row align-items-center mb-4">
                    <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                    <div className="form-outline flex-fill mb-0">
                      <input type="password" id="form3Example4c" className="form-control" value={password}
                  onChange={(e) => setPassword(e.target.value)}/>
                      <label className="form-label">Password</label>
                    </div>
                  </div> 

                  <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                    <button type="button" className="btn btn-primary btn-lg" onClick={handleLogin}>Login</button>
                  </div>
                  <Link to={"/register"}>Register Now</Link>
                  </form>
                  </div>
                <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">

                <Lottie
                options={defaultOptions}
                height={500}
                width={500}
               />

</div>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
    </>
  );
};

export default Login;
