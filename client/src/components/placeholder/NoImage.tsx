export default function NoImage({ isCircle = false, showMessage = true }) {
  const shape = isCircle ? "rounded-full" : "rounded-xl";
  return (
    <div
      className={`relative w-full h-full ${shape} border-4 border-dashed border-neutral-800 text-neutral-800 select-none`}
    >
      <div className="flex flex-col items-center absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <p className="text-4xl mb-3">ᓀ‸ᓂ</p>
        {showMessage && <p>Image not found</p>}
      </div>
    </div>
  );
}