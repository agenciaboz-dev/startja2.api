import { Prisma } from "@prisma/client"
import { Customer, customer_include } from "./Customer"
import { CustomerPermissions, customer_permissions_include } from "./Permissions"
import { prisma } from "../prisma"

export const customer_user_include = Prisma.validator<Prisma.CustomerUserInclude>()({
    customer: { include: customer_include },
    permissions: { include: customer_permissions_include },
})

type CustomerUserPrisma = Prisma.CustomerUserGetPayload<{ include: typeof customer_user_include }>

export class CustomerUser {
    id: string
    user_id: string
    customer_id: string

    permissions: CustomerPermissions
    customer: Customer

    constructor(id: string, data?: CustomerUserPrisma) {
        if (data) {
            this.load(data)
        } else {
            this.id = id
        }
    }

    async init() {
        const data = await prisma.customerUser.findUnique({ where: { id: this.id }, include: customer_user_include })
        if (!data) throw "usuário cliente não encontrado"
        this.load(data)
    }

    load(data: CustomerUserPrisma) {
        this.id = data.id
        this.user_id = data.user_id
        this.customer_id = data.customer_id
        this.permissions = new CustomerPermissions(data.permissions)
        this.customer = new Customer("", data.customer)
    }
}
