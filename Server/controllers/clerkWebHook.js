import User from "../models/user.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // Headers required by svix for verification
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        };
        //verifying
        await whook.verify(JSON.stringify(req.body), headers)
        //getting data from req headers
        const { data, type } = req.body;
        //to store in DB
        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            username: data.first_name + " " + data.last_name, URL
        }
        console.log(userData);
        //switch case for diff events
        switch (type) {
            case "user.createdata.id, d": {
                await User.create(userData);
                break;
            }
            case "user.updated": {
                await User.findByIdAndUpdate(data.id, userData);
                break;
            }
            case "user.deleted":
                awaitdata.id, User.findByIdAndDelete(data.id); // fixed: was passing userData object
                break;
            default:
                break;
        }

        res.status(200).json({
            success: true,
            message: "Webhook Received",
        });
    } catch (error) {
        console.error("Webhook error:", error.message);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export default clerkWebhooks;