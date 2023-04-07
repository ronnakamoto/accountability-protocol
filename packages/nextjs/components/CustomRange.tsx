const CustomRange = ({ currentValue, maxValue }: any) => {
  const percentage = (currentValue / maxValue) * 100;

  return (
    <div className="space-y-2 my-2 min-w-fit">
      <input type="range" min="0" max={maxValue} value={currentValue} className="range range-sm" readOnly />
      <div className="relative w-full flex justify-between text-xs px-2 my-1">
        <span style={{ left: `calc(${percentage}%)` }} className="absolute">
          |
        </span>
      </div>
      <div className="relative w-full flex justify-between text-xs p-2">
        <span style={{ left: `calc(${percentage}% - 0.5em)` }} className="absolute">
          {`${currentValue}(${Math.floor(percentage)}%)`}
        </span>
      </div>
    </div>
  );
};

export default CustomRange;
