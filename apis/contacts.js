import { connectToDatabase } from "../utilities/mongodb";

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const contacts = await db
          .collection("contacts")
          .find({})
          .toArray();
        const totalCount = await db.collection("contacts").countDocuments();

        res.status(200).json({ contacts, totalCount });
      } catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch contacts" });
      }
      break;
    case "POST":
      try {
        const contact = await db.collection("contacts").insertOne(req.body);
        res.status(201).json(contact);
      } catch (error) {
        res.status(500).json({ error: error.message || "Failed to add contact" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}

