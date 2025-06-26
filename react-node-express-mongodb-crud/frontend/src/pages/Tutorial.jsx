import { useState, useEffect } from "react";
import TutorialService from "../services/tutorial.service";
import { toast } from "react-toastify";

function Tutorial({ id, onUpdate }) {
  const [currentTutorial, setCurrentTutorial] = useState({
    id: null,
    title: "",
    description: "",
    published: false,
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({
    title: false,
    description: false,
  });

  useEffect(() => {
    if (id) {
      TutorialService.get(id)
        .then((response) => {
          setCurrentTutorial(response.data);
          setMessage("");
        })
        .catch((e) => {
          console.log(e);
          toast.error("Failed to fetch tutorial.");
        });
    }
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentTutorial({ ...currentTutorial, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {
      title: !currentTutorial.title.trim(),
      description: !currentTutorial.description.trim(),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const updatePublished = (status) => {
    if (!validateForm()) return;

    const data = {
      ...currentTutorial,
      published: status,
    };

    TutorialService.update(currentTutorial.id, data)
      .then(() => {
        setCurrentTutorial({ ...currentTutorial, published: status });
        setMessage("Status updated successfully!");
        toast.success("Publish status updated!");
         if (onUpdate) onUpdate();
      })
      .catch((e) => {
        console.log(e);
        toast.error("Failed to update publish status.");
      });
  };

  const updateTutorial = () => {
    if (!validateForm()) return;

    TutorialService.update(currentTutorial.id, currentTutorial)
      .then(() => {
        setMessage("The tutorial was updated successfully!");
        toast.success("Tutorial updated successfully!");

        if (onUpdate) onUpdate(); // Notify parent to refresh
      })
      .catch((e) => {
        console.log(e);
        toast.error("Failed to update tutorial.");
      });
  };

 

  return (
    <div className="max-w-sm mx-auto p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-xl">Edit Tutorial</h4>
        <button
          className=" text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-400"
          onClick={() => {
            if (onUpdate) onUpdate(); // Close edit form
          }}
          title="Close"
        >
          ❌
        </button>
      </div>

      <div className="mb-2">
        <label className="block font-medium" htmlFor="title">
          Title
        </label>
        <input
          type="text"
          className={`border rounded w-full px-2 py-1 ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
          id="title"
          name="title"
          value={currentTutorial.title}
          onChange={handleInputChange}
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">Title is required</p>
        )}
      </div>

      <div className="mb-2">
        <label className="block font-medium" htmlFor="description">
          Description
        </label>
        <input
          type="text"
          className={`border rounded w-full px-2 py-1 ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
          id="description"
          name="description"
          value={currentTutorial.description}
          onChange={handleInputChange}
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">Description is required</p>
        )}
      </div>

      <div className="mb-2">
        <strong>Status:</strong>{" "}
        {currentTutorial.published ? "Published" : "Pending"}
      </div>

      <div className="space-x-2 mt-2">
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={() => updatePublished(!currentTutorial.published)}
        >
          {currentTutorial.published ? "Unpublish" : "Publish"}
        </button>

    

        <button
          className="bg-green-500 text-white px-3 py-1 rounded"
          onClick={updateTutorial}
        >
          Update
        </button>
      </div>

      {message && <p className="text-green-600 mt-2">{message}</p>}
    </div>
  );
}

export default Tutorial;
