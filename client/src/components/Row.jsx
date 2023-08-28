import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Movie from './Movie';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import Pagination from './Pagination';

const Row = ({ title, fetchURL, rowID, searchResults, search }) => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage, setMoviesPerPage] = useState(10);

  useEffect(() => {
    axios.get(fetchURL, {params: {offset: (currentPage-1)*moviesPerPage}})
      .then((result) => {
        setMovies(prevSearchResults => {
          return [...prevSearchResults, ...result.data]
        })
      })
      .catch(err => {
        if(!fetchURL){
          setMovies(searchResults);
        }else{
          console.log(err);
        }
      })
  }, [fetchURL, searchResults, currentPage]);

  const slideLeft = () => {
    var slider = document.getElementById('slider' + rowID);
    slider.scrollLeft = slider.scrollLeft - 500;
  };
  const slideRight = () => {
    var slider = document.getElementById('slider' + rowID);
    slider.scrollLeft = slider.scrollLeft + 500;
    setCurrentPage(prevCurrentPage => prevCurrentPage + 1)
  };

  const indexOfLastFilm = currentPage * moviesPerPage;
  const currentMovies = movies.slice(0, indexOfLastFilm);

  return (
    !search ?
    <div className='px-12 py-4'>
      <>
        <h2 className='text-white font-bold md:text-xl p-4'>{title}</h2>
        <div className='relative flex items-center group'>
          <MdChevronLeft
            onClick={slideLeft}
            className='bg-white left-0 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block'
            size={40}
          />
          <div
            id={'slider' + rowID}
            className='w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide relative'
          >
            {movies?.map((item, id) => (
              <Movie key={id} movieId={id} item={item}/>
            ))}
          </div>
          <MdChevronRight
            onClick={slideRight}
            className='bg-white right-0 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block'
            size={40}
          />
        </div>
      </>
    </div>
    :
    <>
    <div className='pl-8 py-4 pb-20'>
      <div
        id={'slider' + rowID}
        className='w-full h-full flex p-6 flex-wrap gap-y-12'
      >
        {currentMovies?.map((item, id) => (
          <Movie key={id} movieId={id} item={item}/>
        ))}
      </div>
      <Pagination postsPerPage={moviesPerPage} totalPosts={movies.length} paginate={setCurrentPage}/>
    </div>
    </>
  );
};

export default Row;
