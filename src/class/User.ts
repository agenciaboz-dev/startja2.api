import { Prisma } from "@prisma/client"
import { prisma } from "../prisma"
import { LoginForm } from "../types/shared/login"
import { FileUpload, WithoutFunctions } from "./helpers"
import { saveFile } from "../tools/saveFile"
import { handlePrismaError } from "../prisma/errors"
import { Notification } from "./Notification"
import { uid } from "uid"
import { Media } from "./Media"
import { ResaleUser, resaleuser_include } from "./ResaleUser"
import { Resale, resale_include } from "./Resale"
import { CustomerUser, customer_user_include } from "./CustomerUser"
import { Customer, customer_include } from "./Customer"

export const user_include = Prisma.validator<Prisma.UserInclude>()({
    notifications: true,
    profilePic: true,
    resales: { include: resaleuser_include },
    resalesManager: { include: resale_include },
    customers: { include: customer_user_include },
    customersManager: { include: customer_include },
})
export type UserPrisma = Prisma.UserGetPayload<{ include: typeof user_include }>

export type UserForm = Omit<
    WithoutFunctions<User>,
    | "id"
    | "profilePic"
    | "created_at"
    | "notifications"
    | "expoPushToken"
    | "admin"
    | "active"
    | "resalesManager"
    | "resales"
    | "customersManager"
    | "customers"
> & {
    profilePic?: FileUpload | null
    admin?: boolean
    active?: boolean
}

export type PartialUser = Partial<User> & { id: string }
export class User {
    id: string
    email: string
    created_at: string
    password: string
    name: string
    phone: string

    expoPushToken: string[]

    admin: boolean
    active: boolean

    notifications: Notification[]
    profilePic: Media | null
    resalesManager: Resale[]
    resales: ResaleUser[]
    customersManager: Customer[]
    customers: CustomerUser[]

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
                profilePic: form.profilePic ? { create: { id: uid(), name: form.profilePic.name, type: "image", url: "" } } : undefined,
            },
            include: user_include,
        })

        const user = new User("", data)

        if (form.profilePic) {
            await user.update({ profilePic: { ...user.profilePic!, url: user.updateImage(form.profilePic) } })
        }

        return user
    }

    static async login(data: LoginForm) {
        const user_prisma = await prisma.user.findFirst({
            where: {
                OR: [{ email: data.login }],
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
        if (!data) return null
        return new User("", data)
    }

    static async findByEmail(email: string) {
        const data = await prisma.user.findUnique({ where: { email }, include: user_include })
        if (!data) return null
        return new User("", data)
    }

    load(data: UserPrisma) {
        this.id = data.id
        this.email = data.email
        this.name = data.name
        this.password = data.password
        this.phone = data.phone
        this.created_at = data.created_at
        this.admin = data.admin

        this.profilePic = data.profilePic ? new Media(data.profilePic) : null

        this.expoPushToken = JSON.parse(data.expoPushToken)
        this.notifications = data.notifications.map((item) => new Notification(item))
        this.resalesManager = data.resalesManager.map((item) => new Resale("", item))
        this.resales = data.resales.map((item) => new ResaleUser("", item))
        this.customersManager = data.customersManager.map((item) => new Customer("", item))
        this.customers = data.customers.map((item) => new CustomerUser("", item))
    }

    async update(data: Partial<User>) {
        console.log(data)
        try {
            const user_prisma = await prisma.user.update({
                where: { id: this.id },
                data: {
                    ...data,
                    expoPushToken: data.expoPushToken ? JSON.stringify(data.expoPushToken) : undefined,
                    profilePic: data.profilePic ? { update: { url: this.updateImage(data.profilePic), name: data.profilePic.name } } : undefined,
                    customers: undefined,
                    customersManager: undefined,
                    notifications: undefined,
                    resales: undefined,
                    resalesManager: undefined,
                },
                include: user_include,
            })

            this.load(user_prisma)
        } catch (error) {
            const message = handlePrismaError(error)
            return message
        }
    }

    updateImage(data: FileUpload) {
        const url = saveFile(`/users/${this.id}/profilePic`, data)
        return url
    }
}
