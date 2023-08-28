import axios from 'axios';
import React from 'react';
import SavedDVDs from '../components/SavedDVDs';

const Account = () => {
  const [accountDetails, setAccountDetails] = React.useState();

  React.useEffect(() => {
    axios.get('/customer', {headers: {authorization:`Bearer ${localStorage.getItem('token')}`}})
      .then((res) => {
        console.log(res.data[0]);
        setAccountDetails(res.data[0]);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [])

  return (
    <>
      <div className='w-full text-white'>
        <img
          className='w-full h-[400px] object-cover'
          src='https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg'
          alt='/'
        />
        <div className='bg-black/60 fixed top-0 left-0 w-full h-[400px]'></div>
        <div className='absolute top-[20%] p-4 md:p-8'>
          <h1 className='text-3xl md:text-5xl font-bold ml-10'>{accountDetails?.first_name} {accountDetails?.last_name}</h1>
          <h3 className='ml-10 underline'>{accountDetails?.email}</h3>
        </div>
      </div>
      <div className='lg:grid grid-cols-12'>
        <SavedDVDs />
        <div className="rounded-lg border-2 p-6 m-12 col-start-9 lg:col-span-4">
          <h1 className='text-xl font-extrabold underline p-1 text-red-600'>Address Details</h1>
          <h1 className='text-white text-xl font-bold flex'>
            {accountDetails?.address}, {accountDetails?.district}, {accountDetails?.city}
          </h1>
          <h1 className='text-white text-xl font-bold flex'>
            {accountDetails?.country}, {accountDetails?.postal_code}
          </h1>
          <div className='flex items-center'>
            <div>
              <h1 className='text-xl font-extrabold underline pt-5 text-red-600'>Contact Details</h1>
              <h1 className='text-white text-xl font-bold flex'>
                {accountDetails?.phone}
              </h1>
            </div>
            <div className='ml-12'>
              <h1 className='text-xl font-extrabold underline pt-5 text-red-600'>Store</h1>
              <h1 className='text-white text-xl font-bold flex'>
                {accountDetails?.store_id}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;
