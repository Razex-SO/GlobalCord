import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Stats from './components/Stats';
import Commands from './components/Commands';
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1f] via-[#1a1a3f] to-[#0a0a1f] text-white overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://cdn.pixabay.com/photo/2016/11/23/13/48/atmosphere-1852428_1280.jpg')] opacity-10 bg-cover bg-center pointer-events-none" />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <Stats />
        <Commands />
        <ChatWidget />
      </div>
    </div>
  );
}

export default App;