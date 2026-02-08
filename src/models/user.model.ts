import {
  Model,
  DataTypes,
  Optional,
} from "sequelize";
import sequelize from "../config/db";

export interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  full_name?: string;
  bio?: string;
  profile_picture?: string;
  is_verified?: boolean;
  created_at?: Date;
}


interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "full_name" | "bio" | "profile_picture" | "created_at"> {}


class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public username!: string;
  public email!: string;
  public password_hash!: string;
  public full_name?: string;
  public bio?: string;
  public profile_picture?: string;
  public is_verified?: boolean;
  public created_at?: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    full_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    profile_picture: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    is_verified: {  // ✅ ADD THIS
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: false, // since you're using created_at manually
  }
);

export default User;