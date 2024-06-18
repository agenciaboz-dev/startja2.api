import express, { Express, Request, Response } from "express"
import { Resale, ResaleForm } from "../../class/Resale"
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

router.post("/", async (request: Request, response: Response) => {
    const data = request.body as ResaleForm

    try {
        const resale = await Resale.new(data)
        response.json(resale)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

export default router
