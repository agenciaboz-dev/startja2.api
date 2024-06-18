import { Prisma } from "@prisma/client"
import { Media } from "./Media"
import { ResalePermissions, ResalePermissionsForm } from "./Permissions"
import { prisma } from "../prisma"
import { FileUpload, WithoutFunctions } from "./helpers"
import { User, UserForm, user_include } from "./User"
import { uid } from "uid"
import { saveFile } from "../tools/saveFile"

export const resale_include = Prisma.validator<Prisma.ResaleInclude>()({
    permissions: true,
    profilePic: true,
})

type ResalePrima = Prisma.ResaleGetPayload<{ include: typeof resale_include }>

export type ResaleForm = Omit<WithoutFunctions<Resale>, "id" | "manager_id" | "permissions" | "profilePic" | "created_at"> & {
    profilePic?: FileUpload
    manager: UserForm
    permissions: ResalePermissionsForm
}

export class Resale {
    id: string
    name: string
    manager_id: string
    permissions: ResalePermissions
    profilePic: Media | null
    created_at: string

    constructor(id: string, data?: ResalePrima) {
        if (data) {
            this.load(data)
        } else {
            this.id = id
        }
    }

    static async findById(id: string) {
        const data = await prisma.resale.findUnique({ where: { id }, include: resale_include })
        if (!data) return null
        return new Resale("", data)
    }

    static async list() {
        const data = await prisma.resale.findMany({ include: resale_include })
        const resales = data.map((item) => new Resale("", item))
        return resales
    }

    static async new(form: ResaleForm) {
        const manager = await User.newResaleManager(form.manager, form.name)
        const permissions = await ResalePermissions.new(form.permissions)

        const data = await prisma.resale.create({
            data: {
                id: uid(),
                name: form.name,
                managerId: manager.id,
                permissionsId: permissions.id,
                created_at: new Date().getTime().toString(),
            },
            include: resale_include,
        })

        const resale = new Resale("", data)
        if (form.profilePic) {
            await resale.updateProfilePic(form.profilePic)
        }

        return resale
    }

    load(data: ResalePrima) {
        this.id = data.id
        this.name = data.name
        this.manager_id = data.managerId
        this.permissions = data.permissions
        this.profilePic = data.profilePic
        this.created_at = data.created_at
    }

    async init() {
        const data = await prisma.resale.findUnique({ where: { id: this.id }, include: resale_include })
        if (!data) throw "revenda não encontrada"
        this.load(data)
    }

    async updateProfilePic(image: FileUpload) {
        const url = saveFile(`/resales/${this.id}/`, image)
        const data = await prisma.resale.update({
            where: { id: this.id },
            data: {
                profilePic: this.profilePic ? { update: { url, name: image.name } } : { create: { id: uid(), name: image.name, type: "image", url } },
            },
            include: resale_include,
        })

        this.load(data)
    }

    async getManagers() {
        const manager = new User(this.manager_id)
        await manager.init()
        const data = await prisma.resaleUser.findMany({ where: { resale_id: this.id } })
        console.log(data)

        const users = await Promise.all(
            data.map(async (item) => {
                const user = new User(item.user_id)
                await user.init()
                return user
            })
        )

        console.log(users)
        users.unshift(manager)
        console.log(users)
        return users
    }
}
