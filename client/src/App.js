import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Account from './pages/Account';
import ProtectedRoute from './components/ProtectedRoute';
import Admin from './pages/Admin';
import React from 'react';
import MovieDetails from './components/MovieDetails';

function App() {
  const [search, setSearch] = React.useState(false);
  const [searchContent, setSearchContent] = React.useState({
    title: "",
    category: "",
    maxPrice: "",
  });

  return (
    <>
      <Navbar setSearchContent={setSearchContent} searchContent={searchContent} 
        search={search} setSearch={setSearch}/>
      <Routes>
        <Route path='/' element={<Home searchContent={searchContent} search={search}/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/movieDetails/:filmId' element={<MovieDetails />} />
        <Route
          path='/account'
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
