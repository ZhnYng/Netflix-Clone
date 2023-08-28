import React from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import StarRating from "./StarRating";

export default function MovieDetails(){
  const {filmId} = useParams()
  const [rating, setRating] = React.useState(5);
  const [movieDetails, setMovieDetails] = React.useState([]);
  const [movieRating, setMovieRating] = React.useState([]);
  const [offset, setOffset] = React.useState(0);
  const stars = [1, 2, 3, 4, 5];
  const navigate = useNavigate();

  React.useEffect(() => {
    axios.get('/film', {params: {filmId: filmId}})
      .then(res => {
        setMovieDetails(res.data);
        console.log(res.data)
      })
      .catch(err => {
        console.log(err);
      })

    axios.get('/overallRating', {params: {filmId: filmId}})
      .then(res => {
        setRating(Object.values(res.data[0]));
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }, [filmId])

  React.useEffect(() => {
    axios.get('/rating', {params: {filmId: filmId, offset: offset}})
      .then(res => {
        setMovieRating(prevMovieRating => {
          return [...prevMovieRating, ...res.data];
        })
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }, [offset])

  const truncateString = (str, num) => {
    if (str?.length > num) {
      return str.slice(0, num) + '...';
    } else {
      return str;
    }
  };

  const handleRightClick = () => {
    setOffset(prevOffset => movieRating[offset + 1] ? prevOffset + 1 : offset);
  }
  const handleLeftClick = () => {
    setOffset(prevOffset => prevOffset > 0 ? prevOffset - 1 : 0);
  }

  return (
    <div className='w-full h-screen text-white'>
      <div className='w-full h-full flex justify-center'>
        <div className='absolute w-full h-full bg-gradient-to-r -z-40 from-black'></div>
        <img
          className='w-full h-full object-cover absolute -z-50'
          src={`https://picsum.photos/id/${filmId}/1000`} //https://picsum.photos/
          alt={movieDetails[0]?.title}
        />
        <div className='w-full flex justify-center h-full flex-col p-4 md:p-20'>
          <h1 className='text-3xl md:text-5xl font-bold'>{movieDetails[0]?.title}</h1>
          <div className='my-4'>
            <button onClick={() => navigate('/')} className='border text-white border-gray-300 py-2 px-12 hover:bg-gray-600'>
              Back
            </button>
          </div>
          <p className='text-gray-400 text-lg'>
            Released Year: {movieDetails[0]?.release_year}
          </p>
          <p className='w-full text-xl text-gray-200'>
            {truncateString(movieDetails[0]?.description, 150)}
          </p>
          <div className="py-3 flex gap-3">
            <p className='text-gray-400 text-xl'>
              {movieDetails[0]?.length} mins
            </p>
            {movieDetails[0]?.rating == "R" && 
              <p className='text-white font-extrabold text-md bg-red-600 w-min py-1 px-2.5 border-white border-2 rounded-md'>
                {movieDetails[0]?.rating}
              </p>
            }
            {movieDetails[0]?.rating == "NC-17" && 
              <p className='text-white font-extrabold text-md bg-yellow-600 w-18 text-center py-1 px-2.5 border-white border-2 rounded-md'>
                {movieDetails[0]?.rating}
              </p>
            }
            {movieDetails[0]?.rating == "PG-13" && 
              <p className='text-white font-extrabold text-md bg-green-600 w-18 text-center py-1 px-2.5 border-white border-2 rounded-md'>
                {movieDetails[0]?.rating}
              </p>
            }
            {movieDetails[0]?.rating == "PG" && 
              <p className='text-white font-extrabold text-md bg-green-600 w-18 text-center py-1 px-2.5 border-white border-2 rounded-md'>
                {movieDetails[0]?.rating}
              </p>
            }
            {movieDetails[0]?.rating == "G" && 
              <p className='text-white font-extrabold text-md bg-green-600 w-18 text-center py-1 px-2.5 border-white border-2 rounded-md'>
                {movieDetails[0]?.rating}
              </p>
            }
          </div>
        </div>
        <div className="bg-black/80 w-4/5 mx-16 mt-20 mb-2 p-12 flex-col flex justify-evenly">
          <div className="flex-col flex">
            <div className="flex items-center">
              <div className="w-10 h-4 mr-1 bg-red-600"></div>
              <h1 className="text-2xl min-w-fit font-bold">What to know</h1>
              <div className="w-full h-4 ml-1 bg-red-600"></div>
            </div>
            <h3 className="text-xl font-bold underline">Reviews</h3>
            <div className="flex p-3">
              <h1 className="text-xl">Rating: </h1>
              {stars?.map((star) => (
                <label
                  key={star}
                  className={`cursor-pointer text-gray-500 ${
                    star <= rating ? "text-yellow-400" : ""
                  }`}
                >
                  <svg
                    className="w-7 h-7"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.62L12 2L9.19 8.62L2 9.24L7.45 13.97L5.82 21L12 17.27Z"
                      fill="currentColor"
                    />
                  </svg>
                </label>
              ))}
            </div>
            <div className="flex justify-center items-center mb-3">
              <MdChevronLeft
                onClick={handleLeftClick}
                className='rounded-full hover:opacity-100 cursor-pointer z-10 group-hover:block'
                size={40}
              />
              <div className="bg-black p-3 rounded-xl border-red-600 border-4">
                <p>By: {movieRating[offset]?.email}</p>
                <p>Review: {movieRating[offset]?.reviews}</p>
                <p>Rating: {movieRating[offset]?.stars}/5</p>
              </div>
              <MdChevronRight
                onClick={handleRightClick}
                className='rounded-full hover:opacity-100 cursor-pointer z-10 group-hover:block'
                size={40}
              />
            </div>
          </div>
          <div className="flex-col flex">
            <div className="flex items-center">
              <div className="w-10 h-4 mr-1 bg-red-600"></div>
              <h1 className="text-2xl min-w-fit font-bold">Film info</h1>
              <div className="w-full h-4 ml-1 bg-red-600"></div>
            </div>
            <p>Language: {movieDetails[0]?.name}</p>
            <p>Category: {movieDetails[0]?.category}</p>
            <p>Rental rate: {movieDetails[0]?.rental_rate}</p>
            <p>Replacement cost: {movieDetails[0]?.replacement_cost}</p>
            <p>Special features: {movieDetails[0]?.special_features}</p>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <div className="w-10 h-4 mr-1 bg-red-600"></div>
              <h1 className="text-2xl min-w-fit font-bold">Cast & Crew</h1>
              <div className="w-full h-4 ml-1 bg-red-600"></div>
            </div>
            <div className="flex flex-wrap">
              {movieDetails.map((detail) => (
                <p key={movieDetails.indexOf(detail)}>{detail?.first_name} {detail?.last_name}, &nbsp;</p>
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <div className="w-10 h-4 mr-1 bg-red-600"></div>
              <h1 className="text-2xl min-w-fit font-bold">Rate and review</h1>
              <div className="w-full /6 h-4 ml-1 bg-red-600"></div>
            </div>
            <StarRating filmId={filmId}/>
          </div>
        </div>
      </div>
    </div>
  )
}