const Messages = require("../models/Messages");
const multer = require("multer");
require("dotenv").config();
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const bucketAccessKey = process.env.ACCESS_KEY_BUCKET;
const bucketSecretKey = process.env.SECRET_ACCESS_KEY_BUCKET;

const s3 = new S3Client({
  credentials: {
    accessKeyId: bucketAccessKey,
    secretAccessKey: bucketSecretKey,
  },
  region: bucketRegion,
});

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadMessagePhoto = upload.single("file");

exports.resizeMessageImage = async (req, res, next) => {
  req.file.filename = `message-${req.userId}-${Date.now()}.jpeg`;

  const params = {
    Bucket: bucketName,
    Key: req.file.filename,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);

  res.status(200).json({ message: req.file.filename });
};

exports.createMessage = async (req, res) => {
  try {
    const message = await Messages.create(req.body);
    res.status(201).json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const messages = await Messages.find({
      receiver: { $in: [receiverId, req.userId] },
      sender: { $in: [receiverId, req.userId] },
    });
    if (!messages) return res.status(404).json("not found");
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getImage = async (req, res) => {
  try {
    const getObjectParams = {
      Bucket: bucketName,
      Key: req.body.imageName,
    };
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    res.status(200).json({ url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getImages = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const messages = await Messages.find({
      receiver: { $in: [receiverId, req.userId] },
      sender: { $in: [receiverId, req.userId] },
    });
    if (!messages) return res.status(404).json("not found");
    const imagesUrls = [];
    for (const message of messages) {
      if (message.image) {
        const getObjectParams = {
          Bucket: bucketName,
          Key: message.image,
        };
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        imagesUrls.push(url);
      }
    }
    res.status(200).json(imagesUrls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
