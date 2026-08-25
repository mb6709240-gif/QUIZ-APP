export default function QuestionCard({ question, index, selectedAnswer, onSelect, onMarkReview, isMarked }) {
  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-number">Question {index + 1}</span>
        <button className={`mark-review-btn ${isMarked ? 'marked' : ''}`} onClick={onMarkReview}>
          {isMarked ? '\u2605 Marked for Review' : '\u2606 Mark for Review'}
        </button>
      </div>
      <p className="question-text">{question.text}</p>
      <div className="question-options">
        {question.options.map((option, i) => {
          const letter = String.fromCharCode(65 + i);
          const isSelected = selectedAnswer === option;
          return (
            <button key={i} className={`option-item ${isSelected ? 'selected' : ''}`} onClick={() => onSelect(option)}>
              <span className="option-letter">{letter}</span>
              <span className="option-text">{option}</span>
              {isSelected && <span className="option-check">{'\u2713'}</span>}
            </button>
          );
        })}
      </div>
      {question.marks && <div className="question-marks"><span className="badge badge-neutral">{question.marks} Marks</span></div>}
    </div>
  );
}
