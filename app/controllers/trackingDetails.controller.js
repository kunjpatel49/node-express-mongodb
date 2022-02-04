const db = require("../models");
const TrackingDetails = db.trackingDetails;

// Create and Save a new TrackingDetails
exports.create = (req, res) => {
  // Validate request
  if (!req.body.trackingNumber) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create TrackingDetails
  const tutorial = new TrackingDetails(req.body);

  // Save TrackingDetails in the database
  tutorial
    .save(tutorial)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).json({
        message:
          err.message || "Some error occurred while creating the TrackingDetails."
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  // const title = req.query.title;
  // var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  TrackingDetails.find({})
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

// Find a single TrackingDetails with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  TrackingDetails.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found TrackingDetails with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving TrackingDetails with id=" + id });
    });
};

// Update a TrackingDetails by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  TrackingDetails.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      } else res.send({ message: "TrackingDetails was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating TrackingDetails with id=" + id
      });
    });
};

// Delete a TrackingDetails with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  TrackingDetails.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      } else {
        res.send({
          message: "TrackingDetails was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete TrackingDetails with id=" + id
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  TrackingDetails.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Tutorials were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials."
      });
    });
};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {
  TrackingDetails.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

// Find by tracking number
exports.findByTrackingNumber = (req, res) => {
  TrackingDetails.find({ trackingNumber: req.params.trackingNumber })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
              err.message || "Some error occurred while retrieving tutorials."
        });
      });
};

// Find by tracking number and Upsert
exports.findByTrackingNumberAndUpsert = (req, res) => {
  TrackingDetails.findOneAndUpdate({ trackingNumber: req.body.trackingNumber }, req.body, { upsert: true, new: true })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
              err.message || "Some error occurred while retrieving tutorials."
        });
      });
};

// Find by tracking number and Upsert
exports.findByTrackingNumberAndDelete = (req, res) => {
    const id = req.params.trackingNumber;
    TrackingDetails.findOneAndDelete({trackingNumber: id}, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
                });
            } else {
                res.send({
                    message: "TrackingDetails was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete TrackingDetails with id=" + id
            });
        });
};

// Find by tracking number and Upsert
exports.bulkUpsert = (req, res) => {
    let bulkOps = [ ];
    req.body.forEach(function(item) {
        bulkOps.push({
            updateOne: {
                filter: { trackingNumber: item.trackingNumber },
                update: { '$set': item },
                upsert: true
            }
        });
    });
    TrackingDetails.collection.bulkWrite(bulkOps)
        .then(data => {
            res.status(200).send({
                message: "TrackingDetails upserted successfully!"
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
};

