import React, { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser,faEnvelope,faUsers,faPhoneVolume,faLock } from '@fortawesome/free-solid-svg-icons'
import Lottie from 'react-lottie';
import animationData from '../AnimationPage/Register.json'

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  renderer: 'svg'
}



const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const { isAuthorized, setIsAuthorized, user, setUser } = useContext(Context);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/register",
        { name, phone, email, role, password },
        {
          headers: 
          {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
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
                <div className="text-center">
                <img  src="/sbgi.png" width="130" height="130"></img>
                </div>
                <p className="text-center h3 fw-bold mb-4 mx-1 mx-md-4 mt-4">Sign Up</p>
                <form className="mx-1 mx-md-4">
                 
                  <div className="d-flex flex-row align-items-center mb-4">
                  <FontAwesomeIcon icon={faUsers} className="fa-lg me-3 fa-fw"/> 
                    <div className="form-outline flex-fill mb-0">
                      <select id="form3Example2c" className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="">Select Role</option>
                        <option value="Student">Student</option>
                      </select>
                    </div>
                  </div>

                  <div className="d-flex flex-row align-items-center mb-4">
                  <FontAwesomeIcon icon={faUser} className="fa-lg me-2 fa-fw"/>
                    <div className="form-outline flex-fill mb-0">                  
                      <input type="text" id="firstName" className="form-control" placeholder="Enter Your Name"  value={name} onChange={(e) => setName(e.target.value)} />
                        
                    </div>
                  </div>

                  <div className="d-flex flex-row align-items-center mb-4">
                  <FontAwesomeIcon icon={faEnvelope}  className="fa-lg me-2 fa-fw"/>
                    <div className="form-outline flex-fill mb-0">
                      <input type="email" placeholder="Enter Your Email" className="form-control"  value={email}
                  onChange={(e) => setEmail(e.target.value)} />
                      
                    </div>
                  </div>


                  <div className="d-flex flex-row align-items-center mb-4">
                  <FontAwesomeIcon icon={faPhoneVolume} className="fa-lg me-2 fa-fw"/>
                    <div className="form-outline flex-fill mb-0">
                      <input type="number" id="form3Example3c" className="form-control"  value={phone}
                  onChange={(e) => setPhone(e.target.value)} />
                     
                    </div>
                  </div>


                  <div className="d-flex flex-row align-items-center mb-4">
                    <FontAwesomeIcon icon={faLock} className="fa-lg me-3 fa-fw" />
                    <div className="form-outline flex-fill mb-0">
                      <input type="password" id="form3Example4c" className="form-control" value={password}
                  onChange={(e) => setPassword(e.target.value)}/>
                      
                    </div>
                  </div> 


                  
                  <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                    <button type="button" className="btn btn-primary btn-lg" onClick={handleRegister}>Register</button>
                  </div>
                  <Link to={"/Login"}>Login Now</Link>
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

export default Register;
