const tutorials = require("../controllers/trackingDetails.controller");
module.exports = app => {
  const tutorials = require("../controllers/trackingDetails.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", tutorials.create);

  // Retrieve all Tutorials
  router.get("/", tutorials.findAll);

  // Retrieve all published Tutorials
  router.get("/published", tutorials.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/:id", tutorials.findOne);

  // Update a Tutorial with id
  router.put("/:id", tutorials.update);

  // Delete a Tutorial with id
  router.delete("/:id", tutorials.delete);

  // Create a new Tutorial
  router.delete("/", tutorials.deleteAll);

  // Retrieve a single tracking info with tracking number
  router.get("/findByTrackingNumber/:trackingNumber", tutorials.findByTrackingNumber);

  // Upsert using tracking number
  router.post("/upsertTrackingNumber", tutorials.findByTrackingNumberAndUpsert);

  // Delete using tracking number
  router.delete("/deleteTrackingNumber/:trackingNumber", tutorials.findByTrackingNumberAndDelete);

  // Bulk Upsert using tracking number
  router.post("/bulkUpsert", tutorials.bulkUpsert);

  app.use("/api/tracking_details", router);
};
