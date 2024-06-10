import { Prisma } from "@prisma/client"

type AddressPrisma = Prisma.AddressGetPayload<{}>

export type AddressForm = Omit<Address, 'id'>

export class Address {
    id: number   
    cep: string
    uf: string
    city: string
    number: string
    district: string
    street: string
    complement: string | null

    constructor(data: AddressPrisma) {
        this.cep = data.cep
        this.city = data.city
        this.complement = data.complement
        this.district = data.district
        this.id = data.id
        this.number = data.number
        this.street = data.street
        this.uf = data.uf
    }
}