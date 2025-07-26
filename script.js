const questions = [
    {
        question: "Если человека назвали мордофиля, то это…",
        answers: [
            { text: "Значит, что он тщеславный.", correct: true, explanation: "Ну зачем же вы так... В Этимологическом словаре русского языка Макса Фасмера поясняется, что мордофилей называют чванливого человека. Ну а «чванливый» — это высокомерный, тщеславный." },
            { text: "Значит, что у него лицо как у хряка.", correct: false },
            { text: "Значит, что чумазый.", correct: false }
        ]
    },
    {
        question: "«Да этот Ярополк — фуфлыга!» Что не так с Ярополком?",
        answers: [
            { text: "Он маленький и невзрачный.", correct: true, explanation: "Точно! Словарь Даля говорит, что фуфлыгой называют невзрачного малорослого человека. А еще так называют прыщи." },
            { text: "Он тот еще алкоголик.", correct: false },
            { text: "Он не держит свое слово.", correct: false }
        ]
    },
    {
        question: "Если человека прозвали пятигузом, значит, он…",
        answers: [
            { text: "Не держит слово.", correct: true, explanation: "Может сесть сразу на пять стульев. Согласно Этимологическому словарю русского языка Макса Фасмера, пятигуз — это ненадежный, непостоянный человек." },
            { text: "Изменяет жене", correct: false },
            { text: "Без гроша в кармане.", correct: false }
        ]
    },
    {
        question: "Кто такой шлындра?",
        answers: [
            { text: "Обманщик.", correct: false },
            { text: "Нытик.", correct: false },
            { text: "Бродяга.", correct: true, explanation: "Да! В Словаре русского арго «шлындрать» означает бездельничать, шляться." }
        ]
    }
];

let currentQuestionIndex = 0;
let correctAnswersCount = 0;
let quizCompleted = false;

let questionsShuffled = false; 

function initQuiz() {
    if (!questionsShuffled) { 
        shuffle(questions);
        questionsShuffled = true;
    }
    displayQuestion();
}

const showQuestionButton = document.querySelector('.show-question-button');

showQuestionButton.addEventListener('click', () => {
    initQuiz(); 
});


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function handleAnswerClick(answer, answerElement, questionBlock) {
    if (quizCompleted) return;

    const questionText = questionBlock.querySelector('.question-text');

    setTimeout(() => {
        answerElement.classList.remove('shake');
    }, 700);

    if (answer.correct) {
        answerElement.classList.add("correct-answer");
        questionText.innerHTML += '<span style="color:green;">✔</span>';
        answerElement.style.backgroundColor = "#a8d5a9";
        answerElement.textContent = answer.explanation;

        const allAnswers = questionBlock.querySelectorAll('.answer');
        allAnswers.forEach(ans => {
            if (!ans.classList.contains("correct-answer")) {
                ans.classList.add("wrong-answer");
            }
        });
        setTimeout(() => {
            clearAnswers(questionBlock);
        }, 4000);
        correctAnswersCount++;
    } else {
        answerElement.classList.add("wrong-answer");
        questionText.innerHTML += ' <span style="color:red;">✘</span>';
        answerElement.style.backgroundColor = "#B22222";
        answerElement.classList.add('shake');

        const allAnswers = questionBlock.querySelectorAll('.answer');
        allAnswers.forEach(ans => {
            ans.classList.add("wrong-answer");
        });
        setTimeout(() => {
            clearAnswers(questionBlock);
        }, 2000);
    }
}

function toggleCorrectAnswer(questionBlock, questionData) {
    if (questionBlock.querySelector(".answer")) {
        questionBlock.querySelectorAll(".answer").forEach(answer => answer.remove());
        return;
    }

    const correctAnswerElement = document.createElement("div");
    correctAnswerElement.className = "answer";
    correctAnswerElement.textContent = `Правильный ответ: ${questionData.answers.find(answer => answer.correct).text}`;
    questionBlock.appendChild(correctAnswerElement);

    if (questionData.answers.find(answer => answer.correct).explanation) {
        const explanationElement = document.createElement("div");
        explanationElement.className = "explanation";
        explanationElement.textContent = questionData.answers.find(answer => answer.correct).explanation;
        questionBlock.appendChild(explanationElement);
    }
}

function displayResults() {
    const questionheader = document.getElementById("question-header");
    questionheader.textContent = "Вопросы закончились";
    const questionArea = document.getElementById("question-area");
    questionArea.innerHTML = "";

    const statsElement = document.createElement("div");
    statsElement.className = "stats";
    statsElement.textContent = `Правильных ответов: ${correctAnswersCount} из ${questions.length}`;
    questionArea.appendChild(statsElement);

    const questionList = document.createElement("div");
    questionList.className = "question-list";

    questions.forEach((questionData, index) => {
        const questionBlock = document.createElement("div");
        questionBlock.className = "question-block";

        const questionText = document.createElement("div");
        questionText.className = "question-text";
        questionText.textContent = `${index + 1}. ${questionData.question}`;
        questionBlock.appendChild(questionText);

        questionBlock.addEventListener("click", () => toggleCorrectAnswer(questionBlock, questionData));

        questionList.appendChild(questionBlock);
    });

    questionArea.appendChild(questionList);
}

function clearAnswers(questionBlock) {
    const answers = questionBlock.querySelectorAll('.answer');
    answers.forEach(answer => answer.remove());
}

function displayQuestion() {
    const questionArea = document.getElementById("question-area");

    if (currentQuestionIndex >= questions.length) {
        quizCompleted = true;
        displayResults();
        const showQuestionButton = document.querySelector('.show-question-button');
        if (showQuestionButton) {
            showQuestionButton.style.display = 'none';
        }
        return;
    }

    const questionData = questions[currentQuestionIndex];
    const questionBlock = document.createElement("div");
    questionBlock.className = "question-block";

    const questionText = document.createElement("div");
    questionText.className = "question-text";
    questionText.textContent = `${currentQuestionIndex + 1}. ${questionData.question}`;
    questionBlock.appendChild(questionText);

    const shuffledAnswers = shuffle(questionData.answers);
    shuffledAnswers.forEach(answer => {
        const answerElement = document.createElement("div");
        answerElement.className = "answer";
        answerElement.textContent = answer.text;

        answerElement.addEventListener("click", () => handleAnswerClick(answer, answerElement, questionBlock));
        questionBlock.appendChild(answerElement);
    });

    questionArea.appendChild(questionBlock);
    currentQuestionIndex++;
    if (currentQuestionIndex==4){
        showQuestionButton.textContent="Результаты";
    }
}
























