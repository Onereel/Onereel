export function LoadingState() {
  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1DA1F2] mx-auto"></div>
        <p className="mt-4 text-[#667085]">Loading...</p>
      </div>
    </div>
  );
}
