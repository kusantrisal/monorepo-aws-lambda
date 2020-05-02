const express = require("express");
const moment = require('moment');
const Joi = require("joi");
const uuid = require('uuid');
const multer = require('multer');
const multerS3 = require('multer-s3-transform');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const resourceRepo = require('../repository/resourceRepo');
const auth = require("../middleware/authInterceptor");
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const router = express.Router();
const s3 = new AWS.S3();

router.put('/makePublic', auth, async (req, res, next) => {
  if (!req.userDate.memberUuid) {
    return next(new Error('Unknown memberUuid'));
  }

  let response = await resourceRepo.updateResourceValue(req.userDate.memberUuid, req.body.resourceUuid, req.body.key, req.body.value == 'true');
  if (!response) {
    return next(new Error('Unable to make resource public'));
  };

  response.Attributes.preSignedUrlForThumbnail = s3.getSignedUrl('getObject', {
    Bucket: response.Attributes.info.transforms.filter(info => info.id == 'thumbnail')[0].bucket,
    Key: response.Attributes.info.transforms.filter(info => info.id == 'thumbnail')[0].key,
    Expires: 60 * 5
  });

  response.Attributes.preSignedUrlForOriginal = s3.getSignedUrl('getObject', {
    Bucket: response.Attributes.info.transforms.filter(info => info.id == 'original')[0].bucket,
    Key: response.Attributes.info.transforms.filter(info => info.id == 'original')[0].key,
    Expires: 60 * 5
  });


  res.send(response.Attributes);

});

router.get("/getResourcesByMemberUuid", auth, async (req, res, next) => {
  // console.log("Get Resources called")
  if (!req.userDate.memberUuid) {
    return next(new Error('Unknown memberUuid'));
  }
  let items = await resourceRepo.getResourcesByMemberUuid(req.userDate.memberUuid);

  if (items.message) {
    return next(new Error(items.message));
  }
  let resources = [];

  items.Items.forEach(res => {
    //  console.log(res.info.originalname);
    //change date to readable format
    //  res.createDate = moment.utc(res.createDate).format("YYYY-MM-DD HH:mm:ss a");
    // res.updatedDate = moment.utc(res.updatedDate).format("YYYY-MM-DD HH:mm:ss a");
    //add preSingedUrl to access private data

    //TODO disabled until we fix the sharp issue
    if (res.info.transforms && res.info.transforms.length > 0) {
      res.preSignedUrlForThumbnail = s3.getSignedUrl('getObject', {
        Bucket: res.info.transforms.filter(info => info.id == 'thumbnail')[0].bucket,
        Key: res.info.transforms.filter(info => info.id == 'thumbnail')[0].key,
        Expires: 60 * 5
      });

      res.preSignedUrlForOriginal = s3.getSignedUrl('getObject', {
        Bucket: res.info.transforms.filter(info => info.id == 'original')[0].bucket,
        Key: res.info.transforms.filter(info => info.id == 'original')[0].key,
        Expires: 60 * 5
      });
    }
    resources.push(res);
  });

  //latest first
  // console.log('Response sent ' + resources.length)
  res.send(resources.sort((a, b) => b.createDate - a.createDate));
});


//will assign resource uuid
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    req.userDate.resourceUuid = uuidv4();
    cb(null, true);
  } else {
    cb(new Error(message.FAIL.invalidImage), false);
  }
};

const uploadThumbNail = multer({
  fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: process.env.MEMBER_RESOURCES || 'zerotoheroquick-member-resources',
    key: function (req, file, cb) {
      cb(null, req.userDate.memberUuid + '/' + req.userDate.resourceUuid + '/original/' + file.originalname); //use Date.now() for unique file keys
    },
    contentType: function (req, file, cb) {
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, 'image/jpeg');
      } else if (file.mimetype === 'video/mp4') {
        cb(null, 'video/mp4');
      } else {
        cb(null, file.mimetype);
      }
    },
    shouldTransform: function (req, file, cb) {
      //where to transform file or not
      cb(null, true);
    },
    transforms: [
      {
        id: 'original',
        key: function (req, file, cb) {
          cb(null, req.userDate.memberUuid + '/' + req.userDate.resourceUuid + '/original/' + file.originalname)
        },
        transform: function (req, file, cb) {
          cb(null, sharp().jpeg({ progressive: true, force: false }));
        }
      },
      {
        id: 'thumbnail',
        key: function (req, file, cb) {
          cb(null, req.userDate.memberUuid + '/' + req.userDate.resourceUuid + '/thumbnail/' + file.originalname)
        },
        transform: function (req, file, cb) {
          cb(null, sharp()
            .resize(500, 300)
            .jpeg())
        }
      }]
  })
});

//create resource
router.post("/addResource", auth, uploadThumbNail.array('image'), async (req, res, next) => {
  let promises = [];
  let responses = [];
  for (const file of req.files) {
    let resource = {};
    let resourceUuid;

    if (file.transforms) {
      resourceUuid = file.transforms[0].key.split('/')[1];
    } else {
      resourceUuid = file.key.split('/')[1];
    }

    //  let fileType = file.transforms[0].key.split('/')[2] || file.key.split('/')[2];
    resource.publicAccess = false
    resource.memberUuid = req.userDate.memberUuid;
    resource.resourceUuid = resourceUuid;
    resource.likes = 0;
    resource.createDate = Date.now();
    resource.info = file
    responses.push(resource);
    promises.concat(resourceRepo.createResource(resource));
  }

  let response = await Promise.all([promises]);

  if (response.message) {
    return next(new Error(response.message));
  }


  responses.forEach(res => {
    if (res.info.transforms && res.info.transforms.length > 0) {
      res.preSignedUrlForThumbnail = s3.getSignedUrl('getObject', {
        Bucket: res.info.transforms.filter(info => info.id == 'thumbnail')[0].bucket,
        Key: res.info.transforms.filter(info => info.id == 'thumbnail')[0].key,
        Expires: 60 * 5
      });

      res.preSignedUrlForOriginal = s3.getSignedUrl('getObject', {
        Bucket: res.info.transforms.filter(info => info.id == 'original')[0].bucket,
        Key: res.info.transforms.filter(info => info.id == 'original')[0].key,
        Expires: 60 * 5
      });
    }
  })
  res.send(responses);

});


router.delete("/deleteResource", auth, async (req, res, next) => {

  let response = await resourceRepo.deleteResource(req.query.resourceUuid, req.userDate.memberUuid);
  let s3Response;
  if (response) {
    let bucket = '';
    let listOfObjects = [];

    if (response.Attributes.info.transforms && response.Attributes.info.transforms.length > 0) {
      response.Attributes.info.transforms.forEach(transform => {
        bucket = transform.bucket;
        listOfObjects.push({ Key: transform.key });
      });
    }
    let params = {
      Bucket: bucket,
      Delete: {
        Objects: listOfObjects
      }
    }
    s3Response = await s3.deleteObjects(params).promise();
  }

  if (s3Response.message) {
    return next(new Error(s3Response.message));
  }

  res.send(response.Attributes);
});

//unused
function validateResource(resource) {
  const now = Date.now();
  const schema = {
    resourceUuid: Joi.string().default(uuid.v4()),
    originalname: Joi.string().required(),
    fileLocation: Joi.object().required(),
    //  thumbnailLocation: Joi.object().required(),
    memberUuid: Joi.string().optional().default('TBD'),
    createDate: Joi.string().optional().default(now),
    updatedDate: Joi.string().optional().default(now)
  };

  return Joi.validate(resource, schema);
}



module.exports = router;
