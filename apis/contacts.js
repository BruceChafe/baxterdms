import { connectToDatabase } from "../utilities/mongodb";

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const page = parseInt(req.query.page, 10) || 0;
        const limit = parseInt(req.query.limit, 10) || 10;

        const contacts = await db
          .collection("contacts")
          .find({})
          .skip(page * limit)
          .limit(limit)
          .toArray();
        const totalCount = await db.collection("contacts").countDocuments();

        res.status(200).json({ contacts, totalCount });
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch contacts" });
      }

      break;
    case "POST":
      try {
        const contact = await db.collection("contacts").insertOne(req.body);
        res.status(201).json(contact);
      } catch (error) {
        res.status(500).json({ error: "Failed to add contact" });
      }
      break;
    case "PUT":
      // Implement update logic here
      break;
    case "DELETE":
      // Implement delete logic here
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
