export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      {/* Thai shrine container */}
      <div className="relative flex flex-col items-center">
        {/* Thai ornamental border */}
        <div className="absolute w-44 h-44 border-4 border-primary-400 rounded-full opacity-30 animate-ping" />

        {/* Lotus flower */}
        <div className="relative w-32 h-32">
          {/* Outer petals */}
          <div className="absolute inset-0 animate-pulse">
            <div className="w-full h-full bg-primary-300 rounded-full transform scale-75 rotate-45" />
            <div className="absolute inset-0 bg-primary-300 rounded-full transform scale-75 -rotate-45" />
            <div className="absolute inset-0 bg-primary-300 rounded-full transform scale-75 rotate-[135deg]" />
            <div className="absolute inset-0 bg-primary-300 rounded-full transform scale-75 -rotate-[135deg]" />
          </div>

          {/* Inner petals */}
          <div className="absolute inset-0 scale-75 animate-pulse animation-delay-500">
            <div className="w-full h-full bg-primary-100 rounded-full transform scale-75 rotate-[22.5deg]" />
            <div className="absolute inset-0 bg-primary-100 rounded-full transform scale-75 rotate-[67.5deg]" />
            <div className="absolute inset-0 bg-primary-100 rounded-full transform scale-75 rotate-[112.5deg]" />
            <div className="absolute inset-0 bg-primary-100 rounded-full transform scale-75 rotate-[157.5deg]" />
          </div>

          {/* Center */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-primary-400 rounded-full animate-pulse" />
        </div>

        <p className="mt-6 text-primary font-medium animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
