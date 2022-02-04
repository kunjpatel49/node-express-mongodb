module.exports = app => {
  const trackings = require("../controllers/trackingDetails.controller.js");

  var router = require("express").Router();

  // Create a new tracking number
  router.post("/", trackings.create);

  // Retrieve all tracking number
  router.get("/", trackings.findAll);

  // Retrieve all published Tutorials
  // router.get("/published", trackings.findAllPublished);

  // Retrieve a single tracking number with id
  router.get("/:id", trackings.findOne);

  // Update a tracking number with id
  router.put("/:id", trackings.update);

  // Delete a tracking number with id
  router.delete("/:id", trackings.delete);

  // Create a new tracking number
  // router.delete("/", trackings.deleteAll);

  // Retrieve a single tracking info with tracking number
  router.get("/findByTrackingNumber/:trackingNumber", trackings.findByTrackingNumber);

  // Upsert using tracking number
  router.post("/upsertTrackingNumber", trackings.findByTrackingNumberAndUpsert);

  // Delete using tracking number
  router.delete("/deleteTrackingNumber/:trackingNumber", trackings.findByTrackingNumberAndDelete);

  // Bulk Upsert using tracking number
  router.post("/bulkUpsert", trackings.bulkUpsert);

  app.use("/api/tracking_details", router);
};
