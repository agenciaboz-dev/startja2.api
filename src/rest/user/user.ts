import express, { Express, Request, Response } from "express"
import { PartialUser, User, UserForm } from "../../class/User"
import { prisma } from "../../prisma"
import forgot_password from "./forgot_password"
import login from './login'
import { FileUpload } from "../../class/helpers"

const router = express.Router()

router.use("/forgot_password", forgot_password)
router.use("/login", login)

router.get("/", async (request: Request, response: Response) => {
    const id = request.query.id as string

    try {
        const user = new User(id)
        await user.init()
        response.json(user)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.post("/", async (request: Request, response: Response) => {
    const data = request.body as UserForm
    console.log(data)
    const user = await User.signup(data)
    console.log(user)
    response.status(user instanceof User ? 200 : 400).json(user)
})

router.get("/all", async (request: Request, response: Response) => {
    try {
        const users = await User.list()
        response.json(users)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.patch("/", async (request: Request, response: Response) => {
    const data = request.body as PartialUser
    console.log(data)
    try {
        const user = new User(data.id)
        await user.init()
        await user.update(data)
        if (data.profilePic) {
            await user.updateImage(data.profilePic as unknown as FileUpload)
        }
        response.json(user)
    } catch (error) {
        console.log(error)
        response.status(500).json(error)
    }
})

router.delete("/", async (request: Request, response: Response) => {
    const data = request.body as { id: string }

    try {
        await prisma.user.delete({ where: { id: data.id } })
        response.status(200).send()
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.get("/notifications", async (request: Request, response: Response) => {
    const user_id = request.query.user_id as string | undefined

    if (user_id) {
        try {
            const user = new User(user_id)
            await user.init()
            response.json(user.notifications)
        } catch (error) {
            console.log(error)
            response.status(500).send(error)
        }
    } else {
        response.status(400).send("user_id param is required")
    }
})

export default router
