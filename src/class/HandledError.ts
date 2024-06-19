import { Response } from "express"

export class HandledError {
    message: string
    type = "handled_error"

    constructor(message: string) {
        this.message = message
    }

    static handleResponse(error: unknown, response: Response) {
        if (error instanceof HandledError) {
            response.status(400).json(error)
        } else {
            response.status(500).send(error)
        }
    }
}
