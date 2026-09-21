import MyTimer from "./components/Timer";
import MyStopwatch from "./components/Stopwatch";
import MyTime from "./components/Time";
import Countdown from "./components/Coutdown";
import ClaudeStopwatch from "./components/ClaudeStopwatch";

import { useState, type ChangeEvent } from "react";

function App() {
  const time = new Date();
  time.setSeconds(time.getSeconds() + 600); // 10 minutes timer

  const [state, setState] = useState("Timer")

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setState(e.target.value)
  }

  return (
    <div>
      <select value={state} onChange={handleChange}>
        <option value="Timer">
          Timer
        </option>
        <option value="Stopwatch">
          Stopwatch
        </option>
        <option value="Time">
          Time
        </option>
        <option value="Coutdown">
          Countdown
        </option>
        <option value="ClaudeStopwatch">
          Claude Stopwatch
        </option>
      </select>
      {state === "Timer" && <MyTimer expiryTimestamp={time} />}
      {state === "Stopwatch" && <MyStopwatch />}
      {state === "Time" && <MyTime />}
      {state === "Coutdown" && <Countdown />}
      {state === "ClaudeStopwatch" && <ClaudeStopwatch />}
    </div>
  );
}

export default App