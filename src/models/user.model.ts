import { DataTypes } from "sequelize";
import sequelize from "../config/db";
import { time } from "console";

const User = sequelize.define('developers', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role: {
        type: DataTypes.STRING,
        allowNull: true
    },
    salary: {
        type: DataTypes.STRING,
        allowNull: true
    },
},
    {
        timestamps: false
    })

export default User;