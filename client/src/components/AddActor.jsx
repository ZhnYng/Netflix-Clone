import React from "react";
import axios from "axios";

export default function AddActor(){
  const [error, setError] = React.useState();
  const [formData, setFormData] = React.useState({
    first_name:"",
    last_name: ""
  })
    
  const handleChange = (event) => {
    const {name, value} = event.target
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [name] : value
      }
    })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.post('/actors', formData, {headers: {authorization:`Bearer ${localStorage.getItem('token')}`}})
      .then(res => {
        console.log(res);
        setError(res.data.message);
      })
      .catch(err => {
        console.log(err);
        setError(err.response.data.message);
      })
  };
  return (
    <div className="w-full flex justify-center">
      <div className="outline outline-white min-w-[450px] py-20 bg-gray-600">
        <div className='max-w-[320px] mx-auto text-white'>
          <h1 className='text-3xl font-bold text-center'>Add Actor</h1>
          {error ? <p className='p-3 bg-red-600 mt-2'>{error}</p> : null}
          <form
            onSubmit={handleSubmit}
            className='w-full flex flex-col py-4'
          >
            <input
              onChange={handleChange}
              name="first_name"
              id="first_name"
              className='p-3 my-2 bg-gray-800 rouded'
              type='text'
              placeholder='First Name'
              autoComplete='on'
              value={formData.first_name}
            />
            <input
              onChange={handleChange}
              name="last_name"
              id="last_name"
              className='p-3 my-2 bg-gray-800 rouded'
              type='text'
              placeholder='Last Name'
              autoComplete='on'
              value={formData.last_name}
            />
            <button className='bg-red-600 py-3 my-6 rounded font-bold'>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}