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
}

export default new UserService();