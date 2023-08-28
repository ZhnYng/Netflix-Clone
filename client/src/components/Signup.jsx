import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [error, setError] = useState();
  const [storeAddress, setStoreAddress] = React.useState([]);
  const [formData, setFormData] = React.useState({
    store_id: "",
    first_name:"",
    last_name: "",
    email:"",
    password: "",
    address: {
      address_line1: "",
      address_line2: "",
      district: "",
      city_id: "",
      postal_code: "",
      phone: ""
    }
  })
  
  React.useEffect(() => {
    const storeAddress = async() => {
      await axios.get('/storeAddress')
        .then(res => {
          setStoreAddress(res.data)
        })
        .catch(err => {
          console.log(err);
        })
    }
    storeAddress();
  }, [])

  const handleChange = (event) => {
    const {name, value, type, checked} = event.target
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [name]: type === "checkbox" ? checked : value
      }
    })
    console.log(formData)
  }

  const handleChangeAddress = (event) => {
    const {name, value, type, checked} = event.target
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        address: {
          ...prevFormData.address,
          [name]: type === "checkbox" ? checked : value
        }
      }
    })
    console.log(formData)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.post('/customers', formData, {headers: {authorization:`Bearer ${localStorage.getItem('token')}`}})
      .then(res => {
        if(res.data.auth){
          setError(res.data.message)
        }else{
          console.log(res)
          setError(res.data.message)
        }
      })
      .catch(err => {
        console.log(err.response.data.message)
        setError(err.response.data.message)
      })
  };

  return (
    <>
      <div className='w-full flex justify-center'>
        <div className='flex justify-center xl:w-8/12 
          lg:w-9/12 md:w-8/12 w-full bg-gray-600 py-12 outline outline-white mb-6'>
          <div className='min-w-[450px] text-white'>
            <div className='max-w-[320px] mx-auto'>
              <h1 className='text-3xl font-bold text-center'>Customer</h1>
              {error ? <p className='p-3 bg-red-600 mt-2'>{error}</p> : null}
              <form
                className='w-full flex flex-col py-4'
              >
                <input
                  onChange={handleChange}
                  className='p-3 my-2 bg-gray-800 rouded'
                  id="first_name"
                  name="first_name"
                  type='text'
                  placeholder='First Name'
                  autoComplete='on'
                  value={formData.first_name}
                />
                <input
                  onChange={handleChange}
                  className='p-3 my-2 bg-gray-800 rouded'
                  id="last_name"
                  name="last_name"
                  type='text'
                  placeholder='Last Name'
                  autoComplete='on'
                  value={formData.last_name}
                />
                <input
                  onChange={handleChange}
                  className='p-3 my-2 bg-gray-800 rouded'
                  id="email"
                  name="email"
                  type='email'
                  placeholder='Email'
                  autoComplete='on'
                  value={formData.email}
                />
                <input
                  onChange={handleChange}
                  className='p-3 my-2 bg-gray-800 rouded'
                  id="password"
                  name="password"
                  type='password'
                  placeholder='Password'
                  autoComplete='on'
                  value={formData.password}
                />
                <input
                  onChange={handleChangeAddress}
                  className='p-3 my-2 bg-gray-800 rouded'
                  id="phone"
                  name="phone"
                  type='text'
                  placeholder='Phone no.'
                  autoComplete='on'
                  value={formData.address.phone}
                />
                <select name="store_id" id="store_id" 
                  value={formData.store_id}
                  onChange={handleChange}
                  className='p-3 my-2 bg-gray-800 rouded'
                >
                  <option value=''>--Store Address--</option>
                  {storeAddress?.map(address => {
                    return (
                      <option key={storeAddress.indexOf(address)} value={address.store_id}>
                        {address.address}
                      </option>
                    )
                  })}
                </select>
              </form>
            </div>
          </div>
          <div className='min-w-[450px] text-white'>
            <div className='max-w-[320px] mx-auto'>
              <h1 className='text-3xl font-bold text-center'>Address</h1>
              <form
                onSubmit={handleSubmit}
                className='w-full flex flex-col py-4'
              >
                <input
                  onChange={handleChangeAddress}
                  id="address_line1"
                  name="address_line1"
                  className='p-3 my-2 bg-gray-800 rouded'
                  type='text'
                  placeholder='Address'
                  autoComplete='on'
                  value={formData.address.address_line1}
                />
                <input
                  onChange={handleChangeAddress}
                  className='p-3 my-2 bg-gray-800 rouded'
                  id="address_line2"
                  name="address_line2"
                  type='text'
                  placeholder='Second address (optional)'
                  autoComplete='on'
                  value={formData.address.address_line2}
                />
                <input
                  onChange={handleChangeAddress}
                  className='p-3 my-2 bg-gray-800 rouded'
                  id="district"
                  name="district"
                  type='text'
                  placeholder='District'
                  autoComplete='on'
                  value={formData.address.district}
                />
                <input
                  onChange={handleChangeAddress}
                  className='p-3 my-2 bg-gray-800 rouded'
                  id="city_id"
                  name="city_id"
                  type='number'
                  placeholder='City Id'
                  autoComplete='on'
                  value={formData.address.city_id}
                />
                <input
                  onChange={handleChangeAddress}
                  className='p-3 my-2 bg-gray-800 rouded'
                  id="postal_code"
                  name="postal_code"
                  type='text'
                  placeholder='Postal code'
                  autoComplete='on'
                  value={formData.address.postal_code}
                />
                <button className='bg-red-600 py-3 mt-2 rounded font-bold'>
                  Sign Up
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
