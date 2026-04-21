export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#f7931a]/20 border-t-[#f7931a] rounded-full animate-spin" />
        <p className="text-sm text-white/40">Loading...</p>
      </div>
    </div>
  );
}
