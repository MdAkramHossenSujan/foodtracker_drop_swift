import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router';
import useAuth from '../../hooks/useAuth';
import SocialLogIn from '../../shared/SocialLogIn';
import toast from 'react-hot-toast';
import axios from 'axios';
import useAxios from '../../hooks/useAxios';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => setShowPassword((prev) => !prev);
    const { createUser, updateUser } = useAuth()
    const { register, handleSubmit, formState: { errors }, reset } = useForm()
    const [profile, setProfile] = useState('')
    const location=useLocation()
    const navigate=useNavigate()
    const from=location.state?.from || '/'
    const axiosInstance = useAxios()
    const onSubmit = data => {
        console.log(data.name)
        createUser(data.email, data.password)
            .then(async (result) => {
                console.log(result.user)
                const userProfile = {
                    displayName: data.name,
                    photoURL: profile
                }
                const userInfo = {
                    email: data.email,
                    role: 'user',//default
                    createdAt: new Date().toISOString(),
                    lastLogIn: new Date().toISOString()
                }
                const userResponse = await axiosInstance.post('/users', userInfo);
                console.log(userResponse.data)

                console.log(userProfile)
                //Update profile
                updateUser(userProfile).then(() => {
                    toast.success('Registered Successfully')
                    navigate(from)
                }).catch(error => {
                    console.log(error)
                })
                reset()
            }).catch(error => {
                console.log(error)
            })
    }
    const handleImageUpload = async (e) => {
        const image = e.target.files[0]
        console.log(image)
        const formData = new FormData()
        formData.append('image', image)
        console.log(formData)

        const res = await axios.post(`https://api.imgbb.com/1/upload?&key=${import.meta.env.VITE_imageUpload_key}`, formData)
        setProfile(res.data.data.url)
    }
    return (
        <div className='lg:px-24 px-8 md:px-18'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset className="fieldset">
                    <p className='text-4xl font-extrabold'>Create an Account</p>
                    <p className='font-semibold pb-1'>Register with Profast</p>
                    <label className='label'>Name</label>
                    <input {...register('name', {
                        required: true
                    })} type="text" className="input w-full" placeholder="Your name" />
                    {/*image field */}
                    <label className='label'>Image</label>
                    <input onChange={handleImageUpload} type="file" className='file-input w-full' placeholder='Your profile image' />
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
                            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </span>
                    </div>
                    <div><a className="link link-hover">Forgot password?</a></div>
                    <button className="btn btn-neutral mt-4 border-0 text-black bg-[rgb(202,235,102)]">Register</button>
                </fieldset>
                <p className='text-[#71717A]'>Already have an account? <Link className='text-[#8FA748]' to={'/login'}>Login</Link></p>
            </form>
            <div className="divider">OR</div>
            <div>
                <SocialLogIn />
            </div>
        </div>
    );
};

export default Register;