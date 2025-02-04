import React, { useEffect, useState } from "react";

const PlayerCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Fetch the player count from your backend
    setCount(120); // Replace with actual API call
  }, []);

  return (
    <div className="text-center mb-4">
      <p className="text-lg font-medium">
        Players who have booked so far: {count}
      </p>
    </div>
  );
};

export default PlayerCount;
