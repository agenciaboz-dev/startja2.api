import { prisma } from "../../src/prisma"

const fixToken = async (id: string, token: string | null) => {
    const result = await prisma.user.update({ where: { id }, data: { expoPushToken: token ? JSON.stringify([token]) : JSON.stringify([]) } })
    console.log(`fixed ${result.name} token`)
}

export const fixExpoPushTokens = async () => {
    const users = await prisma.user.findMany()
    users.forEach((user) => {
        try {
            const token = JSON.parse(user.expoPushToken || "null") || []
            if (token) {
                console.log(`user ${user.name} token is correct`)
            } else {
                fixToken(user.id, user.expoPushToken)
            }
        } catch (error) {
            fixToken(user.id, user.expoPushToken)
        }
    })
}

fixExpoPushTokens()
