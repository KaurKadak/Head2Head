import React, { useState } from 'react';
import QuizBattleGame from './QuizBattleGame';
import QuizBattleAdmin from './QuizBattleAdmin';

const QuizBattleApp = () => {
  const [currentView, setCurrentView] = useState('game'); // 'game' or 'admin'
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  const navigateTo = (view) => {
    setCurrentView(view);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition duration-200 ease-in-out z-30 w-64 bg-blue-700 shadow-lg`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Quiz Battle</h1>
            <button 
              className="text-white hover:bg-blue-600 rounded-full p-1 focus:outline-none"
              onClick={toggleSidebar}
              aria-label="Minimize sidebar"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>
          
          <nav className="mt-8">
            <div className="space-y-4">
              <button
                onClick={() => navigateTo('game')}
                className={`w-full px-4 py-3 text-left rounded-lg transition-colors ${
                  currentView === 'game'
                    ? 'bg-white text-blue-700 font-bold'
                    : 'text-white hover:bg-blue-600'
                }`}
              >
                Game
              </button>
              <button
                onClick={() => navigateTo('admin')}
                className={`w-full px-4 py-3 text-left rounded-lg transition-colors ${
                  currentView === 'admin'
                    ? 'bg-white text-blue-700 font-bold'
                    : 'text-white hover:bg-blue-600'
                }`}
              >
                Admin Dashboard
              </button>
            </div>
          </nav>
        </div>
      </div>
      
      {/* Floating button to expand sidebar when minimized */}
      {!sidebarOpen && (
        <button
          className="fixed top-4 left-4 bg-blue-700 text-white rounded-lg p-2 shadow-lg hover:bg-blue-600 focus:outline-none z-10"
          onClick={toggleSidebar}
          aria-label="Expand sidebar"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      )}
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'md:ml-64' : ''}`}>
        {/* Page Content */}
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          {currentView === 'game' ? (
            <QuizBattleGame />
          ) : (
            <QuizBattleAdmin />
          )}
        </div>
        
        {/* Footer */}
        <footer className="bg-gray-800 text-white py-4">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p>Quiz Battle Game © {new Date().getFullYear()}</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default QuizBattleApp;