import { Prisma } from "@prisma/client"
import { CustomerPermissions, CustomerPermissionsForm, customer_permissions_include } from "./Permissions"
import { Media } from "./Media"
import { Address, AddressForm } from "./Address"
import { prisma } from "../prisma"
import { FileUpload, WithoutFunctions } from "./helpers"

export const customer_include = Prisma.validator<Prisma.CustomerInclude>()({
    address: true,
    permissions: { include: customer_permissions_include },
    profilePic: true,
})

type CustomerPrisma = Prisma.CustomerGetPayload<{ include: typeof customer_include }>

export type FunruralType = "paycheck" | "production_value"

export type CustomerForm = Omit<
    WithoutFunctions<Customer>,
    "id" | "certificate_file" | "address_id" | "permissionsId" | "managerId" | "profilePicId" | "profilePic" | "address" | "permissions"
> & {
    certificate_file?: FileUpload
    profilePic?: FileUpload
    address: AddressForm
    permissions: CustomerPermissionsForm
}

export class Customer {
    id: string
    document: string
    name: string
    business_name: string
    email: string
    phone: string
    municipal_registration: string
    state_registration: string
    exempted: boolean
    discriminate_taxes: boolean
    send_destinatary_mail: boolean
    enable_nfe: boolean
    enable_nfce: boolean
    next_nfe_number: string
    nfe_series: string
    funrural: FunruralType
    certificate_file: string
    certificate_password: string
    address_id: number
    permissionsId: number
    managerId: string
    profilePicId: string | null
    profilePic: Media | null
    address: Address
    permissions: CustomerPermissions

    constructor(id: string, data: CustomerPrisma) {
        if (data) {
            this.load(data)
        } else {
            this.id = id
        }
    }

    async init() {
        const data = await prisma.customer.findUnique({ where: { id: this.id }, include: customer_include })
        if (!data) throw "sistema cliente não encontrado"
        this.load(data)
    }

    load(data: CustomerPrisma) {
        this.id = data.id
        this.document = data.document
        this.name = data.name
        this.business_name = data.business_name
        this.email = data.email
        this.phone = data.phone
        this.municipal_registration = data.municipal_registration
        this.state_registration = data.state_registration
        this.exempted = data.exempted
        this.discriminate_taxes = data.discriminate_taxes
        this.send_destinatary_mail = data.send_destinatary_mail
        this.enable_nfe = data.enable_nfe
        this.enable_nfce = data.enable_nfce
        this.next_nfe_number = data.next_nfe_number
        this.nfe_series = data.nfe_series
        this.funrural = data.funrural
        this.certificate_file = data.certificate_file
        this.certificate_password = data.certificate_password
        this.address_id = data.address_id
        this.permissionsId = data.permissionsId
        this.managerId = data.managerId
        this.profilePicId = data.profilePicId

        this.profilePic = data.profilePic ? new Media(data.profilePic) : null
        this.address = new Address(data.address)
        this.permissions = new CustomerPermissions(data.permissions)
    }
}
