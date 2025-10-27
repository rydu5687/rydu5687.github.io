// Christmas Trivia API
const triviaBtn = document.querySelector("#js-new-quote");
const answerBtn = document.querySelector("#js-tweet");

let current = {
  question: "",
  answer: "",
};

const triviaEndpoint = "https://trivia.cyberwisp.com/getrandomchristmasquestion";

async function newTrivia() {
  try {
    const response = await fetch(triviaEndpoint);
    if (!response.ok) throw Error(response.statusText);
    const json = await response.json();

    displayTrivia(json["question"]);
    current.question = json["question"];
    current.answer = json["answer"];
  } catch (err) {
    alert("Failed to get new trivia");
  }
}

function displayTrivia(question) {
  const questionText = document.querySelector("#js-quote-text");
  const answerText = document.querySelector("#js-answer-text");
  questionText.textContent = question;
  answerText.textContent = "";
}

function newAnswer() {
  const answerText = document.querySelector("#js-answer-text");
  answerText.textContent = current.answer;
}

triviaBtn.addEventListener("click", newTrivia);
answerBtn.addEventListener("click", newAnswer);
newTrivia();


// Zenquotes API
const quoteBtn = document.querySelector("#js-new-random-quote");
const quoteText = document.querySelector("#js-random-quote");
const quoteAuthor = document.querySelector("#js-random-author");

const quoteEndpoint = "https://zenquotes.io/api/random";

async function newQuote() {
  try {
    const response = await fetch(quoteEndpoint);
    if (!response.ok) throw new Error(response.statusText);
    const data = await response.json();

    const quote = data[0];
    quoteText.textContent = `"${quote.q}"`;
    quoteAuthor.textContent = `— ${quote.a}`;
  } catch (error) {
    console.error("Quote load error:", error);
    quoteText.textContent = "Couldn't load a new quote.";
    quoteAuthor.textContent = "";
  }
}

quoteBtn.addEventListener("click", newQuote);
newQuote();


// Tabs
const tabTrivia = document.getElementById("tab-trivia");
const tabQuotes = document.getElementById("tab-quotes");
const triviaSection = document.getElementById("trivia-section");
const quotesSection = document.getElementById("quotes-section");

tabTrivia.addEventListener("click", () => {
  tabTrivia.classList.add("active");
  tabQuotes.classList.remove("active");
  triviaSection.classList.add("active");
  quotesSection.classList.remove("active");
});

tabQuotes.addEventListener("click", () => {
  tabQuotes.classList.add("active");
  tabTrivia.classList.remove("active");
  quotesSection.classList.add("active");
  triviaSection.classList.remove("active");
});


// Buttons
document.getElementById("like-btn").addEventListener("click", () => {
  alert("You liked this quote! (no data recorded)");
});

document.getElementById("dislike-btn").addEventListener("click", () => {
  alert("You disliked this quote! (no data recorded)");
});
