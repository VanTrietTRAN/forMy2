import db from '../models'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 } from 'uuid'
require('dotenv').config()

const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(12))

export const registerService = ({ phone, password, fullName }) => new Promise(async (resolve, reject) => {
    try {
        const [user, created] = await db.User.findOrCreate({
            where: { phone },
            defaults: {
                id: v4(),
                phone,
                fullName,
                password: hashPassword(password)
            }
        })

        if (!created) return resolve({
            err: 2,
            message: 'Phone number has been already used!',
            token: null
        })

        const token = jwt.sign({ id: user.id, phone: user.phone }, process.env.SECRET_KEY, { expiresIn: '2d' })

        resolve({
            err: 0,
            message: 'Register is successful!',
            token,
            user: { id: user.id, phone: user.phone, fullName: user.fullName }
        })

    } catch (error) {
        reject(error)
    }
})

export const loginService = ({ phone, password }) => new Promise(async (resolve, reject) => {
    try {
        const user = await db.User.findOne({
            where: { phone },
            raw: true
        })

        if (!user) return resolve({
            err: 2,
            message: 'Phone number not found!',
            token: null
        })

        const isCorrectPassword = bcrypt.compareSync(password, user.password)

        if (!isCorrectPassword) return resolve({
            err: 2,
            message: 'Password is wrong!',
            token: null
        })

        const token = jwt.sign({ id: user.id, phone: user.phone }, process.env.SECRET_KEY, { expiresIn: '2d' })

        resolve({
            err: 0,
            message: 'Login is successful!',
            token,
            user: { id: user.id, phone: user.phone, fullName: user.fullName }
        })

    } catch (error) {
        reject(error)
    }
})