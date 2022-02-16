module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            trackingNumber: {
                type: String,
                required: true
            },
            img: {
                data: Buffer,
                contentType: String
            }
        },
        { timestamps: true }
    );

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    return mongoose.model("File", schema);
};
