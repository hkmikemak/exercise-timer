import { FC, useEffect, useState } from "react";
import { interval } from "rxjs";
import { filter } from "rxjs/operators";
import { beep } from "../helpers/beeper";
import { speak } from "../helpers/voiceSpeaker";

interface TimeComponentProps {
  exerciseDurationInSeconds: number;
  restDurationInSeconds: number;
  isPaused: boolean;
}

const TimeComponent: FC<TimeComponentProps> = ({ exerciseDurationInSeconds, restDurationInSeconds, isPaused }) => {
  const [totalSets, setTotalSets] = useState<number>(1);
  const [countdown, setCountdown] = useState<number>(exerciseDurationInSeconds);
  const [isInExerciseMode, setIsInExerciseMode] = useState<boolean>(true);
  const [displayText, setDisplayText] = useState<string>("");

  useEffect(() => {
    setCountdown(exerciseDurationInSeconds);
    setIsInExerciseMode(true);
    setTotalSets(1);
  }, [exerciseDurationInSeconds, restDurationInSeconds]);

  useEffect(() => {
    const observable = interval(1000);
    const subscription = observable.pipe(filter(() => !isPaused)).subscribe(() => {
      setCountdown(oldValue => oldValue - 1);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isPaused]);

  useEffect(() => {
    setDisplayText(new Date(countdown * 1000).toISOString().substr(11, 8));

    if (countdown <= 3 && countdown >= 1) {
      beep(500, 200);
    }

    if (countdown == 0) {
      if (isInExerciseMode) {
        setCountdown(restDurationInSeconds);
        setIsInExerciseMode(false);
        beep(1000, 400);
      } else {
        const nextSet = totalSets + 1;
        setCountdown(exerciseDurationInSeconds);
        setIsInExerciseMode(true);
        setTotalSets(nextSet);
        beep(1000, 400).then(() => {
          speak(`Set ${nextSet} - Started`);
        });
      }
    }
  }, [countdown]);

  return (
    <>
      <h1>Set {totalSets}</h1>
      <h1>{isInExerciseMode ? "Exercise 🏃" : "Rest 💤"}</h1>
      <div className="font-time">{displayText}</div>
    </>
  );
};

export { TimeComponent, TimeComponentProps };
