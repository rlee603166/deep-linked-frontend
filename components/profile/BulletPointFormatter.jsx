// BulletPointFormatter.jsx
import React from 'react';

const BulletPointFormatter = ({ text, className = "" }) => {
  if (!text) return null;
  
  // Check if the text contains bullet points
  const hasBulletPoints = /^[•\-*]\s|\n[•\-*]\s|^\d+\.\s|\n\d+\.\s/.test(text);
  
  if (hasBulletPoints) {
    // Split the text by newlines
    const lines = text.split('\n');
    
    return (
      <div className={className}>
        <ul className="list-disc pl-5 space-y-1">
          {lines.map((line, index) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return null;
            
            // Check if this line is a bullet point
            if (/^[•\-*]\s|\d+\.\s/.test(trimmedLine)) {
              // Remove the bullet character or number and return as a list item
              const content = trimmedLine.replace(/^[•\-*]\s|\d+\.\s/, '');
              return <li key={index}>{content}</li>;
            }
            
            // If not a bullet point, return as regular list item
            // This preserves the styling consistency
            return <li key={index}>{trimmedLine}</li>;
          })}
        </ul>
      </div>
    );
  }
  
  // If no bullet points, render with paragraph breaks
  return (
    <p className={className}>
      {text.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < text.split('\n').length - 1 && <br />}
        </React.Fragment>
      ))}
    </p>
  );
};

export default BulletPointFormatter;