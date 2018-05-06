var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var DS1_WEAPONS_COLLECTION = "ds1_weapons";
var DS2_WEAPONS_COLLECTION = "ds2_weapons";
var DS3_WEAPONS_COLLECTION = "ds3_weapons";
var DS_RINGS_COLLECTION = "rings";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// Endpoints

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*
 *            WEAPONS
*/

/*
 *    GET: finds all weapons
 *    POST: creates a new weapon
 * 
 *    Dark Souls 1: "/ds1/weapons"
 *    Dark Souls 2: "/ds2/weapons"
 *    Dark Souls 3: "/ds3/weapons"
*/

app.get("/ds1/weapons", function(req, res) {
  db.collection(DS1_WEAPONS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 1 weapons.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.get("/ds2/weapons", function(req, res) {
  db.collection(DS2_WEAPONS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 2 weapons.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.get("/ds3/weapons", function(req, res) {
  db.collection(DS3_WEAPONS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 3 weapons.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/ds1/weapons", function(req, res) {
  var newWeapon = req.body
  if (!validatePostWeaponsFields(newWeapon)) {
   handleError(res, "Invalid weapon input", "Must provide requeried data for ds1 weapon.", 400);
  }
  db.collection(DS1_WEAPONS_COLLECTION).insertOne(newWeapon,function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new dark souls 1 weapon.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

app.post("/ds2/weapons", function(req, res) {
  var newWeapon = req.body
  if (!validatePostWeaponsFields(newWeapon) || !(newWeapon.effect || newWeapon.base_damage.dark || newWeapon.defenses.dark)) {
    handleError(res, "Invalid weapon input", "Must provide requeried data for ds2 weapon.", 400);
  }
  db.collection(DS2_WEAPONS_COLLECTION).insertOne(newWeapon,function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new dark souls 2 weapon.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

app.post("/ds3/weapons", function(req, res) {
  var newWeapon = req.body
  if (!validatePostWeaponsFields(newWeapon) || !(newWeapon.skill.name || newWeapon.skill.description || newWeapon.base_damage.dark || newWeapon.aditional_damage.bleed || newWeapon.aditional_damage.poison || newWeapon.aditional_damage.frost || newWeapon.defenses.dark)) {
  handleError(res, "Invalid weapon input", "Must provide requeried data for ds3 weapon.", 400);
  }
  db.collection(DS3_WEAPONS_COLLECTION).insertOne(newWeapon,function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new dark souls 3 weapon.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

/*
 *    GET(by ID): finds a weapon by id
 *    PUT: update a weapon by id
 *    DELETE: deletes a weapon by id
 * 
 *    Dark Souls 1: "/ds1/weapons/:id"
 *    Dark Souls 2: "/ds2/weapons/:id"
 *    Dark Souls 3: "/ds3/weapons/:id"
 */

app.get("/ds1/weapons/:id", function(req, res) {
  db.collection(DS1_WEAPONS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 1 weapon");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.get("/ds2/weapons/:id", function(req, res) {
  db.collection(DS2_WEAPONS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 2 weapon");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.get("/ds3/weapons/:id", function(req, res) {
  db.collection(DS3_WEAPONS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 3 weapon");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/ds1/weapons/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(DS1_WEAPONS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update dark souls 1 weapon");
    } else {
      res.status(204).end();
    }
  });
});

app.put("/ds2/weapons/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(DS2_WEAPONS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update dark souls 2 weapon");
    } else {
      res.status(204).end();
    }
  });
});

app.put("/ds3/weapons/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(DS3_WEAPONS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update dark souls 3 weapon");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/ds1/weapons/:id", function(req, res) {
    db.collection(DS1_WEAPONS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete dark souls 1 weapon");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/ds2/weapons/:id", function(req, res) {
    db.collection(DS2_WEAPONS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete dark souls 2 weapon");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/ds3/weapons/:id", function(req, res) {
    db.collection(DS3_WEAPONS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete dark souls 3 weapon");
    } else {
      res.status(204).end();
    }
  });
});

/*
 *            RINGS
*/

/*
 *    GET: finds all rings
 *    POST: creates a new ring
 * 
 *    Dark Souls 1: "/ds1/rings"
 *    Dark Souls 2: "/ds2/rings"
 *    Dark Souls 3: "/ds3/rings"
*/

app.get("/ds1/rings", function(req, res) {
  db.collection(DS_RINGS_COLLECTION).
  find({game: "1"}).
  project({"_id":1, "name":1, "image_url":1,"weight":1}).
  toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 1 rings.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.get("/ds2/rings", function(req, res) {
  db.collection(DS_RINGS_COLLECTION).
  find({game: "1"}).
  project({"_id":1, "name":1, "image_url":1,"weight":1}).
  toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 2 rings.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.get("/ds3/rings", function(req, res) {
  db.collection(DS_RINGS_COLLECTION).
  find({game: "1"}).
  project({"_id":1, "name":1, "image_url":1,"weight":1}).
  toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 3 rings.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/ds1/rings", function(req, res) {
  var newRing = req.body
  if (!validatePostRingsFields(newRing)) {
   handleError(res, "Invalid weapon input", "Must provide requeried data for ds1 ring.", 400);
  }
  newRing["game"] = "1"
  db.collection(DS_RINGS_COLLECTION).insertOne(newRing,function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new dark souls 1 ring.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

app.post("/ds2/rings", function(req, res) {
  var newRing = req.body
  if (!validatePostRingsFields(newRing)) {
    handleError(res, "Invalid weapon input", "Must provide requeried data for ds2 ring.", 400);
  }
  newRing["game"] = "2"
  db.collection(DS_RINGS_COLLECTION).insertOne(newRing,function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new dark souls 2 ring.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

app.post("/ds3/rings", function(req, res) {
  var newRing = req.body
  if (!validatePostRingsFields(newRing)) {
    handleError(res, "Invalid weapon input", "Must provide requeried data for ds3 ring.", 400);
  }
  newRing["game"] = "3"
  db.collection(DS_RINGS_COLLECTION).insertOne(newRing,function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new dark souls 3 ring.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

/*
 *    GET(by ID): finds a ring by id
 *    PUT: update a ring by id
 *    DELETE: deletes a ring by id
 * 
 *    Dark Souls 1: "/ds1/rings/:id"
 *    Dark Souls 2: "/ds2/rings/:id"
 *    Dark Souls 3: "/ds3/rings/:id"
 */

app.get("/ds1/rings/:id", function(req, res) {
  db.collection(DS_RINGS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 1 ring");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.get("/ds2/rings/:id", function(req, res) {
  db.collection(DS_RINGS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 2 ring");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.get("/ds3/rings/:id", function(req, res) {
  db.collection(DS_RINGS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 3 ring");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/ds1/rings/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(DS_RINGS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update dark souls 1 ring");
    } else {
      res.status(204).end();
    }
  });
});

app.put("/ds2/rings/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(DS_RINGS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update dark souls 2 ring");
    } else {
      res.status(204).end();
    }
  });
});

app.put("/ds3/rings/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(DS_RINGS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update dark souls 3 ring");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/ds1/rings/:id", function(req, res) {
    db.collection(DS_RINGS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete dark souls 1 ring");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/ds2/rings/:id", function(req, res) {
    db.collection(DS_RINGS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete dark souls 2 ring");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/ds3/rings/:id", function(req, res) {
    db.collection(DS_RINGS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete dark souls 3 ring");
    } else {
      res.status(204).end();
    }
  });
});

/*
 *
 *  Validations
 * 
 */

function validatePostRingsFields(newRing) {
  if (!(
    newRing.name ||
    newRing.image_url ||
    newRing.location ||
    newRing.weight ||
    newRing.description ||
    newRing.effect
  )) {
    return false
  } else {
    return true
  }
}

function validatePostWeaponsFields(newWeapon) {
  if(!(newWeapon.name ||
    newWeapon.weapon_type ||
    newWeapon.weight ||
    newWeapon.description ||
    newWeapon.image_url ||
    newWeapon.locations ||
    newWeapon.stability ||
    newWeapon.attack_type ||
    newWeapon.critical ||
    newWeapon.base_damage.physical ||
    newWeapon.base_damage.magic ||
    newWeapon.base_damage.lightning ||
    newWeapon.base_damage.fire ||
    newWeapon.requeriments.strength ||
    newWeapon.requeriments.dexterity ||
    newWeapon.requeriments.intelligence ||
    newWeapon.requeriments.faith ||
    newWeapon.bonuses.strength ||
    newWeapon.bonuses.dexterity ||
    newWeapon.bonuses.intelligence ||
    newWeapon.bonuses.faith ||
    newWeapon.defenses.physical ||
    newWeapon.defenses.magic ||
    newWeapon.defenses.lightning ||
    newWeapon.defenses.fire)) {
      return false
    } else {
      return true
    }
}
