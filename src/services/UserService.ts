import { AppDataSource } from "../config/database/data-source";
import { User } from "../entities/User";

const userRepo = AppDataSource.getRepository(User);

export class UserService {
  static async getAllUsers(): Promise<User[]> {
    return userRepo.find();
  }

  static async getUser(id: number): Promise<User> {
    const user = await userRepo.findOneOrFail({ where: { id } });
    return user;
  }

  static async createUser(name: string, email: string, password: string): Promise<User> {
    // Проверяем, существует ли пользователь с таким email
    const existingUser = await userRepo.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("Пользователь с такими данными уже существует");
    }

    // Создаем нового пользователя
    const newUser = userRepo.create({ name, email, password });
    return userRepo.save(newUser);
  }

  static async updateUser(id: number, name: string, email: string, password: string): Promise<User> {
    const user = await userRepo.findOne({ where: { id } });
    const userEmail = await userRepo.findOne({ where: { email } });

    if (userEmail) {
      throw new Error("Пользователь с такими данными уже существует");
    }
    if (!user) {
      throw new Error("Пользователь не найден");
    }
    userRepo.merge(user, { name, email, password });
    return userRepo.save(user);
  }

  static async deleteUser(id: number): Promise<{ message: string; code: number }> {
    const result = await userRepo.delete(id);

    if (result.affected === 0) {
      throw new Error("Пользователь не найден");
    }
    return { message: "Пользователь удален", code: -3 };
  }
}
