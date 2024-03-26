import { Role } from "../../utils/enum"

export interface IUserToken {
    id: string
    name: string
    email: string
    role: Role
}