import { Request, Response, NextFunction } from 'express'
import jwt, { VerifyErrors } from 'jsonwebtoken'
import redisClient from '../clients/redis'
import { IUserToken } from '../generic/interfaces/user.interface'
import OperationResult from '../utils/operationResult'
import { ErrorMessages } from '../generic/resources/error.messages'
import { Role } from '../utils/enum'




declare module 'express' {
    interface Request {
        user: IUserToken; // Replace 'any' with the actual type of 'user' if known
    }
}

/**
 * Check user's authentication
 * @param role
 * @returns {Promise<*>}
 */
export const checkAuthorization = (role: Role[] | Role) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const header = req.body.token || req.query.token || req.headers['authorization']
        console.log(header)
        if (header) {
            const type = header.split(' ')
            if (type[0] === 'Bearer') {
                const token = type[1]
                jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: VerifyErrors | null , decoded: IUserToken | undefined) => {
                    if (err) {
                        if (err.name === 'TokenExpiredError') return res.status(401).json(OperationResult.failed(401, ErrorMessages.TOKEN_EXPIRED))
                        return res.status(401).json(OperationResult.failed(401, ErrorMessages.UNAUTHORIZED))
                    }
                    if (Array.isArray(role)) {
                        if (role.includes(decoded.role)) {
                            req.user = decoded;
                            next();
                        }else {
                            return res.status(401).json(OperationResult.failed(401, ErrorMessages.UNAUTHORIZED))
                        }
                    } else {
                        if (decoded.role === role) {
                            req.user = decoded;
                            next();
                        } else {
                            return res.status(401).json(OperationResult.failed(401, ErrorMessages.UNAUTHORIZED))
                        }
                    }
                    
                })
            } else {
                return res.status(401).json(OperationResult.failed(401, ErrorMessages.MISSING_TOKEN))
            }
        } else {
            return res.status(401).json(OperationResult.failed(401, ErrorMessages.MISSING_TOKEN))
        }
    }
}

/**
 * Create access token
 * @param user
 * @returns {string}
 */
export const signAccessToken = (user: IUserToken) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: Number(process.env.ACCESS_TOKEN_LIFE) })
}

/**
 * Create refresh token
 * @param user
 * @returns {Promise<string>}
 */
export const signRefreshToken = (user: IUserToken) => {
    return new Promise<string>(async (resolve, reject) => {
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: Number(process.env.REFRESH_TOKEN_LIFE)})
        try {
            await redisClient.set(user.id, refreshToken, { EX: Number(process.env.REFRESH_TOKEN_LIFE as string)})
            resolve(refreshToken)
        } catch (err) {
            return reject(err)
        }
    })
}

/**
 * Verify refresh token
 * @param refreshToken
 * @returns {Promise<{status: boolean, data: string | IUserToken}>}
 */
export const verifyRefreshToken = (refreshToken: string) => {
    return new Promise<{ status: boolean; data?: IUserToken, message?: string }>((resolve) => {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, async (err: jwt.VerifyErrors | null, decoded:any) => {
            if (err) {
                if (err.name === 'TokenExpiredError') resolve({ status: false, message: ErrorMessages.TOKEN_EXPIRED })
                resolve({ status: false, message: ErrorMessages.UNAUTHORIZED })
            }
            const userId = decoded!.id
            try {
                const result = await  redisClient.get(userId)
                if (result !== refreshToken) resolve({ status: false, message: ErrorMessages.UNAUTHORIZED })
                resolve({ status: true, data: decoded! })
            } catch (err) {
                if (err) resolve({ status: false, message: ErrorMessages.INTERNAL_SERVER_ERROR })
            }
        })
    })
}

/**
 * Remove refresh token
 * @param userId
 * @returns {Promise<boolean>}
 */
export const removeToken = (userId: string) => {
    return new Promise<boolean>(async (resolve, reject) => {
        try {
            await redisClient.del(userId)
            resolve(true)
        } catch (err) {
            if (err) return reject(err)
        }
    })
}