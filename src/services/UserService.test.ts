import request from 'supertest'
import app from '../app' // Убедись, что путь к твоему Express-приложению верный
import { AppDataSource } from '../database/data-source'

describe('GET /users', () => {
  it('Должен возвращать список пользователей со статусом 200', async () => {
    const response = await request(app).get('/api/users')

    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Array)

    afterAll(async () => {
      await AppDataSource.destroy() // TypeORM: корректное завершение соединения
    })
  })
})

// import { UserService } from './UserService'
// import { AppDataSource } from '../database/data-source'
// import { User } from '../entities/User'
// import { Repository } from 'typeorm'

// // Мокаем TypeORM getRepository
// jest.mock('../database/data-source', () => ({
//   AppDataSource: {
//     getRepository: jest.fn(),
//   },
// }))
// const userRepo = {
//     find: jest.fn(),
//     findOne: jest.fn(),
//     findOneOrFail: jest.fn(),
//     save: jest.fn(),
//     delete: jest.fn(),
//   };
// describe('UserService', () => {
//   let userRepo: jest.Mocked<Repository<User>>

//   beforeEach(() => {
//     userRepo = {
//       find: jest.fn(),
//       findOne: jest.fn(),
//       findOneOrFail: jest.fn(),
//       create: jest.fn(),
//       save: jest.fn(),
//       delete: jest.fn(),
//       merge: jest.fn(),
//     } as any
//     ;(AppDataSource.getRepository as jest.Mock).mockReturnValue(userRepo)
//   })

//   it('должен вернуть всех пользователей', async () => {
//     const mockUsers: User[] = [
//       {
//         id: 1,
//         name: 'John Doe',
//         email: 'john@example.com',
//         password: 'hashedpass',
//       },
//       {
//         id: 2,
//         name: 'Jane Doe',
//         email: 'jane@example.com',
//         password: 'hashedpass',
//       },
//     ]

//     userRepo.find.mockResolvedValue(mockUsers)

//     const users = await UserService.getAllUsers()

//     expect(users).toEqual(mockUsers)
//     expect(userRepo.find).toHaveBeenCalled()
//   })

//   it('должен вернуть пользователя по id', async () => {
//     const mockUser: User = {
//       id: 1,
//       name: 'John Doe',
//       email: 'john@example.com',
//       password: 'hashedpass',
//     }

//     userRepo.findOneOrFail.mockResolvedValue(mockUser)

//     const user = await UserService.getUser(1)

//     expect(user).toEqual(mockUser)
//     expect(userRepo.findOneOrFail).toHaveBeenCalledWith({ where: { id: 1 } })
//   })

//   it('должен выбросить ошибку, если пользователь не найден', async () => {
//     userRepo.findOneOrFail.mockRejectedValue(
//       new Error('Пользователь не найден')
//     )

//     await expect(UserService.getUser(1)).rejects.toThrow(
//       'Пользователь не найден'
//     )
//   })

//   it('должен создать нового пользователя', async () => {
//     const newUser = {
//       name: 'John Doe',
//       email: 'john@example.com',
//       password: 'hashedpass',
//     }
//     const savedUser = { id: 1, ...newUser }

//     userRepo.findOne.mockResolvedValue(null)
//     userRepo.create.mockReturnValue(newUser as User)
//     userRepo.save.mockResolvedValue(savedUser)

//     const result = await UserService.createUser(
//       newUser.name,
//       newUser.email,
//       newUser.password
//     )

//     expect(result).toEqual(savedUser)
//     expect(userRepo.create).toHaveBeenCalledWith(newUser)
//     expect(userRepo.save).toHaveBeenCalledWith(newUser)
//   })

//   it('должен выбросить ошибку при создании пользователя с существующим email', async () => {
//     const newUser = {
//       name: 'John Doe',
//       email: 'john@example.com',
//       password: 'hashedpass',
//     }

//     userRepo.findOne.mockResolvedValue(newUser as User)

//     await expect(
//       UserService.createUser(newUser.name, newUser.email, newUser.password)
//     ).rejects.toThrow('Пользователь с такими данными уже существует')
//   })

//   it('должен обновить пользователя', async () => {
//     const existingUser = {
//       id: 1,
//       name: 'John Doe',
//       email: 'john@example.com',
//       password: 'hashedpass',
//     }
//     const updatedUser = { ...existingUser, name: 'John Updated' }

//     userRepo.findOne.mockResolvedValue(existingUser)
//     userRepo.merge.mockReturnValue(updatedUser as User)
//     userRepo.save.mockResolvedValue(updatedUser)

//     const result = await UserService.updateUser(
//       1,
//       'John Updated',
//       'john@example.com',
//       'hashedpass'
//     )

//     expect(result).toEqual(updatedUser)
//     expect(userRepo.merge).toHaveBeenCalledWith(existingUser, {
//       name: 'John Updated',
//       email: 'john@example.com',
//       password: 'hashedpass',
//     })
//     expect(userRepo.save).toHaveBeenCalledWith(updatedUser)
//   })

//   it('должен выбросить ошибку при обновлении, если пользователь не найден', async () => {
//     userRepo.findOne.mockResolvedValue(null)

//     await expect(
//       UserService.updateUser(
//         1,
//         'John Updated',
//         'john@example.com',
//         'hashedpass'
//       )
//     ).rejects.toThrow('Пользователь не найден')
//   })

//   it('должен удалить пользователя', async () => {
//     userRepo.delete.mockResolvedValue({ affected: 1 } as any)

//     const result = await UserService.deleteUser(1)

//     expect(result).toEqual({ message: 'Пользователь удален' })
//     expect(userRepo.delete).toHaveBeenCalledWith(1)
//   })

//   it('должен выбросить ошибку при удалении несуществующего пользователя', async () => {
//     userRepo.delete.mockResolvedValue({ affected: 0 } as any)

//     await expect(UserService.deleteUser(1)).rejects.toThrow(
//       'Пользователь не найден'
//     )
//   })
// })
