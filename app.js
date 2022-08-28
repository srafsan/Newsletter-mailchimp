require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const first_name = req.body.firstName;
  const last_name = req.body.lastName;
  const email = req.body.email;

  const mcData = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: first_name,
          LNAME: last_name,
        },
      },
    ],
  };

  const mcDataPost = JSON.stringify(mcData);

  const listId = `${process.env.MC_LISTID}`;
  const apiKey = `${process.env.MC_API}`;
  const serverNo = `${process.env.MC_SERVER}`;

  const mcURL = `https://${serverNo}.api.mailchimp.com/3.0/lists/${listId}`;
  const options = {
    url: mcURL,
    method: "POST",
    auth: `rafsan98:${apiKey}`,
  };

  const request = https.request(mcURL, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", (mcData) => {
      // console.log(JSON.parse(mcData));
      console.log("Subscribed successfully.");
    });
  });

  request.write(mcDataPost);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
