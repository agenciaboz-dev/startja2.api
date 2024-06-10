import express, { Express, Request, Response } from "express"
const router = express.Router()

router.get("/", async (request: Request, response: Response) => {

        try {
            response.json({ views: 5 })
        } catch (error) {
            console.log(error)
            response.status(500).send(error)
        }
})



export default router
