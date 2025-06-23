import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import SocialLogIn from '../../shared/SocialLogIn';

const LogIn = () => {
    const { register, handleSubmit ,formState:{errors}} = useForm()
    const onSubmit = data => {
        console.log(data)
    }
    return (
        <div className='lg:px-24 px-8 md:px-18'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset className="fieldset">
                    <p className='text-4xl font-extrabold'>Welcome Back</p>
                    <p className='font-semibold pb-1'>Login with DropSwift</p>
                    <label className="label">Email</label>
                    <input {...register('email')} type="email" className="input w-full" placeholder="Email" />
                    <label className="label">Password</label>
                    <input {...register('password',{
                        required:true,
                        minLength:6
                    })} type="password" className="input w-full" placeholder="Password" />
                    {
                        errors.password?.type==='required' && <p className='text-red-500'>Password is required</p>
                    }
                    {
                        errors.password?.type==='minLength' && <p className='text-red-600'>Password must be 6 characters or longer</p>
                    }
                    <div><a className="link link-hover">Forgot password?</a></div>
                    <button className="btn btn-neutral mt-4 border-0 text-black bg-[rgb(202,235,102)]">Login</button>
                </fieldset>
                <p className='text-[#71717A]'>Don’t have any account? <Link className='text-[#8FA748]' to={'/register'}>Register</Link></p>
            </form>
            <div class="divider">OR</div>
            <div>
                <SocialLogIn/>
            </div>
        </div>
    );
};

export default LogIn;