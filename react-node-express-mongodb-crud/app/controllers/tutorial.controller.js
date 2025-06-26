import db from "../models/index.js";
 
const Tutorial = db.tutorials;
 
// Create and Save a new Tutorial
export const create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }
 
    // Create a Tutorial
    const tutorial = new Tutorial({
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false,
    });
 
    // Save Tutorial in the database
    tutorial
        .save(tutorial)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Tutorial.",
            });
        });
};
 
// Retrieve all Tutorials
export const findAll = (req, res) => {
    // Allow a filter condition via query parameter
    const title = req.query.title;
    const condition = title
  ? { title: { $regex: new RegExp(title, "i") } }
  : {};

 
    Tutorial.find(condition)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials.",
            });
        });
};
 
// Find a single Tutorial by ID
export const findOne = (req, res) => {
    const id = req.params.id;
 
    // Find Tutorial by primary key
    Tutorial.findById(id)
        .then((data) => {
            if (!data)
                res.status(404).send({ message: "Not found Tutorial with id " + id });
            else res.send(data);
        })
        .catch((err) => {
            res.status(500).send({ message: "Error retrieving Tutorial with id=" + id });
        });
};
 
// Update a Tutorial by ID
export const update = (req, res) => {
    const id = req.params.id;
 
    // Update the Tutorial with the specified ID
    Tutorial.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`,
                });
            } else res.send({ message: "Tutorial was updated successfully." });
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error updating Tutorial with id=" + id,
            });
        });
};
 
// Delete a Tutorial by ID
export const deleteOne = (req, res) => {
    const id = req.params.id;
 
    // Delete the Tutorial with the specified ID
    Tutorial.findByIdAndDelete(id)
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`,
                });
            } else {
                res.send({
                    message: "Tutorial was deleted successfully!",
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Could not delete Tutorial with id=" + id,
            });
        });
};


 
// Delete all Tutorials
export const deleteAll = (req, res) => {
    // Delete all Tutorials
    Tutorial.deleteMany({})
        .then((data) => {
            res.send({
                message: `${data.deletedCount} Tutorials were deleted successfully!`,
            });
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials.",
            });
        });
};
 
// Find all published Tutorials
export const findAllPublished = (req, res) => {
    // Find all Tutorials with published = true
    Tutorial.find({ published: true })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials.",
            });
        });
};