import { useState, useEffect, useRef } from 'react';

export default function Timer({ duration, onExpire, stopped = false }) {
  const [secondsLeft, setSecondsLeft] = useState(duration * 60);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => { setSecondsLeft(duration * 60); }, [duration]);

  useEffect(() => {
    if (stopped) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) { clearInterval(interval); onExpireRef.current(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [stopped]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isWarning = secondsLeft <= 60;
  const isCritical = secondsLeft <= 30;

  return (
    <div className={`timer ${isWarning ? 'timer-warning' : ''} ${isCritical ? 'timer-critical' : ''}`}>
      <span className="timer-label">TIME REMAINING</span>
      <span className="timer-value">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
    </div>
  );
}
