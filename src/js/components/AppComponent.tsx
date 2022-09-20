import { FC, useState } from "react";
import { TimeComponent } from "./TimerComponent";

const AppComponent: FC = () => {
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [exerciseDurationInSeconds, setExerciseDurationInSeconds] = useState<number>(60);
  const [restDurationInSeconds, setRestDurationInSeconds] = useState<number>(15);

  const onExerciseDurationChanged = (value: string | number) => {
    const valueNumber = Number(value);

    if (!isNaN(valueNumber) && valueNumber >= 10) {
      setIsPaused(true);
      setExerciseDurationInSeconds(valueNumber);
    }
  };

  const onRestDurationChanged = (value: string | number) => {
    const valueNumber = Number(value);

    if (!isNaN(valueNumber) && valueNumber >= 10) {
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
            <span className="input-group-text">Exercise Duration 🏃 (s)</span>
            <input
              className="form-control"
              type="number"
              step="1"
              min="10"
              value={exerciseDurationInSeconds}
              onChange={e => {
                onExerciseDurationChanged(e.target.value);
              }}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-primary"
                type="button"
                onClick={() => {
                  onExerciseDurationChanged(exerciseDurationInSeconds + 1);
                }}>
                🔼
              </button>
              <button
                className="btn btn-outline-primary"
                type="button"
                onClick={() => {
                  onExerciseDurationChanged(exerciseDurationInSeconds - 1);
                }}>
                🔽
              </button>
            </div>
          </div>
          <div className="flex-grow-1 input-group input-group-sm mb-3 ms-md-1">
            <span className="input-group-text">Rest Duration 💤 (s)</span>
            <input
              className="form-control"
              type="number"
              step="1"
              min="10"
              value={restDurationInSeconds}
              onChange={e => {
                onRestDurationChanged(e.target.value);
              }}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-primary"
                type="button"
                onClick={() => {
                  onRestDurationChanged(restDurationInSeconds + 1);
                }}>
                🔼
              </button>
              <button
                className="btn btn-outline-primary"
                type="button"
                onClick={() => {
                  onRestDurationChanged(restDurationInSeconds - 1);
                }}>
                🔽
              </button>
            </div>
          </div>
        </div>
        <button
          className={["btn", "w-100", "mb-3", isPaused ? "btn-primary" : "btn-danger"].join(" ")}
          type="button"
          onClick={() => {
            setIsPaused(oldValue => !oldValue);
          }}>
          {isPaused ? "Start / Resume" : "Pause"}
        </button>
      </footer>
    </>
  );
};

export { AppComponent };
