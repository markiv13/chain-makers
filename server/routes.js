const express = require('express');
const fs = require('fs');
const localPath = __dirname + '/data/';
const router = express.Router();
const timer = 500;

function readJSONFile(path, callback) {
  var ext = '.json';

  function readFile(path) {
    fs.readFile(path, function (err, data) {
      if (err) {
        if (path.indexOf(ext) === -1) {
          readFile(path + ext);
        } else {
          callback(err);
        }
      } else {
        callback(null, JSON.parse(data));
      }
    });
  }

  readFile(localPath + path);
}
//*** Actor ***///
router.get('/cm/graphs/masks', function (req, res) {
  readJSONFile('supply-network/graph/masks', function (err, json) {
    if (err) {
      res.send(404, err);
    } else {
      setTimeout(function () {
        res.status(200).json(json);
      }, timer);
    }
  });
});

module.exports = router;
