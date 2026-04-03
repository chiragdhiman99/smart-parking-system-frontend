import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-center px-4">

      <h1 className="text-8xl font-black text-yellow-400 tracking-tight">404</h1>

      <div className="mt-6 w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
        <svg className="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
      </div>

      <h2 className="mt-5 text-xl font-semibold text-white">Page Not Found</h2>
      <p className="mt-2 text-sm text-gray-400 max-w-xs leading-relaxed">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div className="mt-8 w-12 h-px bg-gray-700" />

      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-sm font-semibold rounded-lg transition-colors"
        >
          Go Home
        </button>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg transition-colors"
        >
          Go Back
        </button>
      </div>

    </div>
  );
}