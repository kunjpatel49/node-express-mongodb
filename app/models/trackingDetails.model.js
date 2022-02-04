module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
        trackingNumber: {
            type: String,
            required: true
        },
        origin: {
            type: String,
            required: true
        },
        destination: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        },
        latestScanLocation: {
            type: String,
            required: true
        },
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  return mongoose.model("TrackingDetails", schema);
};
