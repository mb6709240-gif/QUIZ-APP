import { useState, useEffect, useRef } from 'react';

export default function Timer({ duration, initialSeconds = null, onExpire, stopped = false }) {
  const startSeconds = initialSeconds !== null ? initialSeconds : (duration || 0) * 60;
  const [secondsLeft, setSecondsLeft] = useState(startSeconds);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (initialSeconds !== null) setSecondsLeft(initialSeconds);
    else setSecondsLeft((duration || 0) * 60);
  }, [duration, initialSeconds]);

  useEffect(() => {
    if (stopped) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          try { onExpireRef.current && onExpireRef.current(); } catch (e) { /* ignore */ }
          return 0;
        }
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
