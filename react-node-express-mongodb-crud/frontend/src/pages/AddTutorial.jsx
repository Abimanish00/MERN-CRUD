import React, { useState } from "react";
import TutorialService from "../services/tutorial.service";

function AddTutorial() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);

  const saveTutorial = () => {
    const data = { title, description };
    TutorialService.create(data)
      .then((response) => {
        console.log(response.data);
        setSubmitted(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const newTutorial = () => {
    setTitle("");
    setDescription("");
    setSubmitted(false);
  };

  const validateForm = () => {
    let isValid = true;

    if (!title.trim()) {
      setTitleError(true);
      isValid = false;
    }

    if (!description.trim()) {
      setDescriptionError(true);
      isValid = false;
    }

    return isValid;
  };

  return (
    <div className="max-w-sm mx-auto p-4 bg-white rounded shadow">
      {submitted ? (
        <div>
          <h4 className="font-bold text-green-600 mb-4">
            Tutorial submitted successfully!
          </h4>
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={newTutorial}
          >
            Add Another
          </button>
        </div>
      ) : (
        <div>
          <h4 className="font-bold text-xl mb-2">Add Tutorial</h4>

          <div className="mb-2">
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              className={`border rounded w-full px-2 py-1 ${
                titleError ? "border-red-500" : "border-gray-300"
              }`}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setTitleError(false); // Clear error when typing
              }}
            />
            {titleError && (
              <p className="text-red-500 text-xs mt-1">Title is required</p>
            )}
          </div>

          <div className="mb-2">
            <label className="block mb-1 font-medium">Description</label>
            <input
              type="text"
              className={`border rounded w-full px-2 py-1 ${
                descriptionError ? "border-red-500" : "border-gray-300"
              }`}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setDescriptionError(false); // Clear error when typing
              }}
            />
            {descriptionError && (
              <p className="text-red-500 text-xs mt-1">
                Description is required
              </p>
            )}
          </div>

          <button
            className="bg-green-500 text-white px-3 py-1 rounded mt-2"
            onClick={() => {
              if (validateForm()) {
                saveTutorial();
              }
            }}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

export default AddTutorial;
