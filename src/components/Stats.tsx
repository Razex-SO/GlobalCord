import React from 'react';
import { Users, Server, Zap } from 'lucide-react';

const stats = [
  {
    icon: <Users className="w-8 h-8" />,
    value: "50,000+",
    label: "Active Users",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: <Server className="w-8 h-8" />,
    value: "10,000+",
    label: "Servers",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: <Zap className="w-8 h-8" />,
    value: "1M+",
    label: "Commands Used",
    color: "from-pink-500 to-pink-600"
  }
];

export default function Stats() {
  return (
    <section id="stats" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative p-8 bg-gray-900/40 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${stat.color} p-4 mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                  {React.cloneElement(stat.icon, {
                    className: 'w-full h-full text-white'
                  })}
                </div>
                <h3 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {stat.value}
                </h3>
                <p className="text-gray-400 text-lg">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}