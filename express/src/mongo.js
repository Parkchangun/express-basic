const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = "mongodb+srv://changeon:0000@cluster0.6ekktot.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const main = async () => {
  await client.connect();

  const users = client.db("fc22").collection("users");
  const cities = client.db("fc22").collection("cities");

  await users.deleteMany({});
  await cities.deleteMany({});

  await cities.insertMany([
    {
      name: "서울",
      population: 1000,
    },
    {
      name: "부산",
      population: 350,
    },
  ]);

  await users.insertMany([
    {
      name: "foo",
      birthYear: 2000,
      contacts: [
        {
          type: "phone",
          number: "+821000001111",
        },
        {
          type: "home",
          number: "+82023334444",
        },
      ],
      city: "서울",
    },
    {
      name: "bar",
      birthYear: 1995,
      contacts: [
        {
          type: "home",
          number: "+82023334442",
        },
      ],
      city: "부산",
    },
    {
      name: "baz",
      birthYear: 2002,
      contacts: [
        {
          type: "phone",
          number: "+821000001111",
        },
      ],
      city: "서울",
    },
    {
      name: "poo",
      birthYear: 1998,
      city: "서울",
    },
  ]);

  // const cursor = users.find({
  //   "contacts.type": "phone",
  // });

  const cursor = users.aggregate([
    {
      $lookup: {
        from: "cities",
        localField: "city",
        foreignField: "name",
        as: "city_info",
      },
    },
    {
      $match: {
        $and: [
          {
            "city_info.population": {
              $gte: 500,
            },
          },
          {
            birthYear: {
              $gte: 2000,
            },
          },
        ],
      },
    },
  ]);

  await cursor.forEach(console.log);

  await client.close();
};

main();
