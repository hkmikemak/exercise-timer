import { FC, useEffect, useState } from "react";
import { TimeComponent } from "./TimerComponent";

const AppComponent: FC<{}> = ({}) => {
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [exerciseDurationInSeconds, setExerciseDurationInSeconds] = useState<number>(30);
  const [restDurationInSeconds, setRestDurationInSeconds] = useState<number>(10);

  const onExerciseDurationChanged = (value: string) => {
    const valueNumber: number = Number(value);

    if (!isNaN(valueNumber) && valueNumber > 10) {
      setIsPaused(true);
      setExerciseDurationInSeconds(valueNumber);
    }
  };

  const onRestDurationChanged = (value: string) => {
    const valueNumber: number = Number(value);

    if (!isNaN(valueNumber) && valueNumber > 10) {
      setIsPaused(true);
      setRestDurationInSeconds(valueNumber);
    }
  };

  return (
    <>
      <main className="flex-grow-1 d-flex flex-column align-items-center justify-content-center">
        <TimeComponent
          exerciseDurationInSeconds={exerciseDurationInSeconds}
          isPaused={isPaused}
          restDurationInSeconds={restDurationInSeconds}
        />
      </main>
      <footer>
        <div className="d-flex flex-column flex-md-row">
          <div className="flex-grow-1 input-group input-group-sm mb-3 me-md-1">
            <span className="input-group-text">Exercise Duration</span>
            <input
              className="form-control"
              type="number"
              step="1"
              min="10"
              value={exerciseDurationInSeconds}
              onChange={(e) => onExerciseDurationChanged(e.target.value)}
            />
            <span className="input-group-text">seconds</span>
          </div>
          <div className="flex-grow-1 input-group input-group-sm mb-3 ms-md-1">
            <span className="input-group-text">Rest Duration</span>
            <input
              className="form-control"
              type="number"
              step="1"
              min="10"
              value={restDurationInSeconds}
              onChange={(e) => onRestDurationChanged(e.target.value)}
            />
            <span className="input-group-text">seconds</span>
          </div>
        </div>
        <button
          className={["btn", "w-100", isPaused ? "btn-primary" : "btn-danger"].join(" ")}
          type="button"
          onClick={() => {
            setIsPaused((oldValue) => !oldValue);
          }}
        >
          {isPaused ? "Start / Resume" : "Pause"}
        </button>
      </footer>
    </>
  );
};

export { AppComponent };
