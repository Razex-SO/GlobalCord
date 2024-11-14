import React from 'react';
import { Command } from 'lucide-react';

const commands = [
  {
    name: '/farm',
    description: 'Browse awesome servers & earn GlobalCoins for joining!',
    category: 'Server Discovery',
  },
  {
    name: '/share',
    description: 'Promote your server and reach new members!',
    category: 'Promotion',
  },
  {
    name: '/ad',
    description: 'Advertise your server using GlobalCoins!',
    category: 'Premium',
  },
  {
    name: '/photomaker',
    description: 'Turn your character into amazing AI art!',
    category: 'Premium',
  },
  {
    name: '/info',
    description: 'Get detailed information about GlobalCord features.',
    category: 'General',
  },
  {
    name: '/controlpanel',
    description: 'Manage your server settings and configurations.',
    category: 'Management',
  },
];

export default function Commands() {
  return (
    <section id="commands" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Powerful Commands</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore what GlobalCord can do for your server
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {commands.map((cmd, index) => (
            <div
              key={index}
              className="p-6 bg-gray-900/50 backdrop-blur-lg rounded-xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300 group"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Command className="w-6 h-6 text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{cmd.name}</h3>
                  <p className="text-gray-400 mb-3">{cmd.description}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400">
                    {cmd.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}