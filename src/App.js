import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/User/Home'
import Login from './pages/User/Login';
import Register from './pages/User/Register';
import Profile from './pages/User/Profile';
import NotFound from './pages/User/NotFound';
import AnimeGenres from './pages/User/AnimeGenres'
import AnimeVideo from './pages/User/AnimeVideo';
import Search from './pages/User/Search';
import Admin from './pages/Admin/Admin';
import Edit from './pages/Admin/Edit';
import TopAinme from './pages/User/TopAnime';
import Wishlist from './pages/User/Wishlist';
import Favorite from './pages/User/Favorite';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="profile" element={<Profile />} />
        <Route path='top-anime' element={<TopAinme />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path='favorite' element={<Favorite />} />
        <Route path="search/:searchQuery" element={<Search />} />
        <Route path="anime-genres/:genreId" element={<AnimeGenres />} />
        <Route path="anime/:AnimeId" element={<AnimeVideo />} />
        <Route path="anime/:AnimeId/:episodes" element={<AnimeVideo />} />
        <Route path="admin" element={<Admin />} />
        <Route path="admin/Edit/:AnimeId" element={<Edit />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
