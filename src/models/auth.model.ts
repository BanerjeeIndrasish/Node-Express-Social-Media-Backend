import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const AuthUsers = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
},
    {
        timestamps: false
    })

export default AuthUsers;