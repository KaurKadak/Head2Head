import React, { useState, useEffect } from 'react';

const QuizBattleAdmin = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    id: null,
    question: '',
    answers: Array(10).fill().map((_, index) => ({
      id: index + 1,
      text: '',
      correct: index < 7 // First 7 default to correct
    }))
  });
  const [isEditing, setIsEditing] = useState(false);

  // Load questions from localStorage on mount
  useEffect(() => {
    const savedQuestions = localStorage.getItem('quizBattleQuestions');
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    }
  }, []);

  // Save questions to localStorage when updated
  useEffect(() => {
    if (questions.length > 0) {
      localStorage.setItem('quizBattleQuestions', JSON.stringify(questions));
    }
  }, [questions]);

  // Handle input change for question text
  const handleQuestionTextChange = (e) => {
    setCurrentQuestion({
      ...currentQuestion,
      question: e.target.value
    });
  };

  // Handle input change for answer text
  const handleAnswerTextChange = (answerId, value) => {
    setCurrentQuestion({
      ...currentQuestion,
      answers: currentQuestion.answers.map(answer => 
        answer.id === answerId ? { ...answer, text: value } : answer
      )
    });
  };

  // Toggle answer correctness
  const toggleAnswerCorrectness = (answerId) => {
    // Simply toggle the answer's correctness without any validation
    // Validation will happen on save instead
    setCurrentQuestion({
      ...currentQuestion,
      answers: currentQuestion.answers.map(answer => 
        answer.id === answerId ? { ...answer, correct: !answer.correct } : answer
      )
    });
  };

  // Save current question
  const saveQuestion = () => {
    // Form validation
    if (!currentQuestion.question.trim()) {
      alert('Please enter a question.');
      return;
    }

    const emptyAnswers = currentQuestion.answers.some(answer => !answer.text.trim());
    if (emptyAnswers) {
      alert('Please fill in all answer texts.');
      return;
    }

    const correctAnswersCount = currentQuestion.answers.filter(a => a.correct).length;
    if (correctAnswersCount !== 7) {
      alert(`You currently have ${correctAnswersCount} correct answers. You must have exactly 7 correct answers and 3 incorrect answers.`);
      return;
    }

    if (isEditing) {
      // Update existing question
      setQuestions(questions.map(q => 
        q.id === currentQuestion.id ? currentQuestion : q
      ));
    } else {
      // Add new question with unique ID
      const newId = questions.length > 0 
        ? Math.max(...questions.map(q => q.id)) + 1 
        : 1;
      
      setQuestions([...questions, { ...currentQuestion, id: newId }]);
    }

    // Reset form
    resetForm();
  };

  // Edit a question
  const editQuestion = (questionId) => {
    const questionToEdit = questions.find(q => q.id === questionId);
    if (questionToEdit) {
      setCurrentQuestion(questionToEdit);
      setIsEditing(true);
    }
  };

  // Delete a question
  const deleteQuestion = (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setQuestions(questions.filter(q => q.id !== questionId));
    }
  };

  // Reset the form
  const resetForm = () => {
    setCurrentQuestion({
      id: null,
      question: '',
      answers: Array(10).fill().map((_, index) => ({
        id: index + 1,
        text: '',
        correct: index < 7 // First 7 default to correct
      }))
    });
    setIsEditing(false);
  };

  // Export questions as JSON
  const exportQuestions = () => {
    // Make sure we have questions to export
    if (questions.length === 0) {
      alert('No questions to export. Please add some questions first.');
      return;
    }
    
    try {
      // Create JSON string with proper formatting
      const dataStr = JSON.stringify(questions, null, 2);
      
      // Create a Blob containing the data
      const blob = new Blob([dataStr], {type: 'application/json'});
      
      // Create an object URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a download link and trigger it
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = 'quiz_battle_questions.json';
      
      // Append to the document temporarily
      document.body.appendChild(downloadLink);
      
      // Trigger the download
      downloadLink.click();
      
      // Clean up
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
      
      alert('Questions exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export questions. See console for details.');
    }
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
        alert('Questions imported successfully!');
      } catch (error) {
        alert('Error importing questions: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Quiz Battle Admin</h1>
        
        {/* Question Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {isEditing ? 'Edit Question' : 'Add New Question'}
          </h2>
          
          <div className="mb-6">
            <label className="block text-xl mb-2">Question:</label>
            <input
              type="text"
              value={currentQuestion.question}
              onChange={handleQuestionTextChange}
              className="w-full text-xl p-3 border rounded-lg"
              placeholder="Enter your question here"
            />
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-medium mb-3">Answers (7 correct, 3 incorrect):</h3>
            {currentQuestion.answers.map(answer => (
              <div key={answer.id} className="flex items-center mb-3">
                <input
                  type="text"
                  value={answer.text}
                  onChange={(e) => handleAnswerTextChange(answer.id, e.target.value)}
                  className="flex-grow text-lg p-2 border rounded-lg mr-3"
                  placeholder={`Answer ${answer.id}`}
                />
                <button
                  onClick={() => toggleAnswerCorrectness(answer.id)}
                  className={`px-4 py-2 rounded-lg ${
                    answer.correct 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {answer.correct ? 'Correct' : 'Incorrect'}
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={saveQuestion}
              className="bg-blue-500 text-white text-xl px-6 py-3 rounded-lg hover:bg-blue-600"
            >
              {isEditing ? 'Update Question' : 'Add Question'}
            </button>
            
            {isEditing && (
              <button
                onClick={resetForm}
                className="bg-gray-500 text-white text-xl px-6 py-3 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
        
        {/* Question List */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Question List ({questions.length})</h2>
            <div className="flex gap-3">
              <button
                onClick={exportQuestions}
                disabled={questions.length === 0}
                className={`px-4 py-2 rounded-lg ${
                  questions.length === 0 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-purple-500 text-white hover:bg-purple-600'
                }`}
              >
                Export Questions
              </button>
              
              <label className="px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 cursor-pointer">
                Import Questions
                <input
                  type="file"
                  accept=".json"
                  onChange={importQuestions}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          
          {questions.length === 0 ? (
            <p className="text-lg text-gray-500">No questions yet. Add some questions above.</p>
          ) : (
            <div className="space-y-4">
              {questions.map(question => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-medium">{question.question}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editQuestion(question.id)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteQuestion(question.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {question.answers.map(answer => (
                      <div
                        key={answer.id}
                        className={`p-2 rounded text-sm truncate ${
                          answer.correct 
                            ? 'bg-green-100 border border-green-300' 
                            : 'bg-red-100 border border-red-300'
                        }`}
                        title={answer.text}
                      >
                        {answer.text}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizBattleAdmin;