import { Prisma } from "@prisma/client"
import { prisma } from "../prisma"

type RecoveryPrisma = Prisma.RecoveryGetPayload<{}>

export class Recovery {
    id: number
    target: string
    code: number[]
    datetime: string

    constructor(data: RecoveryPrisma) {
        this.id = data.id
        this.target = data.target
        this.code = JSON.parse(data.code)
        this.datetime = data.datetime
    }

    static async new(target: string) {
        const code = (Math.random() * 100000)
            .toFixed(0)
            .split("")
            .map((char) => Number(char))
        const data = await prisma.recovery.create({
            data: { code: JSON.stringify(code), datetime: new Date().getTime().toString(), target },
        })

        return new Recovery(data)
    }
}
