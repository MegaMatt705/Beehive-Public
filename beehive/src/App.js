import './pages/Home.css';
import Login from "./pages/Login"
import { BrowserRouter as Router, Routes, Route,  } from 'react-router-dom';
import Home from './pages/Home'
import Message from './pages/Message'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import AboutUs from './pages/AboutUs'
import Jobs from './pages/Jobs'
import JobCreate from './pages/JobCreate'
import Register from './pages/Register'
import Post from './pages/PostCreate'
import EditProfile from './pages/EditProfile'
import Header from "./components/Header"
import Footer from "./components/Footer"
import Navbar from "./components/Navbar";
import testPage from "./pages/testPage";

function App() {
  return (
  <>
    <Router>
      <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/Home' element={<Home />} />
            <Route path='/Message' element={<Message />} />
            <Route path='/Profile' element={<Profile />} />
            <Route path='/Jobs' element={<Jobs />} />
            <Route path='/JobCreate' element={<JobCreate />} />
            <Route path='/Settings' element={<Settings />} />
            <Route path='/AboutUs' element={<AboutUs />} />
            <Route path='/Register' element={<Register />} />
            <Route path='/Post' element={<Post />} />
            <Route path='/EditProfile' element={<EditProfile />} />
        </Routes>
    </Router>

    <testPage/> 
  </>
  );


}

export default App;