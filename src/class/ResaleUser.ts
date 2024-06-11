import { Prisma } from "@prisma/client"
import { Resale, resale_include } from "./Resale"
import { ResalePermissions } from "./Permissions"
import { prisma } from "../prisma"

export const resaleuser_include = Prisma.validator<Prisma.ResaleUserInclude>()({
    permissions: true,
    resale: { include: resale_include },
})

type ResaleUserPrisma = Prisma.ResaleUserGetPayload<{ include: typeof resaleuser_include }>

export class ResaleUser {
    id: string
    user_id: string
    resale_id: string

    permissions: ResalePermissions
    resale: Resale

    constructor(id: string, data?: ResaleUserPrisma) {
        if (data) {
            this.load(data)
        } else {
            this.id = id
        }
    }

    async init() {
        const data = await prisma.resaleUser.findUnique({ where: { id: this.id }, include: resaleuser_include })
        if (!data) throw "usuário revenda não encontrado"

        this.load(data)
    }

    load(data: ResaleUserPrisma) {
        this.id = data.id
        this.resale_id = data.resale_id
        this.user_id = data.user_id

        this.permissions = new ResalePermissions(data.permissions)
        this.resale = new Resale("", data.resale)
    }
}
