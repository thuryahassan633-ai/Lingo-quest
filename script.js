const starCount = document.querySelector("#starCount");
const foxyButton = document.querySelector("#foxyButton");
const playButton = document.querySelector("#playButton");
const activities = document.querySelector("#activities");
const gamePanel = document.querySelector("#gamePanel");
const gameTitle = document.querySelector("#gameTitle");
const gameInstruction = document.querySelector("#gameInstruction");
const gameContent = document.querySelector("#gameContent");
const gameFeedback = document.querySelector("#gameFeedback");
const closeGame = document.querySelector("#closeGame");

let stars = Number(localStorage.getItem("lingoQuestStars") || 0);
let answeredThisRound = false;
starCount.textContent = stars;

function addStar() {
  stars += 1;
  localStorage.setItem("lingoQuestStars", String(stars));
  starCount.textContent = stars;
}

function sayEnglish(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.78;
  utterance.pitch = 1.12;
  window.speechSynthesis.speak(utterance);
}

if (foxyButton) {
  foxyButton.addEventListener("click", () => {
    foxyButton.classList.remove("is-excited");
    // Restart the little hello animation each time.
    void foxyButton.offsetWidth;
    foxyButton.classList.add("is-excited");
    sayEnglish("Hello, explorer! Let's learn English!");
  });
}

playButton.addEventListener("click", () => {
  activities.scrollIntoView({ behavior: "smooth", block: "start" });
  sayEnglish("Choose your adventure!");
});

const gameData = {
  letters: {
    title: "Letter Galaxy",
    instruction: "Tap the letter A.",
    prompt: "A",
    options: ["B", "A", "C"],
    success: "Amazing! A is for apple!",
    speech: "A. A is for apple."
  },
  words: {
    title: "Word Jungle",
    instruction: "Which one is an apple?",
    prompt: "🍎",
    options: ["🍌", "🍎", "🍇"],
    success: "You found the apple! Great job!",
    speech: "Apple."
  },
  builder: {
    title: "Word Builder",
    instruction: "Find the first letter in CAT.",
    prompt: "C A T",
    options: ["T", "C", "A"],
    success: "You did it! C-A-T spells cat!",
    speech: "Cat. C A T."
  }
};

function openGame(type) {
  const game = gameData[type];
  if (!game) return;
  answeredThisRound = false;
  gameTitle.textContent = game.title;
  gameInstruction.textContent = game.instruction;
  gameFeedback.textContent = "";
  gameContent.replaceChildren();

  if (game.prompt) {
    const prompt = document.createElement("div");
    prompt.className = "answer-button";
    prompt.style.cursor = "default";
    prompt.style.background = "#fff8d9";
    prompt.textContent = game.prompt;
    gameContent.append(prompt);
  }

  game.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "answer-button";
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", () => {
      if (answeredThisRound) return;
      const correct = option === (type === "letters" ? "A" : type === "words" ? "🍎" : "C");
      if (correct) {
        answeredThisRound = true;
        button.classList.add("correct");
        gameFeedback.textContent = game.success;
        addStar();
        sayEnglish(game.speech);
      } else {
        button.classList.add("wrong");
        gameFeedback.textContent = "Almost! Try one more time.";
      }
    });
    gameContent.append(button);
  });

  gamePanel.hidden = false;
  gamePanel.scrollIntoView({ behavior: "smooth", block: "center" });
}

document.querySelectorAll("[data-activity]").forEach((button) => {
  button.addEventListener("click", () => openGame(button.dataset.activity));
});

closeGame.addEventListener("click", () => {
  gamePanel.hidden = true;
});

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}
