import { Prisma } from "@prisma/client"
import { Resale, resale_include } from "./Resale"
import { ResalePermissions, ResalePermissionsForm } from "./Permissions"
import { prisma } from "../prisma"
import { WithoutFunctions } from "./helpers"
import { User, UserForm } from "."
import { uid } from "uid"

export const resaleuser_include = Prisma.validator<Prisma.ResaleUserInclude>()({
    permissions: true,
    resale: { include: resale_include },
})

type ResaleUserPrisma = Prisma.ResaleUserGetPayload<{ include: typeof resaleuser_include }>

export type ResaleUserForm = Omit<WithoutFunctions<ResaleUser>, "id" | "user_id" | "permissions" | "resale"> & {
    user: UserForm
    permissions: ResalePermissionsForm
}

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

    static async new(form: ResaleUserForm) {
        const resale = new Resale(form.resale_id)
        await resale.init()
        const managers = await resale.getManagers()
        const user = await User.newResaleManager(form.user, resale.name)

        if (managers.find((item) => item.id == user.id)) throw "usuário já faz parte deste sistema"

        const permissions = await ResalePermissions.new(form.permissions)
        const data = await prisma.resaleUser.create({
            data: {
                id: uid(),
                permissions_id: permissions.id,
                resale_id: resale.id,
                user_id: user.id,
            },
            include: resaleuser_include,
        })

        const resaleUser = new ResaleUser("", data)
        return resaleUser
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
