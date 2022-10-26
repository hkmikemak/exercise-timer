const speak: (str: string) => Promise<void> = str =>
  new Promise((resolve, reject) => {
    const speechSynthesisUtterance = new SpeechSynthesisUtterance(str);
    speechSynthesisUtterance.volume = 1;
    speechSynthesisUtterance.lang = "en-UK";
    speechSynthesisUtterance.addEventListener("end", () => {
      resolve();
    });
    speechSynthesisUtterance.addEventListener("error", () => {
      reject();
    });
    window.speechSynthesis.speak(speechSynthesisUtterance);
  });

export { speak };
