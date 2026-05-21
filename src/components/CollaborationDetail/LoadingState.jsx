export function LoadingState() {
  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
      <div className="text-center">
        <div
          className="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mb-4"
          style={{ animation: "spin 1s linear infinite" }}
        ></div>
        <p className="text-[#667085]">Loading collaboration...</p>
      </div>
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
