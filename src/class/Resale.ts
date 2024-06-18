import { Prisma } from "@prisma/client"
import { Media } from "./Media"
import { ResalePermissions, ResalePermissionsForm } from "./Permissions"
import { prisma } from "../prisma"
import { FileUpload, WithoutFunctions } from "./helpers"
import { User, UserForm } from "./User"
import { uid } from "uid"
import { saveFile } from "../tools/saveFile"

export const resale_include = Prisma.validator<Prisma.ResaleInclude>()({
    permissions: true,
    profilePic: true,
})

type ResalePrima = Prisma.ResaleGetPayload<{ include: typeof resale_include }>

export type ResaleForm = Omit<WithoutFunctions<Resale>, "id" | "manager_id" | "permissions" | "profilePic"> & {
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

    constructor(id: string, data?: ResalePrima) {
        if (data) {
            this.load(data)
        } else {
            this.id = id
        }
    }

    static async list() {
        const data = await prisma.resale.findMany({ include: resale_include })
        const resales = data.map((item) => new Resale("", item))
        return resales
    }

    static async new(form: ResaleForm) {
        const manager = (await User.findByEmail(form.manager.email)) || (await User.signup(form.manager))
        const permissions = await ResalePermissions.new(form.permissions)

        const data = await prisma.resale.create({
            data: {
                id: uid(),
                name: form.name,
                managerId: manager.id,
                permissionsId: permissions.id,
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
}
