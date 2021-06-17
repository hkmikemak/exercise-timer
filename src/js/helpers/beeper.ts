const beep: (frequency: number, duration: number) => Promise<void> = (frequency, duration) =>
  new Promise(resolve => {
    const beeper = new AudioContext();
    const oscillator = beeper.createOscillator();
    const gain = beeper.createGain();

    oscillator.connect(gain);
    gain.connect(beeper.destination);
    gain.gain.value = 0.2;
    oscillator.frequency.value = frequency;
    oscillator.type = "square";
    oscillator.start(beeper.currentTime + 0);
    oscillator.stop(beeper.currentTime + duration / 1000);

    oscillator.addEventListener("ended", () => {
      beeper.close().then(() => {
        console.log("Closed");
        resolve();
      });
    });
  });

export { beep };
