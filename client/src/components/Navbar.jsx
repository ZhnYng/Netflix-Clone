import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const user = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  React.useEffect(() => {
    const verifyToken = async () => {
      await axios.post('/verifyToken', {}, {headers: {authorization:`Bearer ${localStorage.getItem('token')}`}})
        .catch(err => {
          if(err.response.data.auth === false){
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('userId');
            navigate('/login')
          }else{
            console.log(err);
          }
        })
    }
    if(user) verifyToken();
  }, [user])

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex absolute items-center justify-between p-4 px-10 z-[100] w-full bg-black'>
      <Link to='/'>
        <h1 className='text-red-600 text-4xl font-bold cursor-pointer'>
          SP DVD
        </h1>
      </Link>
      {user ? (
        role === '0' ? (
          <div>
            <Link to='/account'>
              <button className='text-white pr-4'>Account</button>
            </Link>
            <button
              onClick={handleLogout}
              className='bg-red-600 px-6 py-2 rounded cursor-pointer text-white'
            >
              Logout
            </button>
          </div>
        ):(
          <div>
            <Link to='/admin'>
              <button 
                className='mr-4 text-white'>Admin</button>
            </Link>
            <button
              onClick={handleLogout}
              className='bg-red-600 px-6 py-2 rounded cursor-pointer text-white'
              >
              Logout
            </button>
          </div>
        )
      ) : (
        <div>
          <Link to='/login'>
            <button
              className='bg-red-600 px-6 py-2 rounded cursor-pointer text-white'>
              Sign In
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
