import express, { Express, Request, Response } from "express"
import { Resale, ResaleForm } from "../../class/Resale"
import { ResaleUser, ResaleUserForm } from "../../class/ResaleUser"
import { User } from "../../class"
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

router.get("/", async (request: Request, response: Response) => {
    const resale_id = request.query.resale_id as string | undefined

    if (resale_id) {
        try {
            const resale = await Resale.findById(resale_id)
            response.json(resale)
        } catch (error) {
            console.log(error)
            response.status(500).send(error)
        }
    } else {
        response.status(400).send("resale_id param is required")
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

router.get("/managers", async (request: Request, response: Response) => {
    const resale_id = request.query.resale_id as string | undefined

    if (resale_id) {
        try {
            const resale = new Resale(resale_id)
            await resale.init()
            const managers = await resale.getManagers()
            response.json(managers)
        } catch (error) {
            console.log(error)
            response.status(500).send(error)
        }
    } else {
        response.status(400).send("resale_id param is required")
    }
})

router.post("/manager", async (request: Request, response: Response) => {
    const data = request.body as ResaleUserForm

    try {
        const resaleUser = await ResaleUser.new(data)
        const user = new User(resaleUser.user_id)
        await user.init()
        response.json(user)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

export default router
