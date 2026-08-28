import { useState, useEffect, useRef } from 'react';

export default function Timer({ duration, initialSeconds, onExpire, onTick, stopped = false }) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds ?? duration * 60);
  const onExpireRef = useRef(onExpire);
  const onTickRef = useRef(onTick);
  onExpireRef.current = onExpire;
  onTickRef.current = onTick;

  useEffect(() => { setSecondsLeft(initialSeconds ?? duration * 60); }, [duration]);

  useEffect(() => {
    if (stopped) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) { clearInterval(interval); onTickRef.current?.(0); onExpireRef.current(); return 0; }
        const next = prev - 1;
        onTickRef.current?.(next);
        return next;
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
