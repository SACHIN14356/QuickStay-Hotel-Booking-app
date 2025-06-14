import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    // Ensure headers exist
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    if (!headers["svix-id"] || !headers["svix-timestamp"] || !headers["svix-signature"]) {
      console.log("❌ Missing Svix headers");
      return res.status(400).send("Missing webhook signature headers");
    }

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Verify payload
    const evt = whook.verify(req.body, headers);
    const { data, type } = evt;

    const userData = {
      _id: data.id,
      email: data.email_addresses?.[0]?.email_address || "",
      username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      image: data.image_url || "",
    };

    switch (type) {
      case "user.created":
        await User.create(userData);
        break;

      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData);
        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;

      default:
        console.log("⚠️ Unhandled event type:", type);
        break;
    }

    res.json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.log("❌ Webhook Error:", error); // full object to see stacktrace
    res.status(500).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
