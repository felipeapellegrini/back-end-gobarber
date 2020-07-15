import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../fakes/FakeAppointmentsRepository';
import CreateAppointmentService from '../../modules/appointments/services/CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appointment = await createAppointmentService.execute({
      date: new Date(),
      provider_id: '123123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123');
    expect(appointment.date).toBeInstanceOf(Date);
  });

  it('should not be able to create two appointments in the same date, for the same provider', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const date = new Date();
    const provider_id = '123123';

    await createAppointmentService.execute({
      date,
      provider_id,
    });

    expect(
      createAppointmentService.execute({
        date,
        provider_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
