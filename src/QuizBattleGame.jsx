import React, { useState, useEffect } from 'react';

  // Main Game Component
const QuizBattleGame = () => {
  // Game states
  const [gameState, setGameState] = useState('setup'); // setup, playerSelection, game, roundEnd
  const [players, setPlayers] = useState([
    { id: 1, name: 'Player 1', score: 0 },
    { id: 2, name: 'Player 2', score: 0 },
  ]);
  const [currentPlayers, setCurrentPlayers] = useState([]);
  const [activePlayer, setActivePlayer] = useState(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentSubRound, setCurrentSubRound] = useState(1); // Track which of the two sub-rounds we're on
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question index
  const [playerRoundScores, setPlayerRoundScores] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // For resetting file input
  
  // Sample questions (would be loaded from admin system in production)
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "Which of these are planets in our solar system?",
      answers: [
        { id: 1, text: "Mercury", correct: true },
        { id: 2, text: "Venus", correct: true },
        { id: 3, text: "Earth", correct: true },
        { id: 4, text: "Jupiter", correct: true },
        { id: 5, text: "Saturn", correct: true },
        { id: 6, text: "Neptune", correct: true },
        { id: 7, text: "Uranus", correct: true },
        { id: 8, text: "Pluto", correct: false },
        { id: 9, text: "Ceres", correct: false },
        { id: 10, text: "Eris", correct: false },
      ]
    },
    {
      id: 2,
      question: "Which of these are prime numbers?",
      answers: [
        { id: 1, text: "2", correct: true },
        { id: 2, text: "3", correct: true },
        { id: 3, text: "5", correct: true },
        { id: 4, text: "7", correct: true },
        { id: 5, text: "11", correct: true },
        { id: 6, text: "13", correct: true },
        { id: 7, text: "17", correct: true },
        { id: 8, text: "9", correct: false },
        { id: 9, text: "15", correct: false },
        { id: 10, text: "21", correct: false },
      ]
    }
  ]);

  // Add a new player
  const addPlayer = () => {
    const newPlayerId = players.length > 0 ? Math.max(...players.map(p => p.id)) + 1 : 1;
    setPlayers([...players, { id: newPlayerId, name: `Player ${newPlayerId}`, score: 0 }]);
  };

  // Edit player name
  const editPlayerName = (playerId, newName) => {
    setPlayers(players.map(player => 
      player.id === playerId ? { ...player, name: newName } : player
    ));
  };

  // Remove a player
  const removePlayer = (playerId) => {
    setPlayers(players.filter(player => player.id !== playerId));
  };

  // Reset all player scores
  const resetAllScores = () => {
    setPlayers(players.map(player => ({ ...player, score: 0 })));
  };
  
  // Go back to setup with confirmation
  const goBackToSetup = () => {
    if (window.confirm('Going back to the main menu will reset all player scores. Continue?')) {
      resetAllScores();
      setGameState('setup');
      setCurrentSubRound(1); // Reset sub-round counter
      setCurrentQuestionIndex(0); // Reset question index
    }
  };

  // Select players for the current match
  const selectPlayersForMatch = (playerIds) => {
    // Enforce exactly 2 players
    if (playerIds.length !== 2) {
      alert("Please select exactly 2 players for the match");
      return;
    }
    
    const selectedPlayers = players.filter(player => playerIds.includes(player.id));
    setCurrentPlayers(selectedPlayers);
    setActivePlayer(selectedPlayers[0]); // First player starts in sub-round 1
    
    // Initialize round scores for each player to 0
    const initialRoundScores = {};
    selectedPlayers.forEach(player => {
      initialRoundScores[player.id] = 0;
    });
    setPlayerRoundScores(initialRoundScores);
    
    // Don't reset the question index - continue from where we left off
    
    setGameState('game');
    setCurrentSubRound(1); // Ensure we're starting with sub-round 1
    startNewRound();
  };

  // Start a new round
  const startNewRound = () => {
    // Check if we have questions available
    if (questions.length === 0) {
      alert("No questions available. Please import questions.");
      goBackToSetup();
      return;
    }
    
    // Get the next question in sequence
    const selectedQuestion = questions[currentQuestionIndex];
    
    // Set the current question
    setCurrentQuestion(selectedQuestion);
    
    // Increment the question index for next time
    const nextIndex = (currentQuestionIndex + 1) % questions.length;
    setCurrentQuestionIndex(nextIndex);
    
    // Reset round scores for all players
    const resetRoundScores = {};
    currentPlayers.forEach(player => {
      resetRoundScores[player.id] = 0;
    });
    setPlayerRoundScores(resetRoundScores);
    
    // Clear selected answers
    setSelectedAnswers([]);
  };

  // Start the second sub-round
  const startSecondRound = () => {
    // Switch active player to the second player
    const secondPlayer = currentPlayers.find(player => player.id !== currentPlayers[0].id);
    setActivePlayer(secondPlayer);
    
    // Move to sub-round 2
    setCurrentSubRound(2);
    
    // Start a new question
    startNewRound();
    
    // Return to game state
    setGameState('game');
  };

  // Switch to other player
  const switchPlayer = () => {
    const otherPlayer = currentPlayers.find(player => player.id !== activePlayer.id);
    if (otherPlayer) {
      setActivePlayer(otherPlayer);
    }
  };

  // Handle answer selection
  const handleAnswerSelection = (answerId) => {
    // Don't allow selection of already selected answers
    if (selectedAnswers.includes(answerId)) return;
    
    // Find the answer details
    const answer = currentQuestion.answers.find(a => a.id === answerId);
    const newSelectedAnswers = [...selectedAnswers, answerId];
    setSelectedAnswers(newSelectedAnswers);
    
    if (answer.correct) {
      // Correct answer - each correct answer is worth 10 points
      const newRoundScore = (playerRoundScores[activePlayer.id] || 0) + 10;
      setPlayerRoundScores({
        ...playerRoundScores,
        [activePlayer.id]: newRoundScore
      });
    } else {
      // Incorrect answer - reset current player's round score and switch to other player
      setPlayerRoundScores({
        ...playerRoundScores,
        [activePlayer.id]: 0
      });
      
      // Switch to the other player
      switchPlayer();
    }
  };

  // Pass turn to other player
  const passTurn = () => {
    // Check if current player has a round score
    const currentPlayerRoundScore = playerRoundScores[activePlayer.id] || 0;
    
    if (currentPlayerRoundScore === 0) {
      // Don't allow passing with zero score
      return;
    }
    
    // Switch to other player without adding score to total yet
    switchPlayer();
  };

  // End the current round
  const endRound = () => {
    // Add all round scores to player totals at the end of the round
    const updatedPlayers = players.map(player => {
      const additionalScore = playerRoundScores[player.id] || 0;
      return additionalScore > 0 
        ? { ...player, score: player.score + additionalScore } 
        : player;
    });
    setPlayers(updatedPlayers);
    
    setGameState('roundEnd');
  };
  
  // Start a new match
  const startNewMatch = () => {
    setGameState('playerSelection');
    setCurrentRound(currentRound + 1);
    setCurrentSubRound(1); // Reset sub-round counter
    // Don't reset question index - continue from where we left off
  };
  
  // Import questions from JSON file
  const importQuestions = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedQuestions = JSON.parse(e.target.result);
        
        // Basic validation
        if (!Array.isArray(importedQuestions)) {
          alert('Invalid format: Imported data is not an array.');
          return;
        }
        
        for (const q of importedQuestions) {
          if (!q.question || !Array.isArray(q.answers) || q.answers.length !== 10) {
            alert('Invalid format: Questions must have a text property and exactly 10 answers.');
            return;
          }
          
          const correctCount = q.answers.filter(a => a.correct).length;
          if (correctCount !== 7) {
            alert(`Question "${q.question}" does not have exactly 7 correct answers.`);
            return;
          }
        }
        
        // If all checks pass, set the questions
        setQuestions(importedQuestions);
        // Reset current question index when importing new questions
        setCurrentQuestionIndex(0);
        alert('Questions imported successfully!');
        // Reset file input
        setFileInputKey(Date.now());
      } catch (error) {
        alert('Error importing questions: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {gameState === 'setup' && (
        <SetupScreen 
          players={players} 
          addPlayer={addPlayer} 
          editPlayerName={editPlayerName} 
          removePlayer={removePlayer} 
          startGame={() => setGameState('playerSelection')}
          importQuestions={importQuestions}
          fileInputKey={fileInputKey}
        />
      )}
      
      {gameState === 'playerSelection' && (
        <PlayerSelectionScreen 
          players={players} 
          selectPlayers={selectPlayersForMatch} 
          backToSetup={goBackToSetup} 
        />
      )}
      
      {gameState === 'game' && currentQuestion && (
        <GameScreen 
          question={currentQuestion} 
          players={currentPlayers}
          activePlayer={activePlayer} 
          playerRoundScores={playerRoundScores}
          selectedAnswers={selectedAnswers}
          handleAnswerSelection={handleAnswerSelection}
          passTurn={passTurn}
          endRound={endRound}
          currentSubRound={currentSubRound}
        />
      )}
      
      {gameState === 'roundEnd' && (
        <RoundEndScreen 
          players={players} 
          currentRound={currentRound}
          currentSubRound={currentSubRound}
          startNewMatch={startNewMatch}
          startSecondRound={startSecondRound}
          backToSetup={goBackToSetup} 
        />
      )}
    </div>
  );
};

