import React from 'react';

export default function StatsBar() {
  const stats = [
    {
      value: "10+",
      label: "apps developed",
      sub: "8 active / 6 roadmap"
    },
    {
      value: "3000+",
      label: "daily audits",
      sub: "100% in-browser"
    },
    {
      value: "17",
      label: "crypto primitives",
      sub: "W3C WebCrypto API"
    },
    {
      value: "99%",
      label: "telemetry eliminated",
      sub: "0B stored on server"
    }
  ];

  return (
    <div className="w-full border-y border-white/10 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {stats.map((stat, idx) => (
            <div key={idx} className="py-8 px-4 sm:px-6 flex flex-col justify-center items-center text-center">
              <span className="font-pixel text-4xl sm:text-5xl lg:text-6xl font-bold tracking-wider text-white">
                {stat.value}
              </span>
              <span className="text-xs font-sans text-zinc-400 mt-2 lowercase tracking-wide">
                {stat.label}
              </span>
              <span className="text-[10px] font-mono text-zinc-600 mt-0.5 uppercase tracking-wider">
                {stat.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
