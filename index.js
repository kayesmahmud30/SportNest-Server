const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const express = require("express");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");
const Port = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

app.listen(Port, () => {
  console.log(`server Running on ${Port}`);
});

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.CLIENT_URL}/api/auth/jwks`),
);

const verify = async (req, res, next) => {
  const header = req?.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = header.split(" ")[1];

  if (!token) {
    console.log("Invalid scheme or empty token");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { payload } = await jwtVerify(token, JWKS);
    next();
  } catch (error) {
    console.error("JWT Verification failed Error Details:", error.message);
    return res.status(403).json({ message: "Forbidden" });
  }
};

app.get("/", (req, res) => {
  res.send("Server Is Running Fine");
});

async function run() {
  try {
    // await client.connect();

    const db = client.db("sportnest");
    const db_col = db.collection("facilities_data");
    const db_col_2 = db.collection("bookings");

    app.post("/facility", async (req, res) => {
      const facilityData = req.body;
      const result = await db_col.insertOne(facilityData);

      res.send(result);
    });

    app.get("/facility", async (req, res) => {
      try {
        const { search, sport, ownerEmail } = req.query;

        let query = {};

        if (search) {
          query.facilityName = {
            $regex: search,
            $options: "i",
          };
        }

        if (sport && sport !== "All Facilities") {
          const sportFilter = Array.isArray(sport) ? sport : [sport];

          query.facilityType = {
            $in: sportFilter,
          };
        }

        if (ownerEmail) {
          query.ownerEmail = ownerEmail;
        }

        const result = await db_col.find(query).toArray();

        res.send(result);
      } catch (error) {
        console.error(error);

        res.status(500).send({
          message: "Internal Server Error",
        });
      }
    });

    app.get("/facility/:id", verify, async (req, res) => {
      const { id } = req.params;
      const result = await db_col.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.patch("/facility/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;

      const result = await db_col.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData },
      );

      res.send(result);
    });

    app.delete("/facility/:id", verify, async (req, res) => {
      const id = req.params.id;

      const result = await db_col.deleteOne({
        _id: new ObjectId(id),
      });

      res.send(result);
    });

    // for my Bookings

    app.post("/bookings", verify, async (req, res) => {
      const bookingData = req.body;
      const result = await db_col_2.insertOne(bookingData);
      res.send(result);
    });

    app.get("/bookings/:userId", verify, async (req, res) => {
      const { userId } = req.params;

      const result = await db_col_2.find({ user_id: userId }).toArray();
      res.send(result);
    });

    app.delete("/bookings/:bookingId", verify, async (req, res) => {
      const { bookingId } = req.params;
      const result = await db_col_2.deleteOne({ _id: new ObjectId(bookingId) });
      res.send(result);
    });
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);
