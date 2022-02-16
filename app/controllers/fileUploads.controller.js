const formidable = require('formidable');
const fs = require("fs");
const path = require('path')
const Grid = require("gridfs-stream");
const { MongoClient, ObjectId} = require("mongodb");
const {GridFsStorage} = require("multer-gridfs-storage");
const db = require("../models");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const {connection} = require("mongoose");
const TrackingDetails = db.trackingDetails;
// receive file uploads

exports.receiveFileUploads = (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) {
            res.status(500).json({
                status: 'error',
                message: err
            });
        } else {

            console.log('fields:', fields.trackingNumber);
            // console.log('files:', files);
            console.log('files.trackingNumber:', files.file.originalFilename);

            var oldPath = files.file.filepath;
            var newPath = path.join(__dirname, 'upload/' + files.file.originalFilename)
            var rawData = fs.readFileSync(oldPath)

            // fs.writeFile(newPath, rawData, function(err){
            //     if(err) console.log(err)
            //     // return res.send("Successfully uploaded")
            // })

            // use grid fs to insert file into mongodb
            const storage = new GridFsStorage({
                url: process.env.MONGODB_URI,
                file: (req, file) => {
                    // if (file.mimetype === 'image/png') {
                        return {
                            filename: files.file.originalFilename,
                            trackingNumber: fields.trackingNumber,
                            // bucketName: 'photos'
                        };
                    // } else {
                    //     return null;
                    // }
                }
            });

            let image_id = null;

            const stream = fs.createReadStream(oldPath);
            storage.fromStream(stream, req, oldPath)
                .then((r) => {
                    console.log(r.id)
                    image_id = r.id;
                    // res.status(200).json({
                    //     status: 'success',
                    //     message: 'File uploaded successfully',
                    //     fields: fields,
                    //     files: files
                    // });
                    TrackingDetails.findOneAndUpdate({ trackingNumber: fields.trackingNumber }, { $push: { files: image_id } }, { upsert: true, new: true })
                        .then(data => {
                            // console.log(data)
                            res.send(data);
                        })
                        .catch(err => {
                            console.log(err);
                            // res.status(500).send({
                            //     message:
                            //         err.message || "Some error occurred while retrieving tutorials."
                            // });
                        });
                })
                .catch(() => res.status(500).send('error'));


            // res.status(200).json({
            //     status: 'success',
            //     message: 'File uploaded successfully',
            //     fields: fields,
            //     files: files
            // });
        }
    });
};


exports.getFile = async (req,res) => {

    const filename = req.params.filename;

    var gridfsbucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        // chunkSizeBytes: 1024,
        // bucketName: 'photos'
    });

    const { mongo, connection } = require('mongoose');
    const Grid = require('gridfs-stream');
    Grid.mongo = mongo;

    gridFSBucket = new mongoose.mongo.GridFSBucket(connection.db, {
        bucketName: 'fs'
    });

    let gfs = Grid(connection.db);
    gfs.collection('fs');

    var allChunks=[];
        const readStream = gridFSBucket.openDownloadStream(mongoose.Types.ObjectId(req.params.filename));

    readStream
        .on('data', (chunk) => {
            allChunks=allChunks.concat(chunk);
        })
        .on('error', (err_msg) => {
            console.log(err_msg);
            res.end(err_msg);
        })
        .on('end', (e) => {
            console.log(e);
            var b64URI = 'data:application/octet-stream;base64,' + Buffer.from(allChunks[0]).toString('base64');
            var downloadLink="<a href='"+b64URI+"' download='" + req.params.filename + "' target='_blank'>Download</a>";
            res.send({link: b64URI, filename: req.params.filename});
        })
        .on('close', (e) => {
            console.log('close', e);
        });

};
