import express, { Express, Request, Response } from "express"
import { User, user_include } from "../../class"
import { prisma } from "../../prisma"
import { sendMail } from "../../tools/mail"
import { website_url } from "../../env"
import templates from "../../templates"
import { Recovery } from "../../class/Recovery"

const router = express.Router()

router.post("/", async (request: Request, response: Response) => {
    const data = request.body as { login: string }

    try {
        const user_prisma = await prisma.user.findFirst({
            where: { OR: [{ email: data.login }] },
            include: user_include,
        })
        if (user_prisma) {
            const user = new User("", user_prisma)
            const recovery = await Recovery.new(user.email)
            const url = `${website_url}/forgot-password/verification/${recovery.code.join("")}`
            console.log(url)
            sendMail([user.email], "Start Já - Redefinir senha", url, `<p>codigo: ${recovery.code.join("")}</p><p>url: ${url}</p>`)
            response.status(200).send()
        } else {
            response.status(400).send("nenhum usuário encontrado")
        }
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.post("/verify-code", async (request: Request, response: Response) => {
    const data = request.body as { code: number[]; target: string }

    try {
        const recovery = await Recovery.verifyCode(data.target, data.code)
        if (recovery) {
            const expired = new Date().getTime() - Number(recovery.datetime) >= 1000 * 60 * 15
            if (expired) {
                response.json(null)
            } else {
                response.json(recovery)
            }
        } else {
            response.json(null)
        }
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.post("/reset-password", async (request: Request, response: Response) => {
    const data = request.body as { target: string; password: string }

    try {
        const user = await User.findByEmail(data.target)
        await user.update({ password: data.password })
        await Recovery.finish(data.target)
        response.json(user)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

export default router
