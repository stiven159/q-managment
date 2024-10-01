const express = require("express");
const app = express();
const {jwtDecode} = require('jwt-decode');

const mongoose = require("mongoose");
const users = require("./modles/users");
const owners = require("./modles/owners");
const events = require("./modles/events");
const bodyParser = require("body-parser");
const cors = require('cors')
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const port = 5001;

const user = "yehuda";
const pass = "yehuda101123";
const dbUri = `mongodb+srv://${user}:${pass}@cluster0.u59ywcm.mongodb.net/Q-manegment`;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 30000,  // Increase timeout to 30 seconds
  };

app.get("/", (req, res) => {
  res.send(`<a href="/add-user"><h1>Add User</h1></a>
   <a href="/users"><h1>View Users</h1></a>`);
});

app.get("/owners", async (req, res) => {
    const ownersFromDb = await owners.find({objectType:"owner"}).lean();
 res.json(ownersFromDb);
});

app.get("/events/:ownerId", async(req, res) => {
    const {ownerId} = req?.params;
    const {authorization} = req?.headers;
    const jwtToken = authorization?.split(" ")?.[1];
    const decodedToken = jwtDecode(jwtToken);
    const userId = decodedToken?.user_id;
    try {
        const eventsByOwnerId = await events.find({ownerId:ownerId, objectType: "event"}).lean();
        const modifiedEvents = (eventsByOwnerId || []).map(event=>{
            if (event.clientId === userId){
                return event;
            }
            const privateEvent = event;
            delete privateEvent.clientId;
            privateEvent.title = "private";
            return privateEvent;
        })
        res.json(modifiedEvents);
    } catch (e) {
        const errorMsg = `failed to get events for owner ID: ${ownerId}. error: ${e.message}`;
        console.log(errorMsg);
        res.status(500).send(errorMsg);
    }
});

// בודק כמות משתמשים
app.get("/users", async (req, res) => {
  console.log("jkljkjkl");
  users
    .find()
    .then((user) => res.status(200).json(user))
    .catch((err) => res.status(404).json(err));
});

app.post("/events", async (req, res) => {
    //todo add schema validation on body
    const {start,end,clientId,ownerId,title} = req.body;
    const newEvent = new events({
        _id:`${clientId}~${ownerId}~${start}`,
        start,
        end,
        clientId,
        ownerId,
        title,
        objectType:"event"
    })
    try {
        await newEvent.save();
        res.status(200).send("event successfully saved");
    } catch (e) {
        console.error("error saving event" + JSON.stringify(e));
        res.status(500).send("failed to save event: " + e.message);
    }
});

app.delete("/events/:eventId", async (req, res) => {
    //todo add schema validation on body
    const {eventId} = req.params;
    try {
        await events.deleteOne({_id:eventId});
        res.status(204).send("event successfully deleted");
    } catch (e) {
        const errorMsg = `failed to delete event error: ${e.message}`;
        console.error(errorMsg);
        res.status(500).send(errorMsg);
    }
});

app.post("/owners", async (req, res) => {
  try {
    const { name, avatar, description } = req.body;

    // Validating input
    if (!name) {
      return res.status(400).json({ message: "ID and name are required" });
    }

    const newOwner = new owners({
      name,
      avatar,
      objectType: "owner",
      description,
    });

    const savedOwner = await newOwner.save();
    res.status(201).json(savedOwner);
  } catch (error) {
    res.status(400).json({ message: "Error adding owner", error });
    console.log(error)
  }
});


//מוסיף משתמשים חדשים
app.post("/add-user", (req, res) => {
  const name = req.body.name;
  const mail = req.body.mail;
  const cellphone = req.body.cellphone;
  const newUser = new users({
    name,
    mail,
    cellphone: Number(cellphone),
  });
  newUser
    .save()
    .then(() => {
      res.json("user add");
    })
    .catch((err) => {
      res.status(400).json(err);
      console.log("erorr");
    });
});

// מוחק משתמשים
app.delete("/delete-user", (req, res) => {
  users.find().then((user) =>
    res
      .status(200)
      .json("user deleted :", user)
      .catch((err) => res.status(404).json(err))
  );
});

app.listen(port, options , () => {
  console.log(`Server is running on port ${port}`);
  mongoose
    .connect(dbUri)
    .then(() => console.log("connected to database"))
    .catch((err) => console.log("eror", err));
});
