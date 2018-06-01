var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var DS_WEAPONS_COLLECTION = "weapons";
var DS_RINGS_COLLECTION = "rings";
var DS_ARMORS_COLLECTION = "armors";
var DS_SPELLS_COLLECTION = "spells";
var DS_MISCS_COLLECTION = "miscs";

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
  db.collection(DS_WEAPONS_COLLECTION).
  find({game: "1"}).
  project({"_id":1, "name":1, "image_url":1,"weight":1,"base_damage":1,"requirements":1}).
  toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 1 weapons.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.get("/ds2/weapons", function(req, res) {
  db.collection(DS_WEAPONS_COLLECTION).
  find({game: "2"}).
  project({"_id":1, "name":1, "image_url":1,"weight":1,"base_damage":1,"requirements":1}).
  toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 2 weapons.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.get("/ds3/weapons", function(req, res) {
  db.collection(DS_WEAPONS_COLLECTION).
  find({game: "3"}).
  project({"_id":1, "name":1, "image_url":1,"weight":1,"base_damage":1,"requirements":1}).
  toArray(function(err, docs) {
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
  newWeapon["game"] = "1"
  db.collection(DS_WEAPONS_COLLECTION).insertOne(newWeapon,function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new dark souls 1 weapon.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

app.post("/ds2/weapons", function(req, res) {
  var newWeapon = req.body
  if (!validatePostWeaponsFields(newWeapon) || !(newWeapon.base_damage.dark || newWeapon.defenses.dark)) {
    handleError(res, "Invalid weapon input", "Must provide requeried data for ds2 weapon.", 400);
  }
  newWeapon["game"] = "2"
  db.collection(DS_WEAPONS_COLLECTION).insertOne(newWeapon,function(err, doc) {
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
  newWeapon["game"] = "3"
  db.collection(DS_WEAPONS_COLLECTION).insertOne(newWeapon,function(err, doc) {
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
  db.collection(DS_WEAPONS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 1 weapon");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.get("/ds2/weapons/:id", function(req, res) {
  db.collection(DS_WEAPONS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 2 weapon");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.get("/ds3/weapons/:id", function(req, res) {
  db.collection(DS_WEAPONS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
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

  db.collection(DS_WEAPONS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
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

  db.collection(DS_WEAPONS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
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

  db.collection(DS_WEAPONS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update dark souls 3 weapon");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/ds1/weapons/:id", function(req, res) {
    db.collection(DS_WEAPONS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete dark souls 1 weapon");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/ds2/weapons/:id", function(req, res) {
    db.collection(DS_WEAPONS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete dark souls 2 weapon");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/ds3/weapons/:id", function(req, res) {
    db.collection(DS_WEAPONS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
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
  find({game: "2"}).
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
  find({game: "3"}).
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
   handleError(res, "Invalid ring input", "Must provide requeried data for ds1 ring.", 400);
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
    handleError(res, "Invalid ring input", "Must provide requeried data for ds2 ring.", 400);
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
    handleError(res, "Invalid ring input", "Must provide requeried data for ds3 ring.", 400);
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
 *            ARMORS
*/

/*
 *    GET: finds all armors
 *    POST: creates a new armor
 *
 *    Dark Souls 1: "/ds1/armors"
 *    Dark Souls 2: "/ds2/armors"
 *    Dark Souls 3: "/ds3/armors"
*/

app.get("/ds1/armors", function(req, res) {
  db.collection(DS_ARMORS_COLLECTION).
  find({game: "1"}).
  project({"_id":1, "name":1, "image_url":1, "defenses":1, "physical_defenses":1, "type":1, "weight":1}).
  toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 1 armors.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.get("/ds2/armors", function(req, res) {
  db.collection(DS_ARMORS_COLLECTION).
  find({game: "2"}).
  project({"_id":1, "name":1, "image_url":1,"defenses":1, "physical_defenses":1, "type":1, "weight":1}).
  toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 2 armors.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.get("/ds3/armors", function(req, res) {
  db.collection(DS_ARMORS_COLLECTION).
  find({game: "3"}).
  project({"_id":1, "name":1, "image_url":1,"defenses":1, "physical_defenses":1, "type":1, "weight":1}).
  toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 3 armors.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/ds1/armors", function(req, res) {
  var newArmor = req.body
  if (!validatePostArmorsFields(newArmor)) {
   handleError(res, "Invalid armor input", "Must provide requeried data for ds1 armor.", 400);
  }
  newArmor["game"] = "1"
  db.collection(DS_ARMORS_COLLECTION).insertOne(newArmor,function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new dark souls 1 armor.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

app.post("/ds2/armors", function(req, res) {
  var newArmor = req.body
  if (!validatePostArmorsFields(newArmor) || !(newArmor.defenses.dark)) {
    handleError(res, "Invalid armor input", "Must provide requeried data for ds2 armor.", 400);
  }
  newArmor["game"] = "2"
  db.collection(DS_ARMORS_COLLECTION).insertOne(newArmor,function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new dark souls 2 armor.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

app.post("/ds3/armors", function(req, res) {
  var newArmor = req.body
  if (!validatePostArmorsFields(newArmor) || !(newArmor.resistances.frost || newArmor.defenses.dark)) {
    handleError(res, "Invalid armor input", "Must provide requeried data for ds3 armor.", 400);
  }
  newArmor["game"] = "3"
  db.collection(DS_ARMORS_COLLECTION).insertOne(newArmor,function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new dark souls 3 armor.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

/*
 *    GET(by ID): finds a armor by id
 *    PUT: update a armor by id
 *    DELETE: deletes a armor by id
 *
 *    Dark Souls 1: "/ds1/armors/:id"
 *    Dark Souls 2: "/ds2/armors/:id"
 *    Dark Souls 3: "/ds3/armors/:id"
 */

app.get("/ds1/armors/:id", function(req, res) {
  db.collection(DS_ARMORS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 1 armor");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.get("/ds2/armors/:id", function(req, res) {
  db.collection(DS_ARMORS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 2 armor");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.get("/ds3/armors/:id", function(req, res) {
  db.collection(DS_ARMORS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 3 armor");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/ds1/armors/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(DS_ARMORS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update dark souls 1 armor");
    } else {
      res.status(204).end();
    }
  });
});

app.put("/ds2/armors/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(DS_ARMORS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update dark souls 2 armor");
    } else {
      res.status(204).end();
    }
  });
});

app.put("/ds3/armors/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(DS_ARMORS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update dark souls 3 armor");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/ds1/armors/:id", function(req, res) {
    db.collection(DS_ARMORS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete dark souls 1 armor");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/ds2/armors/:id", function(req, res) {
    db.collection(DS_ARMORS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete dark souls 2 armor");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/ds3/armors/:id", function(req, res) {
    db.collection(DS_ARMORS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete dark souls 3 armor");
    } else {
      res.status(204).end();
    }
  });
});

/*
 *            SPELLS
*/

/*
 *    GET: finds all spells
 *    POST: creates a new spell
 *
 *    Dark Souls 1: "/ds1/spells"
 *    Dark Souls 2: "/ds2/spells"
 *    Dark Souls 3: "/ds3/spells"
*/

app.get("/ds1/spells", function(req, res) {
  db.collection(DS_SPELLS_COLLECTION).
  find({game: "1"}).
  project({"_id":1, "name":1, "image_url":1,"spell_type":1,"slots":1,"uses":1,"requirements":1}).
  toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 1 spells.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.get("/ds2/spells", function(req, res) {
  db.collection(DS_SPELLS_COLLECTION).
  find({game: "2"}).
  project({"_id":1, "name":1, "image_url":1,"spell_type":1,"slots":1,"uses":1,"requirements":1}).
  toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 2 spells.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.get("/ds3/spells", function(req, res) {
  db.collection(DS_SPELLS_COLLECTION).
  find({game: "3"}).
  project({"_id":1, "name":1, "image_url":1,"spell_type":1,"slots":1,"focus_points":1,"requirements":1}).
  toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 3 spells.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/ds1/spells", function(req, res) {
  var newSpell = req.body
  if (!validatePostSpellsFields(newSpell) || !(newSpell.uses)) {
   handleError(res, "Invalid spell input", "Must provide requeried data for ds1 spell.", 400);
  }
  newSpell["game"] = "1"
  db.collection(DS_SPELLS_COLLECTION).insertOne(newSpell,function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new dark souls 1 spell.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

app.post("/ds2/spells", function(req, res) {
  var newSpell = req.body
  if (!validatePostSpellsFields(newSpell) || !(newSpell.uses)) {
    handleError(res, "Invalid spell input", "Must provide requeried data for ds2 spell.", 400);
  }
  newSpell["game"] = "2"
  db.collection(DS_SPELLS_COLLECTION).insertOne(newSpell,function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new dark souls 2 spell.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

app.post("/ds3/spells", function(req, res) {
  var newSpell = req.body
  if (!validatePostSpellsFields(newSpell) || !(newSpell.focus_points)) {
  handleError(res, "Invalid spell input", "Must provide requeried data for ds3 spell.", 400);
  }
  newSpell["game"] = "3"
  db.collection(DS_SPELLS_COLLECTION).insertOne(newSpell,function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new dark souls 3 spell.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

/*
 *    GET(by ID): finds a spell by id
 *    PUT: update a spell by id
 *    DELETE: deletes a spell by id
 *
 *    Dark Souls 1: "/ds1/spells/:id"
 *    Dark Souls 2: "/ds2/spells/:id"
 *    Dark Souls 3: "/ds3/spells/:id"
 */

app.get("/ds1/spells/:id", function(req, res) {
  db.collection(DS_SPELLS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 1 spell");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.get("/ds2/spells/:id", function(req, res) {
  db.collection(DS_SPELLS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 2 spell");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.get("/ds3/spells/:id", function(req, res) {
  db.collection(DS_SPELLS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 3 spell");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/ds1/spells/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(DS_SPELLS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update dark souls 1 spell");
    } else {
      res.status(204).end();
    }
  });
});

app.put("/ds2/spells/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(DS_SPELLS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update dark souls 2 spell");
    } else {
      res.status(204).end();
    }
  });
});

app.put("/ds3/spells/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(DS_SPELLS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update dark souls 3 spell");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/ds1/spells/:id", function(req, res) {
    db.collection(DS_SPELLS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete dark souls 1 spell");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/ds2/spells/:id", function(req, res) {
    db.collection(DS_SPELLS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete dark souls 2 spell");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/ds3/spells/:id", function(req, res) {
    db.collection(DS_SPELLS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete dark souls 3 spell");
    } else {
      res.status(204).end();
    }
  });
});

/*
 *            MISCS
*/

/*
 *    GET: finds all miscs
 *    POST: creates a new misc
 *
 *    Dark Souls 1: "/ds1/miscs"
 *    Dark Souls 2: "/ds2/miscs"
 *    Dark Souls 3: "/ds3/miscs"
*/

app.get("/ds1/miscs", function(req, res) {
  db.collection(DS_MISCS_COLLECTION).
  find({game: "1"}).
  project({"_id":1, "name":1, "image_url":1}).
  toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 1 miscs.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.get("/ds2/miscs", function(req, res) {
  db.collection(DS_MISCS_COLLECTION).
  find({game: "2"}).
  project({"_id":1, "name":1, "image_url":1}).
  toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 2 miscs.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.get("/ds3/miscs", function(req, res) {
  db.collection(DS_MISCS_COLLECTION).
  find({game: "3"}).
  project({"_id":1, "name":1, "image_url":1}).
  toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 3 miscs.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/ds1/miscs", function(req, res) {
  var newMisc = req.body
  if (!validatePostMiscsFields(newMisc)) {
   handleError(res, "Invalid misc input", "Must provide requeried data for ds1 misc.", 400);
  }
  newMisc["game"] = "1"
  db.collection(DS_MISCS_COLLECTION).insertOne(newMisc,function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new dark souls 1 misc.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

app.post("/ds2/miscs", function(req, res) {
  var newMisc = req.body
  if (!validatePostMiscsFields(newMisc)) {
    handleError(res, "Invalid misc input", "Must provide requeried data for ds2 misc.", 400);
  }
  newMisc["game"] = "2"
  db.collection(DS_MISCS_COLLECTION).insertOne(newMisc,function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new dark souls 2 misc.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

app.post("/ds3/miscs", function(req, res) {
  var newMisc = req.body
  if (!validatePostMiscsFields(newMisc)) {
  handleError(res, "Invalid misc input", "Must provide requeried data for ds3 misc.", 400);
  }
  newMisc["game"] = "3"
  db.collection(DS_MISCS_COLLECTION).insertOne(newMisc,function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new dark souls 3 misc.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

/*
 *    GET(by ID): finds a misc by id
 *    PUT: update a misc by id
 *    DELETE: deletes a misc by id
 *
 *    Dark Souls 1: "/ds1/miscs/:id"
 *    Dark Souls 2: "/ds2/miscs/:id"
 *    Dark Souls 3: "/ds3/miscs/:id"
 */

app.get("/ds1/miscs/:id", function(req, res) {
  db.collection(DS_MISCS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 1 misc");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.get("/ds2/miscs/:id", function(req, res) {
  db.collection(DS_MISCS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 2 misc");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.get("/ds3/miscs/:id", function(req, res) {
  db.collection(DS_MISCS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get dark souls 3 misc");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/ds1/miscs/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(DS_MISCS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update dark souls 1 misc");
    } else {
      res.status(204).end();
    }
  });
});

app.put("/ds2/miscs/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(DS_MISCS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update dark souls 2 misc");
    } else {
      res.status(204).end();
    }
  });
});

app.put("/ds3/miscs/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(DS_MISCS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update dark souls 3 misc");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/ds1/miscs/:id", function(req, res) {
    db.collection(DS_MISCS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete dark souls 1 misc");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/ds2/miscs/:id", function(req, res) {
    db.collection(DS_MISCS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete dark souls 2 misc");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/ds3/miscs/:id", function(req, res) {
    db.collection(DS_MISCS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete dark souls 3 misc");
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
    newWeapon.requirements.strength ||
    newWeapon.requirements.dexterity ||
    newWeapon.requirements.intelligence ||
    newWeapon.requirements.faith ||
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

function validatePostArmorsFields(newArmor) {
  if(!(newArmor.name ||
    newArmor.weight ||
    newArmor.description ||
    newArmor.image_url ||
    newArmor.locations ||
    newArmor.poise ||
    newArmor.effect ||
    newArmor.type ||
    newArmor.resistances.bleed ||
    newArmor.resistances.poison ||
    newArmor.resistances.curse ||
    newArmor.physical_defenses.slash ||
    newArmor.physical_defenses.strike ||
    newArmor.physical_defenses.thrust ||
    newArmor.defenses.physical ||
    newArmor.defenses.magic ||
    newArmor.defenses.lightning ||
    newArmor.defenses.fire)) {
      return false
    } else {
      return true
    }
}
º
function validatePostSpellsFields(newSpell) {
  if(!(newSpell.name ||
    newSpell.spell_type ||
    newSpell.description ||
    newSpell.image_url ||
    newSpell.locations ||
    newSpell.slots ||
    newSpell.requirements.strength ||
    newSpell.requirements.dexterity ||
    newSpell.requirements.intelligence ||
    newSpell.requirements.faith
    )) {
      return false
    } else {
      return true
    }
}

function validatePostMiscsFields(newMisc) {
  if(!(newMisc.name ||
    newMisc.description ||
    newMisc.image_url ||
    newMisc.locations ||
    newMisc.effects
    )) {
      return false
    } else {
      return true
    }
}
