import React from "react";

const IModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-xl font-bold" id="InstructionsModalLabel">Instructions</h2>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold focus:outline-none"
            aria-label="Close"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="p-4 text-left">
          <h3 className="text-lg font-semibold mb-1">How to play?</h3>
          <p className="mb-4">
            Sudoku is played on a grid of 9 x 9 spaces. Within the rows and columns are 9 “squares” (made up of 3 x 3 spaces). Each row, column and square (9 spaces each) needs to be filled out with the numbers 1-9, without repeating any numbers within the row, column or square.
          </p>
          <h3 className="text-lg font-semibold mb-1">Points System</h3>
          <p className="mb-4">
            If the number of solutions of a given puzzle is <br />
            =&gt; greater than 5 — points scored is 10.<br />
            =&gt; greater than equal to 2 and less than equal to 5 — points scored is 20.<br />
            =&gt; exactly 1— points scored is 30.
          </p>
          <h3 className="text-lg font-semibold mb-1">File upload format</h3>
          <p>
            Upload a txt file containing 81 comma separated integers between 1 to 9. Enter -1 for empty space.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IModal; 