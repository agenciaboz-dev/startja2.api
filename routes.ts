import express, { Express, Request, Response } from "express"
import user from "./src/rest/user/user"
import stats from "./src/rest/stats"
import notification from "./src/rest/notification"

export const router = express.Router()

router.get("/", (req: Request, response: Response) => {
    response.status(200).json({ success: true })
})

router.use("/user", user)
router.use("/stats", stats)
router.use("/notification", notification)
