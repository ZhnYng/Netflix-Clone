import React from "react"
import axios from "axios";
import Movie from "./Movie";
import Pagination from "./Pagination";

export default function Search({search, setSearch}) {
  const [categoryNames, setCategoryNames] = React.useState([]);
  const [searchResults, setSearchResults] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [moviesPerPage, setMoviesPerPage] = React.useState(10);
  const [controller, setController] = React.useState();
  const [searchQuery, setSearchQuery] = React.useState({
    title: "",
    category: "",
    maxPrice: "",
  });

  const handleChange = (event) => {
    const {name, value} = event.target
    setSearchQuery(prevFormData => {
      return {
        ...prevFormData,
        [name]: value
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    getSearch(controller?.signal)
  }

  React.useEffect(() => {
    axios.get('/categoryNames')
      .then(res => {
        const tempArray = []; 
        for(const record of res.data){
          tempArray.push(record.category)
        }
        setCategoryNames(tempArray);
      })
      .catch(err => {
        console.log(err);
      })
  }, [search])

  // When the search query changes before the previous requests have returned, the previous requests are cancelled
  React.useEffect(() => {
    if(Object.values(searchQuery).filter(x => x.length > 0).length == 0) {
      setSearch(false);
    }else{
      const newController = new AbortController();
      setController(newController);
      getSearch(newController.signal)
    }

    console.log(searchQuery)
    //cleanup function
    return () => {controller?.abort();};
  }, [searchQuery.title, searchQuery.category, searchQuery.maxPrice, search, currentPage]);

  const getSearch = async (signal) => {
    await axios.get('/search_films', {
      params: { 
        title: searchQuery.title, 
        category: searchQuery.category, 
        maxPrice: searchQuery.maxPrice,
        offset: (currentPage-1)*moviesPerPage
      }, signal: signal})
      .then(res => {
        setSearchResults(res.data);
        setSearch(true);
      })
      .catch(err => {
        if(axios.isCancel(err)){
          console.log("Request cancelled")
        }else{
          console.log(err);
        }
      })
  }

  return (
    <>
    <div className='mt-6 w-full text-center'>
      <form className='flex justify-center h-12 gap-6' onSubmit={handleSubmit}>
        <input
          type="text"
          id="title"
          name="title"
          value={searchQuery.title}
          placeholder="Title"
          onChange={handleChange}
          className="p-3 rounded-lg font-semibold outline-none"
        />
        <select name="category" id="category" 
          value={searchQuery.category}
          onChange={handleChange}
          className="p-3 rounded-lg font-semibold outline-none"
        >
          {/* Dynamic loading of categories */}
          <option value="">All categories</option>
          {categoryNames.map(categoryName => {
            return <option key={categoryNames.indexOf(categoryName)} value={categoryName}>{categoryName}</option>
          })}
        </select>
        <input
          type="number"
          id="maxPrice"
          name="maxPrice"
          value={searchQuery.maxPrice}
          placeholder="Max Price($)"
          onChange={handleChange}
          className="p-3 rounded-lg w-36 font-semibold outline-none"
        />
        <button className='px-10 py-3 text-white font-bold bg-red-600 rounded-md'>
          Search
        </button>
      </form>
    </div>
    {Object.values(searchQuery).filter(x => x.length > 0).length != 0 ? 
    <div>
      <div className='pl-8 py-4 pb-20'>
        <div
          className='w-full h-full flex p-6 flex-wrap gap-y-12'
        >
          {searchResults?.map((item, id) => (
            <Movie key={id} movieId={id} item={item}/>
          ))}
        </div>
        <Pagination
          postsPerPage={moviesPerPage} 
          totalPosts={searchResults.length} 
          paginate={setCurrentPage}
          currentPage={currentPage}
        />
      </div>
    </div>
    :
    null}
    </>
  )
}