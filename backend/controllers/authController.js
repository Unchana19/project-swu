import { create, findOne } from "../models/user";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import expressJwt from 'express-jwt';

export async function createAccount(req, res) {
    const { username, email, password } = req.body;
    const role = "user";

    switch (true) {
        case !email:
            return res.status(400).json({ error: "invalid email" });
        case !password:
            return res.status(400).json({ error: "invalid password" });
    }

    try {
        const user = await create({ username, email, password, role });
        res.json(user);
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ error: "อีเมลล์นี้ถูกใช้งานไปแล้ว" });
        } else {
            res.status(400).json({ error: err.message });
        }
    }
}

export async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    findOne({ email }).exec()
        .then((user) => {
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            const username = user.username;

            compare(password, user.password).then((match) => {
                if (match) {
                    const token = sign({ username },
                        process.env.JWT_SECRET, { expiresIn: "1d" })
                    return res.json({ token, username });
                } else {
                    return res.status(401).json({ error: "Incorrect password" });
                }
            }).catch((error) => {
                return res.status(500).json({ error: "Internal server error" });
            });
        }).catch((error) => {
            return res.status(500).json({ error: "Internal server error" });
        });
}

export const requireLogin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth",}
);