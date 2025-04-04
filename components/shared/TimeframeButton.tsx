import React from "react";

interface TimeframeButtonProps {
  timeframe: string;
  isSelected: boolean;
  onClick: () => void;
}

const TimeframeButton: React.FC<TimeframeButtonProps> = ({
  timeframe,
  isSelected,
  onClick,
}) => {
  return (
    <button
      key={timeframe}
      onClick={onClick}
      className={`px-3 py-1 rounded ${
        isSelected
          ? "bg-yellow-500 text-black"
          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
      }`}
    >
      {timeframe}
    </button>
  );
};

export default TimeframeButton;
