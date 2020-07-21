import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IListProvidersDTO from '@modules/users/dtos/IListProvidersDTO';

export default interface IUsersRepository {
  findAllProviders(data: IListProvidersDTO): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
}

/**
 * encontrar por id (findById)
 * encontrar por email (findByEmail)
 * create (que agora vai criar e salvar)
 * atualizar usuario (save)
 */
