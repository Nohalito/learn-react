import { useState, useRef } from "react";

// Format number to 00 shape (ex: 1 => O1)
function pad(value: number, length = 2) {
  return value.toString().padStart(length, "0");
}

// Parse millisecond in minutes, seconds, hundredths
function formatElapsed(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const hundredths = Math.floor((ms % 1000) / 10);
  return `${pad(minutes)}:${pad(seconds)}:${pad(hundredths)}`;
}


function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);

  const start = () => {
    if (isRunning) return;
    startTimeRef.current = Date.now() - elapsed;
    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current);
    }, 10);
    setIsRunning(true);
  };

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setElapsed(0);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Claude Stopwatch</h1>
      <div style={{ fontSize: "100px" }}>{formatElapsed(elapsed)}</div>
      <p>{isRunning ? "Running" : "Not running"}</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

export default Stopwatch
