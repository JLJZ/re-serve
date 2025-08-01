import React, { useEffect, useState } from 'react';
import { ClockIcon } from 'lucide-react';
const CountdownTimer = ({
  startTime,
  duration = 15,
  onExpire
}) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // in seconds
  const [isExpired, setIsExpired] = useState(false);
  useEffect(() => {
    if (isExpired) return;
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsExpired(true);
          onExpire && onExpire();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isExpired, onExpire]);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const getColorClass = () => {
    if (timeLeft > 5 * 60) return 'text-green-600';
    if (timeLeft > 2 * 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  return <div className={`flex items-center ${getColorClass()}`}>
      <ClockIcon className="w-5 h-5 mr-2" />
      <div className="text-lg font-semibold">
        {isExpired ? 'Time Expired' : <>
            {minutes.toString().padStart(2, '0')}:
            {seconds.toString().padStart(2, '0')}
          </>}
      </div>
    </div>;
};
export default CountdownTimer;