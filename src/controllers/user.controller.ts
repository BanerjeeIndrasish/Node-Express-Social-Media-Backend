import { Request, Response } from "express";
import userService from "../services/user.service";

class UserController {
    async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const { page = '1', perPage = '10', search = '' } = req.query;
            const pageNum = parseInt(page as string, 10);
            const perPageNum = parseInt(perPage as string, 10);
            const users = await userService.getAllUsers(pageNum, perPageNum, search as string);
            // console.log('Users', users)
            res.status(200).json({ success: true, message: "Users fetched successfully", ...users });
        } catch (error) {
            console.error('Error in controller', error);
            res.status(500).json({ success: true, message: "Internal Server Error", error: error });
        }
    }

    async editUser(req: Request, res: Response): Promise<void> {
        try {
            const { id, data } = req.body;
            const users = await userService.editUser(id, data);
            res.status(200).json(users);
        } catch (error) {
            console.error('Error in controller', error);
            res.status(500).json({ message: "Internal Server Error", error: error });
        }
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            console.log('Delete request');
            const { id } = req.params;
            const numID = parseInt(id);
            const result = await userService.deleteUser(numID);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error in controller', error);
            res.status(500).json({ message: "Internal Server Error", error: error });
        }
    }
}

export default new UserController();