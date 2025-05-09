const answerFileInput = document.getElementById('answerFile');
const buttonsContainer = document.getElementById('buttonsContainer');
const autocueTextElement = document.getElementById('autocueText');
const scrollSpeedControl = document.getElementById('scrollSpeed');

let answers = []; // Array to store parsed answers
let scrollingInterval = null;
let currentScrollPosition = 0;
let scrollSpeed = parseInt(scrollSpeedControl.value); // Get initial speed

// Event listener for file upload
answerFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const fileContent = e.target.result;
            answers = parseAnswers(fileContent);
            generateButtons(answers);
        };
        reader.readAsText(file);
    }
});

// Function to parse the uploaded text file
function parseAnswers(text) {
    const answerPairs = text.split('---'); // Split by the delimiter
    const parsedAnswers = [];

    for (let i = 0; i < answerPairs.length; i++) {
        const pair = answerPairs[i].trim();
        if (pair) {
            // Assuming the first line is the question/topic and the rest is the answer
            const lines = pair.split('\n');
            const question = lines[0].trim();
            const answer = lines.slice(1).join('\n').trim();
            parsedAnswers.push({ question, answer });
        }
    }
    return parsedAnswers;
}

// Function to generate buttons based on parsed answers
function generateButtons(answersArray) {
    buttonsContainer.innerHTML = ''; // Clear previous buttons
    answersArray.forEach((answer, index) => {
        const button = document.createElement('button');
        button.textContent = answer.question;
        button.addEventListener('click', () => {
            displayAutocue(answer.answer);
        });
        buttonsContainer.appendChild(button);
    });
}

// Function to display and start scrolling the autocue
function displayAutocue(text) {
    stopAutocue(); // Stop any existing scrolling
    autocueTextElement.textContent = text;
    currentScrollPosition = 0;
    autocueTextElement.style.transform = `translateY(0)`; // Reset scroll position
    startAutocue();
}

// Function to start the autocue scrolling
function startAutocue() {
    // Calculate the total height the text will take up when not scrolling
    const textHeight = autocueTextElement.scrollHeight;
    const containerHeight = autocueTextElement.parentElement.clientHeight;

    // Only scroll if the text is taller than the container
    if (textHeight > containerHeight) {
         scrollingInterval = setInterval(() => {
            currentScrollPosition -= scrollSpeed; // Adjust scroll speed here
             // Stop scrolling when the bottom of the text is visible
            if (currentScrollPosition < -(textHeight - containerHeight)) {
                stopAutocue(); // Or reset to top: currentScrollPosition = containerHeight;
            }
            autocueTextElement.style.transform = `translateY(${currentScrollPosition}px)`;
        }, 50); // Adjust interval for smoother/faster updates
    }
}


// Function to stop the autocue scrolling
function stopAutocue() {
    clearInterval(scrollingInterval);
    scrollingInterval = null;
}

// Event listener for scroll speed control
scrollSpeedControl.addEventListener('input', (event) => {
    scrollSpeed = parseInt(event.target.value);
    // If currently scrolling, stop and restart with new speed
    if (scrollingInterval) {
        stopAutocue();
        startAutocue();
    }
});

// Optional: Stop scrolling when the mouse leaves the autocue area
autocueTextElement.parentElement.addEventListener('mouseleave', stopAutocue);

// Optional: Resume scrolling when the mouse enters the autocue area (if text is overflowing)
autocueTextElement.parentElement.addEventListener('mouseenter', () => {
     const textHeight = autocueTextElement.scrollHeight;
     const containerHeight = autocueTextElement.parentElement.clientHeight;
     if (textHeight > containerHeight && !scrollingInterval) {
         startAutocue();
     }
});
