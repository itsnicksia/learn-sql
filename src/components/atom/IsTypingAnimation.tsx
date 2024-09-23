import React from 'react';
import '../../styles/TypingAnimation.css'; // Importing the CSS file

const TypingAnimation: React.FC = () => {
  return (
    <div className="typing-indicator">
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  );
};

export default TypingAnimation;
