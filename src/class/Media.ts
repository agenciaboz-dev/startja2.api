import { Prisma } from "@prisma/client"

type MediaPrisma = Prisma.MediaGetPayload<{}>

export type MediaType = "image" | "document"

export class Media {
    id: string
    url: string
    name: string
    type: MediaType

    constructor(data: MediaPrisma) {
        this.id = data.id
        this.name = data.name
        this.type = data.type
        this.url = data.url
    }
}
