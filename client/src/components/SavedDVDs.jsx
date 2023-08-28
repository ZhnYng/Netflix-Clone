import React, { useState, useEffect } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import Movie from './Movie';
import axios from 'axios';

const SavedDVDs = () => {
  const [checkout, setCheckout] = React.useState(false);
  const [movies, setMovies] = useState([]);

  const slideLeft = () => {
    var slider = document.getElementById('slider');
    slider.scrollLeft = slider.scrollLeft - 500;
  };
  const slideRight = () => {
    var slider = document.getElementById('slider');
    slider.scrollLeft = slider.scrollLeft + 500;
  };

  useEffect(() => {
    axios.get('/basket', {headers: {authorization:`Bearer ${localStorage.getItem('token')}`}})
      .then(res => {
        setMovies(res.data)
      })
      .catch(err => {
        console.log(err);
      })
  }, [localStorage.getItem('token')]);

  return (
    <div className='col-span-8'>
      <div className='flex items-center p-4'>
        <h2 className='text-white/60 font-bold md:text-xl p-4'>My Basket</h2>
      </div>
      <div className='relative flex items-center group'>
        <MdChevronLeft
          onClick={slideLeft}
          className='bg-white rounded-full opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block'
          size={40}
        />
        <div
          id={'slider'}
          className='w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide relative'
        >
          {movies.map((item) => (
            <Movie key={item?.film_id} item={item}/>
          ))}
        </div>
        <MdChevronRight
          onClick={slideRight}
          className='bg-white rounded-full opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block'
          size={40}
        />
      </div>
    </div>
  );
};

export default SavedDVDs;
