import User from "../models/user.model";
import { Op } from "sequelize";

export type UserAttributes = typeof User.prototype;

interface PaginatedUsers {
    users: UserAttributes[];
    pagination: {
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    };
}

class UserService {
    async getUserById(userId: number) {
        const user = await User.findByPk(userId, {
            attributes: { exclude: ["password_hash"] },
        });

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }

    async getAllUsers(page: number = 1, perPage: number = 10, search: string = ''): Promise<PaginatedUsers> {
        const offset = (page - 1) * perPage

        const whereClause: any = {};
        if (search) {
            whereClause.name = {
                [Op.like]: `%${search}%`
            };
        }
        const { rows, count } = await User.findAndCountAll({
            where: whereClause,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            offset,
            limit: perPage
        });
        // console.log('Users', count)
        return {
            users: rows,
            pagination: {
                total: count,
                page,
                perPage,
                totalPages: Math.ceil(count / perPage)
            }
        };
    }

    async editUser(id: number, data: Partial<UserAttributes>): Promise<UserAttributes | null> {
        const user = await User.findByPk(id);
        if (!user) {
            return null;
        }
        console.log('Updating user:', id);
        await user.update(data);
        return user;
    }

    async deleteUser(id: number): Promise<{ success: true, message: string }> {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error('User not found');
            }
            await user.destroy();
            return {
                success: true,
                message: "Deleted successfully"
            };
        } catch (error) {
            throw new Error("Deletion failed");
        }
    }
}

export default new UserService();