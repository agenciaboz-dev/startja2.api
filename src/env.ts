export let env: "dev" | "prod" = "dev"
export const website_url = "https://startja.agenciaboz.com.br"

export const setProd = () => {
    env = "prod"
}
