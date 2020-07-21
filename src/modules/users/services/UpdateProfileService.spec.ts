import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import AppError from '@shared/errors/AppError';

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('should be able to update name and e-mail', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Bon Doe',
      email: 'johnbondoe@example.com',
    });

    expect(updatedUser.name).toBe('John Bon Doe');
    expect(updatedUser.email).toBe('johnbondoe@example.com');
  });

  it('should not be able to update e-mail for an existing-email', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'John Tre',
      email: 'johntre@example.com',
      password: '123123',
    });

    await expect(
      updateProfile.execute({
        user_id: user2.id,
        name: user2.name,
        email: user1.email,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Doe',
      email: 'johnbondoe@example.com',
      old_password: '123123',
      password: 'aseila',
    });

    expect(updatedUser.password).toBe('aseila');
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-user',
        name: 'John Doe',
        email: 'johnbondoe@example.com',
        old_password: '123123',
        password: 'aseila',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password without passing the old one', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'johnbondoe@example.com',
        password: 'aseila',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'johnbondoe@example.com',
        old_password: 'wrong-password',
        password: 'aseila',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
