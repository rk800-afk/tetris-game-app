import "./modal.css";

export function Modal({ score, handleRestartClick }) {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div>You lost..</div>
        <div>Your score is : {score}</div>
        <button onClick={handleRestartClick} className="modal-restart-btn">
          Restart
        </button>
      </div>
    </div>
  );
}
