import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Movie = ({item}) => {
  const [like, setLike] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    axios.get('/basket', {headers: {authorization:`Bearer ${localStorage.getItem('token')}`}})
      .then(res => {
        const savedFilms = []
        for(const data of res.data){
          savedFilms.push(data.film_id);
        }
        if(savedFilms.includes(item?.film_id)){
          setLike(true);
        }
      })
      .catch(err => {
        console.log(err);
      })
  }, [localStorage.getItem('token')]);

  const saveShow = async () => {
    if (localStorage.getItem('token')) {
      if(!like){
        await axios.post('/saveFilm', 
        {film_id: item?.film_id},
        {headers: {authorization:`Bearer ${localStorage.getItem('token')}`}})
          .then(res => {
              setLike(!like);
              console.log(res);
            })
          .catch(err => {
            console.log(err);
          })
      }else{
        await axios.delete('/unsaveFilm', {
          headers: {authorization:`Bearer ${localStorage.getItem('token')}`},
          data: {film_id: item?.film_id}
        })
          .then(res => {
            setLike(!like);
            console.log(res);
          })
          .catch(err => {
            console.log(err);
          })
      }
    } else {
      alert('Please log in to save a movie');
      navigate('/login');
    }
  };

  return (
    <>
    <div className='w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] inline-block cursor-pointer relative p-2'>
      <img
        className='w-full h-auto block'
        src={`https://picsum.photos/id/${item?.film_id}/500/300`} //https://picsum.photos/
        alt={item?.title}
      />
      <div className='absolute top-0 left-0 w-full h-full hover:bg-black/80 opacity-0 hover:opacity-100 text-white'>
        <p onClick={() => navigate(`/movieDetails/${item?.film_id}`)} className='white-space-normal text-xs md:text-sm font-bold flex justify-center items-center h-full text-center'>
          {item?.title}
        </p>
        <p onClick={saveShow}>
          {like ? (
            <FaHeart className='absolute top-4 left-4 text-gray-300' />
          ) : (
            <FaRegHeart className='absolute top-4 left-4 text-gray-300' />
          )}
        </p>
      </div>
    </div>
    </>
  );
};

export default Movie;
