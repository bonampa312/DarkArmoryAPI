var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var DS3_WEAPONS_COLLECTION = "ds3_weapons";

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


/*  "/ds3/weapons"
 *    GET: finds all ds3 weapons
 *    POST: creates a new ds3 weapons
 */

app.get("/ds3/weapons", function(req, res) {
});

app.post("/ds3/weapons", function(req, res) {
 var newWeapon = req.body
 if (!(newWeapon.name || newWeapon.weight || newWeapon.image_url || newWeapon.description || newWeapon.requeriments.strength || newWeapon.requeriments.dexterity || newWeapon.requeriments.intelligence ||  newWeapon.requeriments.faith)) {
  handleError(res, "Invalid weapon input", "Must provide requeried data.", 400);
 }
 db.collection(DS3_WEAPONS_COLLECTION).insertOne(newWeapon,function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new dark souls 3 weapon.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

/*  "/ds3/weapons/:id"
 *    GET: find ds3 weapon by id
 *    PUT: update ds3 weapon by id
 *    DELETE: deletes ds3 weapon by id
 */

app.get("/ds3/weapons/:id", function(req, res) {
});

app.put("/ds3/weapons/:id", function(req, res) {
});

app.delete("/ds3/weapons/:id", function(req, res) {
});

