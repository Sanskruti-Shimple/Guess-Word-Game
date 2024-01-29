$(document).ready(function () {
    let secretWord = "";
    let maxTries = "";
    let chancesLeft = maxTries;
    let guessedWords = [];

    const $wordContainer = $("#word-container");
    const $guessForm = $("#guess-form");
    const $chancesSpan = $("#chances");
    const $lengthSpan = $("#length");
    const $feedbackDiv = $("#feedback");
    const $historyList = $("#history-list");
    const $submitButton = $("#submitButton");
    const $guessInput = $("#guess-input");

    // New: Adding audio elements for different sounds
    const $winAudio = $('<audio src="bell.mp3" preload="auto"></audio>');
    const $loseAudio = $('<audio src="loss.mp3" preload="auto"></audio>');

    $guessForm.on('submit', function (event) {
        event.preventDefault();
        const guess = $guessInput.val().toUpperCase();
        if (guess.length === secretWord.length) {
            const feedback = checkWordle(guess);
            guessedWords.push(guess);
            renderHistory();
            chancesLeft--;
            $chancesSpan.text(chancesLeft);

            if (feedback.every((val) => val === "C") || chancesLeft === 0) {
                showResult(feedback);
            }
        } else {
            alert(`Please enter a ${secretWord.length}-letter word.`);
        }
        $guessInput.val("");
    });

    function checkWordle(guess) {
        const originalWord = secretWord;

        let secretLetters = {};
        let guessLetters = {};
        let feedback = guess.split("").map((letter, index) => {
            const correctLetter = originalWord[index];
            if (letter === correctLetter) {
                return "C";
            } else {
                secretLetters[correctLetter] = (secretLetters[correctLetter] || 0) + 1;
                guessLetters[letter] = (guessLetters[letter] || 0) + 1;
            }
        });

        feedback.forEach((result, index) => {
            const letter = guess[index];
            if (result !== "C" && secretLetters[letter] > 0 && guessLetters[letter] > 0) {
                feedback[index] = "E";
                secretLetters[letter]--;
            } else if (result !== "C") {
                feedback[index] = "W";
            }
        });
        return feedback;
    }

    $("#start-button").on("click", function () {
        $(this).prop("disabled", true);
        $submitButton.prop("disabled", false);
        fetchRandomWord();
    });

    function fetchRandomWord() {
        const APIFetchedWord = "HELLO";
        secretWord = APIFetchedWord.toUpperCase();

        maxTries = secretWord.length + 1;
        chancesLeft = maxTries;
        $chancesSpan.text(chancesLeft);
        $lengthSpan.text(secretWord.length);
        $guessInput.attr("maxlength", secretWord.length);
        renderWordContainers();
    }

    function renderWordContainers() {
        $wordContainer.empty();
        for (let i = 0; i < secretWord.length; i++) {
            $wordContainer.append(`<span class="letter" id="letter-${i}">?</span>`);
        }
    }

    function renderHistory() {
        $historyList.empty();
        guessedWords.forEach((word, index) => {
            const feedback = checkWordle(word);
            let wordHtml = "";
            word.split("").forEach((letter, index) => {
                let letterClass = "";
                switch (feedback[index]) {
                    case "C":
                        letterClass = "correct";
                        break;
                    case "E":
                        letterClass = "exists";
                        break;
                    case "W":
                        letterClass = "wrong";
                        break;
                    default:
                        break;
                }
                wordHtml += `<span class="letter ${letterClass}">${letter}</span>`;
            });
            const wordClass = feedback.every((val) => val === "C")
                ? "correct-word"
                : "incorrect-word";
            $historyList.append(`<li class="${wordClass}">${wordHtml}</li>`);
        });
    }

    function showResult(feedback) {
        if (feedback.every((val) => val === "C")) {
            const $resultDiv = $(
                '<div class="result-message">Congratulations! You guessed the word correctly.</div>'
            );
            $resultDiv.hide().appendTo(".container").fadeIn(1000);

            // New: Play the win sound
            $winAudio[0].play();
        } else {
            const $resultDiv = $(
                '<div class="result-message">Sorry, you ran out of chances. The correct word was ' +
                secretWord +
                ".</div>"
            );
            $resultDiv.hide().appendTo(".container").fadeIn(1000);

            // New: Play the lose sound
            $loseAudio[0].play();
        }

        $guessInput.prop("disabled", true);
        $submitButton.prop("disabled", true);
        $guessForm.off("submit");

        $chancesSpan.text("0");
        $feedbackDiv.empty();
    }

    function reloadPage() {
        location.reload();
    }

    $("#reload-button").on("click", reloadPage);
});
