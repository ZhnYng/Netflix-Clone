import React from 'react';
import Signup from '../components/Signup';
import AddActor from '../components/AddActor';
import UpdateCustomer from '../components/UpdateCustomer';

export default function Admin(){
  const [adminFunction, setAdminFunction] = React.useState()
  
  return(
    <div className='pt-20'>
      <h1 className='text-white text-4xl font-bold text-center'>Administrative</h1>
      <div className='text-white gap-5 flex justify-center'>
        <button onClick={() => setAdminFunction("Signup")}
        className="bg-red-600 py-3 my-6 px-6 rounded font-bold">
          New customer
        </button>
        <button onClick={() => setAdminFunction("AddActor")}
        className="bg-red-600 py-3 my-6 px-6 rounded font-bold">
          Add actor
        </button>
        <button onClick={() => setAdminFunction("UpdateCustomer")}
        className="bg-red-600 py-3 my-6 px-6 rounded font-bold">
          Update customer
        </button>
      </div>
      {adminFunction == "Signup" ? <Signup/> : null}
      {adminFunction == "AddActor" ? <AddActor/> : null}
      {adminFunction == "UpdateCustomer" ? <UpdateCustomer/> : null}
    </div>
  );
}