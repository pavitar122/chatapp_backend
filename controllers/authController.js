import User from "../database/models/userModel.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();



export const Signup = async (req, res) => {
    try {
        const { fullName, userName, password, cpassword } = req.body;

        if (password !== cpassword) {
            return res.status(400).json({ error: "Password's dont match." })
        }

        const user = await User.findOne({ userName });

        if (user) {
            return res.status(400).json({ error: "Username already exsists." })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const ProfilePic = `https://avatar.iran.liara.run/public/boy?username=${userName}`;


        const newUser = new User({
            fullName: fullName,
            userName: userName,
            password: hashedPassword,
            profilePic: ProfilePic

        })

    
        if (newUser) {
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "15d" });
            res.status(200).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                userName: newUser.userName,
                profilePic: newUser.profilePic,
                token

            })
        } else {
            res.status(400).json({ error: "Invalid user data." })
        }

    } catch (error) {
        res.status(500).send(error)
    }
}


export const Login = async (req, res) => {
    try {
        const { userName, password } = req.body;
        const user = await User.findOne({ userName });

        if (!user) {
            return res.status(400).json({ error: "User do not exsists." })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Wrong Password entered." })
        }

        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15d" });
            res.status(200).json({
                _id: user._id,
                fullName: user.fullName,
                userName: userName,
                profilePic: user.profilePic,
                token
            })
        } else {
            res.status(400).json({ error: "Invalid user data." })
        }

    } catch (error) {
        res.status(500).send(error)
    }
}


export const Logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Logged out sucessfully." })
    } catch (error) {
        res.status(500).send(error)
    }
}

