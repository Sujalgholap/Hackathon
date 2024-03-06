// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { VideoPlayer } from "./components/VideoPlayer";
import { VideoRoom } from "./components/VideoRoom";

const Home = () => <div>Home</div>;
const About = () => <div>About</div>;
const Contact = () => <div>Contact</div>;

// App component
const App = () => {
  return (
    <Router>
      <div className="">
        <Navbar />
        {/* Define your routes using Routes and Route */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/video-room" element={<VideoRoom />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
