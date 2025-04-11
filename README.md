# Quiz Battle 🎮

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green.svg)

> A head-to-head quiz game where players compete to find correct answers while avoiding incorrect ones.

![Quiz Battle Demo](https://via.placeholder.com/800x400?text=Quiz+Battle+Game)

## ✨ Features

- **Head-to-head Competition**: Two players compete in each match
- **Two-Round Structure**: Each match consists of 2 rounds with player order reversed in round 2
- **7/3 Quiz Format**: Each question has 7 correct answers and 3 incorrect answers
- **Risk vs Reward**: Continue answering to gain points or pass your turn to bank points
- **Admin Dashboard**: Create, edit, and manage quiz questions
- **Import/Export**: Import and export question banks via JSON

## 📋 Game Rules

1. Two players compete in a match consisting of two rounds
2. Each round presents a question with 10 possible answers (7 correct, 3 incorrect)
3. Players take turns selecting answers:
   - Correct answer: +10 points, player continues
   - Incorrect answer: Player loses all points for the round, turn passes
4. Players can "pass" to bank their points and end their turn
5. A round ends when all correct answers or all incorrect answers are found
6. In round 2, the second player starts first (order is reversed)
7. After both rounds, the match ends and scores are tallied

## 🚀 Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/quiz-battle.git
cd quiz-battle

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm start
# or
yarn start
```

## 📖 How to Use

### Playing the Game

1. Add players on the setup screen
2. Select two players for a match
3. First player selects answers, trying to find correct ones
4. After round 1, view scores and start round 2
5. Second player starts round 2
6. After both rounds, view final scores and select new players or return to menu

### Creating Questions

1. Navigate to the Admin Dashboard
2. Add a new question and 10 possible answers
3. Mark exactly 7 answers as correct and 3 as incorrect
4. Save the question to add it to the question bank
5. Export your question bank for backup or sharing

### Importing Questions

1. On the Game Setup screen, click "Import Question File"
2. Select a JSON file in the correct format
3. The imported questions will be added to your question bank

## 🗂️ Project Structure

```
quiz-battle/
├── src/
│   ├── components/
│   │   ├── QuizBattleApp.jsx     # Main application component
│   │   ├── QuizBattleGame.jsx    # Game logic and UI
│   │   └── QuizBattleAdmin.jsx   # Admin dashboard component
│   ├── App.js                    # Entry point
│   └── index.js                  # Root file
├── public/
│   └── index.html                # HTML template
└── package.json                  # Dependencies and scripts
```

## 🔧 Technologies Used

- **React.js**: Frontend library for building the user interface
- **Tailwind CSS**: Utility-first CSS framework for styling
- **LocalStorage API**: Store questions and game state locally

## 📝 Question Bank Format

Quiz Battle uses a specific JSON format for questions:

```json
[
  {
    "id": 1,
    "question": "Which of these are planets in our solar system?",
    "answers": [
      { "id": 1, "text": "Mercury", "correct": true },
      { "id": 2, "text": "Venus", "correct": true },
      { "id": 3, "text": "Earth", "correct": true },
      { "id": 4, "text": "Jupiter", "correct": true },
      { "id": 5, "text": "Saturn", "correct": true },
      { "id": 6, "text": "Neptune", "correct": true },
      { "id": 7, "text": "Uranus", "correct": true },
      { "id": 8, "text": "Pluto", "correct": false },
      { "id": 9, "text": "Ceres", "correct": false },
      { "id": 10, "text": "Eris", "correct": false }
    ]
  }
]
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit your Changes (`git commit -m 'Add some amazing feature'`)
4. Push to the Branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Thanks to everyone who has contributed to this project
- Inspired by various quiz games and knowledge competitions