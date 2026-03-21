import User from "../models/user.js"
import { Webhook } from "svix"

const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        //getting headers
        const header = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        };
        //verifying
        await whook.verify(JSON.stringify(req.body), header)
        //getting data from req headers
        const { data, type } = req.body;
        //to store in DB
        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            username: data.first_name + " " + data.last_name,
            image: data.image_URL
        }
        //switch case for diff events
        switch (type) {
            case "user.created": {
                await User.create(data.id, userData);
                break;
            }
            case "user.updated": {
                await User.findByIdAndUpdate(data.id, userData);
                break;
            }
            case "user.deleted": {
                await User.findByIdAndDelete(data.id, userData);
                break;
            }
            default:
                break;
        }
        res.status(200).json({
            success: true,
            message: "WebHook Recived"
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
        console.log(error.message);
    }
}
export default clerkWebhooks