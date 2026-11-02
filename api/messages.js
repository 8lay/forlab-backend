import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(request, response) {
  response.setHeader("Access-Control-Allow-Origin", "https://forlab.me");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (request.method === "OPTIONS") {
    return response.status(204).end();
  }

  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = request.body || {};

  if (!name || !email || !message) {
    return response.status(400).json({ error: "All fields are required." });
  }

  try {
    await client.connect();

    await client
      .db("forlab")
      .collection("messages")
      .insertOne({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        createdAt: new Date()
      });

    return response.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Could not save message." });
  }
}
