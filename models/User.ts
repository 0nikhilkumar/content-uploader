import mongoose, { model, Schema, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
    _id?: mongoose.Types.ObjectId;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    bio?: string;
    avatar?: string;
    fileId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    bio: {
        type: String
    },
    avatar: {
        type: String
    },
    fileId: {
        type: String
    }
}, {timestamps: true});

userSchema.pre('save', async function (next) {
    if(!this.isModified("password")) next();
    this.password = await bcrypt.hash(this.password, 10);
});

const User = models?.User || model<IUser>("User", userSchema);

export default User;
