import { useState, useEffect } from 'react';

const SECOND = 1_000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

export const useTimer = (time: any, interval = SECOND) => {
  const [timespan, setTimespan] = useState(
    new Date(time).valueOf() - Date.now().valueOf()
  );

  // let intervalId: NodeJS.Timer;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimespan(new Date(time).valueOf() - Date.now().valueOf());
    }, interval);

    return () => {
      clearInterval(intervalId);
    };
  }, [time, interval]);
  return {
    hours: Math.floor((timespan / HOUR) % 24),
    minutes: Math.floor((timespan / MINUTE) % 60),
    seconds: Math.floor((timespan / SECOND) % 60),
  };
};
