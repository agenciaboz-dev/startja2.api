import { Prisma } from "@prisma/client"
import { prisma } from "../prisma"
import { WithoutFunctions } from "./helpers"

export const customer_permissions_include = Prisma.validator<Prisma.CustomerPermissionsInclude>()({
    nfePermissions: true,
})

type CustomerPermissionsPrisma = Prisma.CustomerPermissionsGetPayload<{ include: typeof customer_permissions_include }>
type NfePermissionsPrisma = Prisma.NfePermissionsGetPayload<{}>
type ResalePermissionsPrisma = Prisma.ResalePermissionsGetPayload<{}>

export type ResalePermissionsForm = Omit<WithoutFunctions<ResalePermissions>, "id">

export class ResalePermissions {
    id: number
    customers: number
    products: number
    natures: number
    editPermissions: boolean
    inviteUser: boolean

    constructor(data: ResalePermissionsPrisma) {
        this.id = data.id
        this.customers = data.customers
        this.products = data.products
        this.natures = data.natures
        this.editPermissions = data.editPermissions
        this.inviteUser = data.inviteUser
    }

    static async new(form: ResalePermissionsForm) {
        const data = await prisma.resalePermissions.create({ data: form })
        return new ResalePermissions(data)
    }
}

export class NfePermissions {
    id: number
    emit: boolean
    edit: boolean
    cancel: boolean
    delete: boolean
    transmit: boolean
    clone: boolean
    adjust: boolean
    renderNumber: boolean
    manifest: boolean
    correctionLetter: boolean
    share: boolean
    download: boolean
    history: boolean
    save_view: boolean

    constructor(data: NfePermissionsPrisma) {
        this.id = data.id
        this.emit = data.emit
        this.edit = data.edit
        this.cancel = data.cancel
        this.delete = data.delete
        this.transmit = data.transmit
        this.clone = data.clone
        this.adjust = data.adjust
        this.renderNumber = data.renderNumber
        this.manifest = data.manifest
        this.correctionLetter = data.correctionLetter
        this.share = data.share
        this.download = data.download
        this.history = data.history
        this.save_view = data.save_view
    }
}

export class CustomerPermissions {
    id: number
    enterprises: number
    products: number
    natures: number
    properties: number
    bank_accounts: number
    edit_permissions: boolean
    invite_user: boolean
    options: boolean
    report_nfe: number
    sold_products: number
    chart_accounts: number
    nfePermissionsId: number
    nfePermissions: NfePermissions

    constructor(data: CustomerPermissionsPrisma) {
        this.id = data.id
        this.enterprises = data.enterprises
        this.products = data.products
        this.natures = data.natures
        this.properties = data.properties
        this.bank_accounts = data.bank_accounts
        this.edit_permissions = data.edit_permissions
        this.invite_user = data.invite_user
        this.options = data.options
        this.report_nfe = data.report_nfe
        this.sold_products = data.sold_products
        this.chart_accounts = data.chart_accounts
        this.nfePermissionsId = data.nfePermissionsId
        this.nfePermissions = data.nfePermissions
    }
}