import { Prisma } from "@prisma/client"
import { Media } from "./Media"
import { ResalePermissions } from "./Permissions"
import { prisma } from "../prisma"

export const resale_include = Prisma.validator<Prisma.ResaleInclude>()({
    permissions: true,
    profilePic: true,
})

type ResalePrima = Prisma.ResaleGetPayload<{ include: typeof resale_include }>

export class Resale {
    id: string
    name: string
    manager_id: string
    permissions: ResalePermissions
    profilePic: Media | null

    constructor(id: string, data?: ResalePrima) {
        if (data) {
            this.load(data)
        } else {
            this.id = id
        }
    }

    load(data: ResalePrima) {
        this.id = data.id
        this.name = data.name
        this.manager_id = data.managerId
        this.permissions = data.permissions
        this.profilePic = data.profilePic
    }

    async init() {
        const data = await prisma.resale.findUnique({ where: { id: this.id }, include: resale_include })
        if (!data) throw "revenda não encontrada"
        this.load(data)
    }
}
