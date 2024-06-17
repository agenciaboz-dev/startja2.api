import express, { Express, Request, Response } from "express"
import { Resale } from "../../class/Resale"
const router = express.Router()

router.get("/admin", async (request: Request, response: Response) => {
    try {
        const resales = await Resale.list()
        response.json(resales)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

export default router
