import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
    );
  });
  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 10, 12).getTime();
    });

    const appointment = await createAppointmentService.execute({
      user_id: 'user',
      date: new Date(2020, 5, 10, 13),
      provider_id: 'provider',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider');
    expect(appointment.date).toBeInstanceOf(Date);
  });

  it('should not be able to create two appointments in the same date, for the same provider', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 5, 10, 12).getTime();
    });

    const date = new Date(2020, 5, 10, 13);
    const provider_id = '123123';

    await createAppointmentService.execute({
      user_id: 'user-1',
      date,
      provider_id,
    });

    await expect(
      createAppointmentService.execute({
        user_id: 'user-2',
        date,
        provider_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able one user create appointments with himslef', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 10, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        user_id: 'user-1',
        date: new Date(2020, 5, 10, 12),
        provider_id: 'user-1',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able one user create two appointments in same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 10, 12).getTime();
    });

    const date = new Date(2020, 5, 10, 13);

    await createAppointmentService.execute({
      user_id: 'user-1',
      date,
      provider_id: 'provider-1',
    });

    await expect(
      createAppointmentService.execute({
        user_id: 'user-1',
        date,
        provider_id: 'provider-2',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 10, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        user_id: 'user-1',
        date: new Date(2020, 4, 9, 12),
        provider_id: 'provider-2',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8 or after 17', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 10, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        user_id: 'user-1',
        date: new Date(2020, 5, 11, 7),
        provider_id: 'provider-2',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentService.execute({
        user_id: 'user-1',
        date: new Date(2020, 5, 11, 18),
        provider_id: 'provider-2',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
