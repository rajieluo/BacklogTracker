var express = require('express');
var router = express.Router();
var mongo = require('mongodb')
var db;
var MongoClient = mongo.MongoClient;
var uri = "mongodb://localhost:27017/backlog";
var ObjectID = mongo.ObjectID;

MongoClient.connect(uri, function(err, database) {
   if (err) {
      throw err;
   }

   db = database;
});


router.get('/', function(req, res) {
  db.collection('notes').find().toArray(function(err, notes) {
    return res.render('index', {
      title: 'Codeweekend Notes',
      notes: notes
    });
  });
});

router.get('/:id', function(req, res) {
  db.collection('notes').findOne({ _id: ObjectID(req.params.id) }, function(err, note) {
    if (err || !note) {
      req.session.message = 'That note does not exist!';
      return res.redirect('/');
    }

    return res.render('note', {
        note: note
    })
  });
});


router.post('/create', function(req, res) {
  if (!(req.body.title && req.body.body)) {
    req.session.message = 'You must provide a title and a body!';
    return res.redirect('/');
  }

  db.collection('notes').insert({
    title: req.body.title,
    body: req.body.body
  }, function(err, result) {
    req.session.message = 'Note created!';
    return res.redirect('/');
  });
});

module.exports = router;


module.exports = router;