// Setup Screen Component
const SetupScreen = ({ players, addPlayer, editPlayerName, removePlayer, startGame, importQuestions, fileInputKey }) => {
  return (
    <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Quiz Battle Game</h1>
      
      {/* Import Questions Section */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h2 className="text-2xl font-semibold mb-3">Import Questions</h2>
        <p className="mb-3">Import questions exported from the Admin System:</p>
        <label className="bg-indigo-500 text-white text-xl px-6 py-3 rounded-lg hover:bg-indigo-600 cursor-pointer inline-block">
          Import Question File
          <input
            type="file"
            key={fileInputKey}
            accept=".json"
            onChange={importQuestions}
            className="hidden"
          />
        </label>
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">Players</h2>
      
      <div className="space-y-4 mb-6">
        {players.map(player => (
          <div key={player.id} className="flex items-center">
            <input
              type="text"
              value={player.name}
              onChange={(e) => editPlayerName(player.id, e.target.value)}
              className="flex-grow text-xl p-3 border rounded-lg mr-4"
            />
            <button 
              onClick={() => removePlayer(player.id)}
              className="bg-red-500 text-white text-xl px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <button 
          onClick={addPlayer}
          className="bg-blue-500 text-white text-xl px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Add Player
        </button>
        <button 
          onClick={startGame}
          disabled={players.length < 2}
          className={`text-white text-xl px-6 py-3 rounded-lg ${
            players.length < 2 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

// Player Selection Screen Component
const PlayerSelectionScreen = ({ players, selectPlayers, backToSetup }) => {
  const [selectedPlayerIds, setSelectedPlayerIds] = useState([]);

  const togglePlayerSelection = (playerId) => {
    if (selectedPlayerIds.includes(playerId)) {
      // Remove this player from selection
      setSelectedPlayerIds(selectedPlayerIds.filter(id => id !== playerId));
    } else {
      // Add this player, but maintain maximum 2 players total
      const newSelection = [...selectedPlayerIds, playerId].slice(-2);
      setSelectedPlayerIds(newSelection);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Select Players</h1>
      
      <div className="mb-4">
        <p className="text-xl text-center font-medium text-blue-600">Select exactly 2 players for this round</p>
        <p className="text-lg text-center text-gray-600">Currently selected: {selectedPlayerIds.length}/2</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {players.map(player => (
          <button
            key={player.id}
            onClick={() => togglePlayerSelection(player.id)}
            className={`text-xl p-4 rounded-lg border-2 ${
              selectedPlayerIds.includes(player.id) 
                ? 'border-blue-500 bg-blue-100' 
                : 'border-gray-300'
            }`}
          >
            {player.name} ({player.score})
          </button>
        ))}
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <button 
          onClick={backToSetup}
          className="bg-gray-500 text-white text-xl px-6 py-3 rounded-lg hover:bg-gray-600"
        >
          Back
        </button>
        <button 
          onClick={() => selectPlayers(selectedPlayerIds)}
          disabled={selectedPlayerIds.length !== 2}
          className={`text-white text-xl px-6 py-3 rounded-lg ${
            selectedPlayerIds.length !== 2 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          Start Match
        </button>
      </div>
    </div>
  );
};

// Game Screen Component
const GameScreen = ({ 
  question, 
  players, 
  activePlayer, 
  playerRoundScores,
  selectedAnswers, 
  handleAnswerSelection, 
  passTurn,
  endRound,
  currentSubRound
}) => {
  // Check if all incorrect answers have been selected
  const incorrectAnswers = question.answers.filter(a => !a.correct);
  const selectedIncorrectAnswers = question.answers.filter(a => !a.correct && selectedAnswers.includes(a.id));
  const allIncorrectAnswersSelected = selectedIncorrectAnswers.length === incorrectAnswers.length;
  
  // Check if all correct answers have been selected
  const correctAnswers = question.answers.filter(a => a.correct);
  const selectedCorrectAnswers = question.answers.filter(a => a.correct && selectedAnswers.includes(a.id));
  const allCorrectAnswersSelected = selectedCorrectAnswers.length === correctAnswers.length;
  
  // Show end round button if either all correct or all incorrect answers have been selected
  const showEndRoundButton = allIncorrectAnswersSelected || allCorrectAnswersSelected;
  
  // Disable remaining buttons if all correct or all incorrect answers have been found
  const disableRemainingButtons = allIncorrectAnswersSelected || allCorrectAnswersSelected;
  
  return (
    <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-3xl font-bold">{question.question}</h2>
          <div className="text-xl px-4 py-1 bg-blue-100 text-blue-800 rounded-lg">
            Round {currentSubRound} of 2
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-2xl font-semibold">
            Active: <span className="text-blue-600">{activePlayer.name}</span>
          </div>
          <div className="text-2xl font-semibold">
            Current Player's Round Score: <span className="text-green-600">{playerRoundScores[activePlayer.id] || 0}</span>
          </div>
        </div>
        
        {allCorrectAnswersSelected && (
          <div className="mt-2 p-2 bg-green-100 text-green-800 rounded">
            All correct answers have been found! Click "End Round" to continue.
          </div>
        )}
        {allIncorrectAnswersSelected && (
          <div className="mt-2 p-2 bg-red-100 text-red-800 rounded">
            All incorrect answers have been found! Click "End Round" to continue.
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {question.answers.map(answer => (
          <button
            key={answer.id}
            onClick={() => handleAnswerSelection(answer.id)}
            disabled={selectedAnswers.includes(answer.id) || (disableRemainingButtons && !selectedAnswers.includes(answer.id))}
            className={`text-xl p-4 rounded-lg transition-all ${
              selectedAnswers.includes(answer.id)
                ? answer.correct
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
                : disableRemainingButtons
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-100 hover:bg-blue-200'
            }`}
          >
            {answer.text}
          </button>
        ))}
      </div>
      
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          {players.map(player => (
            <div key={player.id} className={`text-xl ${player.id === activePlayer.id ? 'font-bold' : ''}`}>
              <span>{player.name}: {player.score}</span>
              {playerRoundScores[player.id] > 0 && (
                <span className="inline-block ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-lg border border-green-300">
                  +{playerRoundScores[player.id]}
                </span>
              )}
              {player.id === activePlayer.id && ' (Active)'}
            </div>
          ))}
        </div>
        
        <div className="flex gap-3">
          {showEndRoundButton && (
            <button
              onClick={endRound}
              className="bg-red-500 text-white text-xl px-6 py-3 rounded-lg hover:bg-red-600"
            >
              End Round
            </button>
          )}
          
          <button
            onClick={passTurn}
            disabled={!playerRoundScores[activePlayer.id] || playerRoundScores[activePlayer.id] === 0 || disableRemainingButtons}
            className={`text-white text-xl px-6 py-3 rounded-lg ${
              !playerRoundScores[activePlayer.id] || playerRoundScores[activePlayer.id] === 0 || disableRemainingButtons
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-yellow-500 hover:bg-yellow-600'
            }`}
            title={
              disableRemainingButtons 
                ? "End the round" 
                : (!playerRoundScores[activePlayer.id] || playerRoundScores[activePlayer.id] === 0) 
                  ? "Answer at least one question correctly to pass turn" 
                  : "Pass turn to other player"
            }
          >
            Pass Turn
          </button>
        </div>
      </div>
    </div>
  );
};

// Round End Screen Component
const RoundEndScreen = ({ 
  players, 
  currentRound, 
  currentSubRound, 
  startNewMatch, 
  startSecondRound, 
  backToSetup 
}) => {
  // Sort players by score in descending order
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  
  return (
    <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6">
      {currentSubRound === 1 ? (
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold mb-2">Round 1 Complete</h1>
          <p className="text-xl text-blue-600">Ready for round 2! The second player will start.</p>
        </div>
      ) : (
        <h1 className="text-4xl font-bold text-center mb-8">Both Rounds Complete</h1>
      )}
      
      <div className="space-y-4 mb-8">
        <h2 className="text-2xl font-semibold">Current Scores</h2>
        {sortedPlayers.map((player, index) => (
          <div key={player.id} className="flex justify-between items-center text-2xl p-2 border-b">
            <div>
              {index + 1}. {player.name}
            </div>
            <div className="font-bold">{player.score}</div>
          </div>
        ))}
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4">
        {currentSubRound === 1 ? (
          <>
            <button 
              onClick={backToSetup}
              className="bg-gray-500 text-white text-xl px-6 py-3 rounded-lg hover:bg-gray-600"
            >
              Main Menu
            </button>
            <button 
              onClick={startSecondRound}
              className="bg-green-500 text-white text-xl px-6 py-3 rounded-lg hover:bg-green-600"
            >
              Start Round 2
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={backToSetup}
              className="bg-gray-500 text-white text-xl px-6 py-3 rounded-lg hover:bg-gray-600"
            >
              Main Menu
            </button>
            <button 
              onClick={startNewMatch}
              className="bg-blue-500 text-white text-xl px-6 py-3 rounded-lg hover:bg-blue-600"
            >
              Select New Players
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizBattleGame;