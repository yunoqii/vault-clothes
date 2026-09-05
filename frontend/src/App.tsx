import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Feed from './pages/Feed'
import Profile from './pages/Profile'
import Listings from './pages/Listings'
import ListingDetail from './pages/ListingDetail'
import CreateListing from './pages/CreateListing'
import Chat from './pages/Chat'

function App() {
    return (
        <>
        <Nav />
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/listings/new" element={<CreateListing />} />
            <Route path="/listings/:listingId" element={<ListingDetail />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:conversationId" element={<Chat />} />
        </Routes>
        </>
    );
}

export default App
