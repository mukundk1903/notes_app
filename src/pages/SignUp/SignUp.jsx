/* eslint-disable no-unused-vars */
import React, { useState } from "react"
import Navbar from "../../components/Navbar/Navbar.jsx"
import { Link, useNavigate } from 'react-router-dom'
import PasswordInput from '../../components/Input/PasswordInput.jsx'
import { validateEmail } from "../../utils/helper.js"
import axiosInstance from "../../utils/axiosInstance.js"

const SignUp = () => {

  const [name, setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if(!name){
      setError("Please Enter a Name")
      return;
    }
    if(!validateEmail(email)){
      setError("Please Enter a valid email address.")
      return;
    }
    if(!password){
      setError("Please Enter the password.")
      return;
    }
    setError("")
    //Signup API call
    try{
      const response = await axiosInstance.post("create-account", {
        fullName: name,
        email:email,
        password:password,
      });
      //handle successful registration response
      if(response.data && response.data.error) {
        setError(response.data.message)
        return
      }
      if(response.data && response.data.accessToken){
        localStorage.setItem("token", response.data.accessToken)
        navigate('/dashboard');
      }
    }catch(error){
      //handle login error
      if(error.response && error.response.data && error.data.message){
        setError(error.response.data.message);
      }else{
        setError("An unexpected error occured. Please try again")
      }
    }
  };

  return (
    <>
    <Navbar />
    <div className='flex items-center justify-center mt-28'>
      <div className='w-96 border rounded bg-white px-7 py-10'>
       <form onSubmit={handleSignUp}>
        <h4 className='text-2xl mb-7'>Sign Up</h4>
        <input 
          type="text" 
          placeholder='Name' 
          className='input-box'
          value= {name}
          onChange= {(e) => setName(e.target.value)}
        />

        <input 
          type="text" 
          placeholder='Email' 
          className='input-box'
          value= {email}
          onChange= {(e) => setEmail(e.target.value)}
        />

        <PasswordInput 
          value = {password}
          onChange={(e)=> setPassword(e.target.value)}
        />
        {error && <p className='text-red-500 text-xs pb-1'>{error}</p> }
        <button 
          type='submit' 
          className='btn-primary'>
          Create Account
        </button>
        <p className='text-sm text-center mt-4'>
          Already have an account?{""}
          <Link to="/Login" className='font-medium text-primary underline'>
            Login
          </Link>
        </p>
       </form>
      </div>
    </div>
    </>
  )
}

export default SignUp