import React, { useEffect, useRef } from 'react';
import { Bot, Rocket, Star } from 'lucide-react';

export default function Hero() {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createParticle = () => {
      if (!particlesRef.current) return;
      
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random position
      particle.style.left = Math.random() * 100 + 'vw';
      particle.style.top = Math.random() * 100 + 'vh';
      
      // Random animation
      const duration = 3 + Math.random() * 4;
      particle.style.animation = `space-float ${duration}s linear infinite`;
      
      particlesRef.current.appendChild(particle);
      
      // Remove particle after animation
      setTimeout(() => particle.remove(), duration * 1000);
    };

    // Create initial particles
    for (let i = 0; i < 50; i++) {
      createParticle();
    }

    // Create new particles periodically
    const interval = setInterval(createParticle, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-[#0a0a1f] to-black" />
        <div ref={particlesRef} className="absolute inset-0" />
      </div>

      {/* Floating elements */}
      <Star className="absolute top-1/4 left-1/4 text-yellow-400 w-8 h-8 space-float opacity-50" />
      <Star className="absolute bottom-1/4 right-1/4 text-purple-400 w-6 h-6 space-float opacity-50" />
      <Star className="absolute top-1/3 right-1/3 text-blue-400 w-4 h-4 space-float opacity-50" />

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="relative inline-block group">
            <Bot className="w-24 h-24 text-blue-400 animate-float mx-auto" />
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl -z-10 transform scale-150 animate-pulse-glow" />
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              GlobalCord
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-gray-300">
            Connect and grow your Discord communities with powerful tools, server discovery, and rewards
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://discord.com/oauth2/authorize?client_id=1282323140009132133"
              className="group px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] flex items-center gap-2 relative overflow-hidden"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Rocket className="w-5 h-5 relative z-10 group-hover:animate-bounce" />
              <span className="relative z-10">Add to Discord</span>
            </a>
            
            <a
              href="https://discord.gg/rNd7XMVVYW"
              className="group px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] flex items-center gap-2 relative overflow-hidden"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">Join Support Server</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}