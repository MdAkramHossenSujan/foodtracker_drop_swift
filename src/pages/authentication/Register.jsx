import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router';
import useAuth from '../../hooks/useAuth';
import SocialLogIn from '../../shared/SocialLogIn';
import toast from 'react-hot-toast';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => setShowPassword((prev) => !prev);
    const {createUser}=useAuth()
    const { register, handleSubmit, formState: { errors },reset } = useForm()
    const onSubmit = data => {
        console.log(data)
      createUser(data.email,data.password)
      .then(result=>{
        console.log(result.user)
        toast.success('Registered successfully')
        reset()
      }).catch(error=>{
        console.log(error)
      })
    }
    return (
        <div className='lg:px-24 px-8 md:px-18'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset className="fieldset">
                    <p className='text-4xl font-extrabold'>Create an Account</p>
                    <p className='font-semibold pb-1'>Register with Profast</p>
                    <label className="label">Email</label>
                    <input {...register('email', {
                        required: true
                    })} type="email" className="input w-full" placeholder="Email" />
                    {
                        errors.email?.type === 'required' && <p className='text-red-500'>Email is required</p>
                    }
                    <label className="label">Password</label>
                    <div className='relative'>
                        <input {...register('password', {
                            required: true,
                            pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/,
                                message:
                                    "Password must be 6+ characters, include uppercase, lowercase, number, and special character",
                            }
                        })} type={showPassword ? "text" : "password"} className="input w-full" placeholder="Password" />
                        {
                            errors.password?.type === 'required' && <p className='text-red-500'>Password is required</p>
                        }
                        {errors.password && (
                            <p className="text-red-500 text-sm">{errors.password.message}</p>
                        )}
                        <span
                            onClick={togglePassword}
                            className="absolute right-3 top-3 z-100 cursor-pointer text-gray-500"
                        >
                            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18}/>}
                        </span>
                    </div>
                    <div><a className="link link-hover">Forgot password?</a></div>
                    <button className="btn btn-neutral mt-4 border-0 text-black bg-[rgb(202,235,102)]">Register</button>
                </fieldset>
                <p className='text-[#71717A]'>Already have an account? <Link className='text-[#8FA748]' to={'/login'}>Login</Link></p>
            </form>
            <div className="divider">OR</div>
            <div>
                <SocialLogIn/>
            </div>
        </div>
    );
};

export default Register;