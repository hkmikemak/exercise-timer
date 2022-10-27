import { FC, useEffect, useState } from "react";
import { interval } from "rxjs";
import { filter } from "rxjs/operators";
import { shortBeep, longBeep } from "../helpers/beeper";
import { speak } from "../helpers/voiceSpeaker";

interface TimeComponentProps {
  exerciseDurationInSeconds: number;
  restDurationInSeconds: number;
  isPaused: boolean;
}

enum MODE {
  IDLE,
  COUNTDOWN,
  EXERCISE,
  REST,
}

const TimeComponent: FC<TimeComponentProps> = ({ exerciseDurationInSeconds, restDurationInSeconds, isPaused }) => {

  const COUNTDOWN_DURATION_IN_SECONDS = 5;

  const [totalSets, setTotalSets] = useState<number>(1);
  const [countdown, setCountdown] = useState<number>(COUNTDOWN_DURATION_IN_SECONDS);
  const [mode, setMode] = useState<MODE>(MODE.IDLE);
  const [displayText, setDisplayText] = useState<string>("");

  useEffect(
    () => {
      setCountdown(COUNTDOWN_DURATION_IN_SECONDS);
      setMode(MODE.IDLE);
      setTotalSets(1);
    },
    [
      exerciseDurationInSeconds,
      restDurationInSeconds
    ],
  );

  useEffect(
    () => {
      const observable = interval(1000);
      const subscription = observable.pipe(filter(() => !isPaused)).subscribe(() => {
        setCountdown(oldValue => oldValue - 1);
      });

      if(mode === MODE.IDLE) {
        setMode(MODE.COUNTDOWN);
      }

      return () => {
        subscription.unsubscribe();
      };
    },
    [
      isPaused,
    ],
  );

  useEffect(
    () => {
      setDisplayText(new Date(countdown * 1000).toISOString().substring(11, 19));

      if (mode !== MODE.IDLE && countdown <= 3 && countdown >= 1) {
        shortBeep();
      }

      if (countdown == 0) {
        if (mode === MODE.COUNTDOWN) {
          // Countdown is finished, now move to exercise mode
          setMode(MODE.EXERCISE);
          setCountdown(exerciseDurationInSeconds);
          longBeep().then(() => {
            speak(`Set 1 - Started`);
          });
        } else if (mode === MODE.EXERCISE) {
          // Exercise is finished, now move to rest mode
          setMode(MODE.REST);
          setCountdown(restDurationInSeconds);
          longBeep().then(() => {
            speak("Rest");
          });
        } else {
          // Rest is finished, now move to exercise mode
          setMode(MODE.EXERCISE);
          setCountdown(exerciseDurationInSeconds);

          const nextSet = totalSets + 1;
          setTotalSets(nextSet);
          longBeep().then(() => {
            speak(`Set ${nextSet} - Started`);
          });
        }
      }
    },
    [
      countdown,
    ],
  );

  return (
    <>
      <h1>{mode !== MODE.IDLE ? `Set ${totalSets}` : ""}</h1>
      <h1>{mode === MODE.EXERCISE ? "Exercise 🏃" : mode === MODE.REST ? "Rest 💤" : "Get Ready"}</h1>
      <div className="font-time">{mode === MODE.COUNTDOWN ? countdown : mode !== MODE.IDLE ? displayText : ""}</div>
    </>
  );
};

export { TimeComponent, TimeComponentProps };
