
# IQ Test Website Blueprint

## Overview

This document outlines the plan for creating an interactive IQ test website. The application will present users with a series of multiple-choice questions and provide a score upon completion.

## Project Outline

### Style and Design

*   **Layout:** A clean and modern design with a clear focus on the questions.
*   **Color Palette:** A professional and engaging color scheme.
*   **Typography:** Readable fonts with clear headings and text.
*   **User Experience:** Intuitive navigation and a seamless testing experience.

### Features

*   **Welcome Screen:** A starting screen with instructions and a "Start Test" button.
*   **Question Display:** Questions are presented one at a time with multiple-choice answers.
*   **Timer:** A countdown timer to add a time-pressure element (optional, for future implementation).
*   **Scoring:** The user's score is calculated based on the number of correct answers.
*   **Results Screen:** A final screen displaying the user's score and a brief interpretation.

## Implementation Plan

1.  **HTML (`index.html`):**
    *   Create the main structure of the application.
    *   Include a welcome container and a quiz container.
    *   Add elements for the question, answer choices, and a "Next" button.
    *   Create a results container to display the final score.

2.  **CSS (`style.css`):**
    *   Style the layout, colors, and typography of the application.
    *   Ensure the design is responsive and works well on different screen sizes.
    *   Add styles for buttons, containers, and other UI elements.

3.  **JavaScript (`main.js`):**
    *   Create an array of question objects, each containing the question text, answer choices, and the correct answer.
    *   Implement logic to start the quiz, display questions, and handle user selections.
    *   Add functionality to the "Next" button to move to the next question.
    *   Calculate and display the final score.
