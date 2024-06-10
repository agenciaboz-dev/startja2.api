import { Prisma } from "@prisma/client"
import { prisma } from "../prisma"
import { LoginForm } from "../types/shared/login"
import { FileUpload, WithoutFunctions } from "./helpers"
import { saveFile } from "../tools/saveFile"
import { handlePrismaError } from "../prisma/errors"
import { Notification } from "./Notification"
import { uid } from "uid"
import { Address, AddressForm } from "./Address"

export const user_include = Prisma.validator<Prisma.UserInclude>()({
    notifications: true,
    address: true
})
export type UserPrisma = Prisma.UserGetPayload<{ include: typeof user_include }>

export type UserForm = Omit<WithoutFunctions<User>, "id" | "profilePic" | "created_at" | "notifications" | 'address'> & {
    profilePic: FileUpload | null
    address: AddressForm
}
export type PartialUser = Partial<User> & { id: string }
export class User {
    id: string
    cpf: string
    email: string
    created_at: string
    password: string
    name: string
    phone: string

    profilePic: string | null

    expoPushToken: string[]
    notifications: Notification[]
    address: Address

    constructor(id: string, user_prisma?: UserPrisma) {
        user_prisma ? this.load(user_prisma) : (this.id = id)
    }

    async init() {
        const user_prisma = await prisma.user.findUnique({ where: { id: this.id }, include: user_include })
        if (user_prisma) {
            this.load(user_prisma)
        } else {
            throw "usuário não encontrado"
        }
    }

    static async list() {
        const data = await prisma.user.findMany({ include: user_include })
        const users = data.map((item) => new User("", item))
        return users
    }

    static async signup(form: UserForm) {
        const data = await prisma.user.create({
            data: {
                ...form,
                id: uid(),
                created_at: new Date().getTime().toString(),
                address: {create: form.address},
                profilePic: undefined,
                expoPushToken: undefined,
            },
            include: user_include,
        })

        const user = new User("", data)
        if (form.profilePic) {
            await user.updateImage(form.profilePic)
        }

        return user
    }

    static async login(data: LoginForm) {
        const user_prisma = await prisma.user.findFirst({
            where: {
                OR: [{ email: data.login }, { cpf: data.login }],
                password: data.password,
            },
            include: user_include,
        })

        if (user_prisma) {
            const user = new User(user_prisma.id, user_prisma)

            return user
        }

        return null
    }

    static async findById(id: string) {
        const data = await prisma.user.findUnique({ where: { id }, include: user_include })
        if (!data) throw "usuário não encontrado"
        return new User("", data)
    }

    load(data: UserPrisma) {
        this.id = data.id
        this.cpf = data.cpf
        this.email = data.email
        this.name = data.name
        this.password = data.password
        this.phone = data.phone
        this.created_at = data.created_at

        this.profilePic = data.profilePic

        this.expoPushToken = JSON.parse(data.expoPushToken)
        this.notifications = data.notifications.map((item) => new Notification(item))
        this.address = new Address(data.address)
    }

    async update(data: Partial<User>) {
        console.log(data)
        try {
            const user_prisma = await prisma.user.update({
                where: { id: this.id },
                data: {
                    ...data,
                    address: data.address ? {update: data.address} : undefined,
                    expoPushToken: data.expoPushToken ? JSON.stringify(data.expoPushToken) : undefined,
                    notifications: undefined,
                },
                include: user_include,
            })

            this.load(user_prisma)
        } catch (error) {
            const message = handlePrismaError(error)
            return message
        }
    }

    async updateImage(data: FileUpload) {
        try {
            const url = saveFile(`/users/${this.id}/profilePic`, data)
            await this.update({ profilePic: url })
        } catch (error) {
            console.log(error)
        }
    }
}
