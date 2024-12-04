import { createClient } from "redis";
const client = createClient();

client.on("error", (error) => {
  console.error(error);
});

async function problemSubmission(submission: string) {
  const { problemId, code, language } = JSON.parse(submission);
  console.log(`Problem ID: ${problemId}`);
  console.log(`Code: ${code}`);
  console.log(`Language: ${language}`);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log("Finished processing the submission");
}
async function startServer() {
  await client.connect();
  console.log("Connected to Redis");
  while (true) {
    const submission = await client.brPop("problems", 0);
    if (submission) {
      await problemSubmission(submission.element);
    }
  }
}
startServer();
