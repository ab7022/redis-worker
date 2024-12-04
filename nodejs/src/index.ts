import express from "express";
import { createClient } from "redis";

const app = express();
app.use(express.json());
const client = createClient();

client.on("error", (error) => {
  console.error(error);
});
async function startServer() {
  await client.connect();
  console.log("Connected to Redis");
}
startServer();
app.post("/submit", async (req, res) => {
  const problemId = req.body.problemId;
  const code = req.body.code;
  const language = req.body.language;
  try {
    await client.lPush(
      "problems",
      JSON.stringify({ problemId, code, language })
    );
    res.status(200).send("Code submitted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
