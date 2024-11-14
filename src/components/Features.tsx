import React from 'react';
import { Server, Users, Zap, Command } from 'lucide-react';

const features = [
  {
    icon: <Server className="w-6 h-6" />,
    title: 'Server Discovery',
    description: 'Find and join amazing Discord communities through our server farm system.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Community Growth',
    description: 'Promote your server and reach new members organically.',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Earn Rewards',
    description: 'Get GlobalCoins for being active and use them for premium features.',
  },
  {
    icon: <Command className="w-6 h-6" />,
    title: 'Powerful Commands',
    description: 'Intuitive commands for server management and community engagement.',
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-purple-900/10 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
            Supercharge Your Server
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to grow and manage your Discord community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative p-6 bg-gray-900/40 backdrop-blur-lg rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {React.cloneElement(feature.icon, {
                    className: 'w-6 h-6 text-white',
                  })}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}