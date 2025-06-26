import { useState, useEffect } from "react";
import TutorialService from "../services/tutorial.service";
import { format } from "date-fns";
import "./TutorialsList.css";
import Tutorial from "./Tutorial";
import { toast } from "react-toastify";

function TutorialsList() {
  const [tutorials, setTutorials] = useState([]);
  const [currentTutorial, setCurrentTutorial] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchTitle, setSearchTitle] = useState("");
  const [editTutorialId, setEditTutorialId] = useState(null);
  const [tutorialToDelete, setTutorialToDelete] = useState(null);
  const [showRemoveAllModal, setShowRemoveAllModal] = useState(false);

  useEffect(() => {
    retrieveTutorials();
  }, []);

  const onChangeSearchTitle = (e) => {
    let value = e.target.value;

    // Remove leading spaces
    if (value.startsWith(" ")) {
      value = value.trimStart();
    }

    setSearchTitle(value);
    findByTitle(value);
  };

  const findByTitle = (title) => {
    TutorialService.findByTitle(title)
      .then((response) => {
        setTutorials(response.data);
        setCurrentTutorial(null);
        setCurrentIndex(-1);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const retrieveTutorials = () => {
    TutorialService.getAll()
      .then((response) => {
        setTutorials(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveTutorials();
    setCurrentTutorial(null);
    setCurrentIndex(-1);
  };

  const setActiveTutorial = (tutorial, index) => {
    setCurrentTutorial(tutorial);
    setCurrentIndex(index);
  };

  const confirmRemoveAllTutorials = () => {
    TutorialService.removeAll()
      .then((response) => {
        console.log(response.data);
        refreshList();
        toast.success("All tutorials have been removed successfully!");
      })
      .catch((e) => {
        console.log(e);
        toast.error("Failed to remove tutorials.");
      });
    setShowRemoveAllModal(false); // Close the modal
  };

  const confirmDeleteTutorial = () => {
    if (!tutorialToDelete) return;

    TutorialService.remove(tutorialToDelete.id)
      .then((response) => {
        console.log(response.data);
        retrieveTutorials();
        setCurrentTutorial(null);
        setCurrentIndex(-1);
        toast.success("Tutorial Deleted Successfully");
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setTutorialToDelete(null); // Close the modal
      });
  };

  return (
    <div className="tutorials-container">
      <div className="tutorials-list-section">
        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search by title"
            value={searchTitle}
            onChange={onChangeSearchTitle}
          />

          <button
            className="search-button"
            onClick={() => findByTitle(searchTitle)}
          >
            Search
          </button>
        </div>

        {/* Title */}
        <div className="header-row">
          <h4 className="section-title">Tutorials List</h4>
          <button
            className="remove-all-button"
            onClick={() => setShowRemoveAllModal(true)}
          >
            Remove All
          </button>
        </div>
        {/* Table */}

        {!editTutorialId && (
          <div className="table-container">
            <table className="tutorials-table">
              <thead className="table-head">
                <tr>
                  <th>S.no</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tutorials &&
                  tutorials.map((tutorial, index) => (
                    <tr
                      key={index}
                      className={index === currentIndex ? "active-row" : ""}
                      onClick={() => setActiveTutorial(tutorial, index)}
                    >
                      <td>{index + 1}</td>
                      <td className="title-cell">{tutorial.title}</td>
                      <td className="description-cell">
                        {tutorial.description}
                      </td>
                      <td className="date-cell">
                        {format(
                          new Date(tutorial.updatedAt),
                          "MMM dd, yyyy hh:mm a"
                        )}
                      </td>
                      <td className="status-cell">
                        <span
                          className={`status-badge ${
                            tutorial.published ? "published" : "pending"
                          }`}
                        >
                          {tutorial.published ? "Published" : "Pending"}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditTutorialId(tutorial.id);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTutorialToDelete(tutorial); // set the tutorial to be deleted
                          }}
                          className="delete-button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Remove All Button */}
      </div>

      {/* Edit Form Below List */}
      {editTutorialId && (
        <div className="mt-8">
          <Tutorial
            id={editTutorialId}
            onUpdate={() => {
              retrieveTutorials(); // Refresh table
              setEditTutorialId(null); // Hide form
            }}
          />
        </div>
      )}
      {tutorialToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p className="modal-text">
              Are you sure you want to delete{" "}
              <strong>{tutorialToDelete.title}</strong>?
            </p>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={confirmDeleteTutorial}>
                Yes
              </button>
              <button
                className="cancel-btn"
                onClick={() => setTutorialToDelete(null)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {showRemoveAllModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p className="modal-text">
              Are you sure you want to remove all tutorials? This action cannot
              be undone.
            </p>
            <div className="modal-actions">
              <button
                className="confirm-btn"
                onClick={confirmRemoveAllTutorials}
              >
                Yes
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowRemoveAllModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TutorialsList;
