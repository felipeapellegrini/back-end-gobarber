import { startOfHour, isBefore, getHours } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
  user_id: string;
  provider_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentRepository,
  ) { }// eslint-disable-line prettier/prettier

  public async execute({
    user_id,
    provider_id,
    date,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (user_id === provider_id) {
      throw new AppError('You cannot create an appointment with yourself', 403);
    }

    const compareHour = getHours(appointmentDate);

    if (compareHour < 8 || compareHour > 17) {
      throw new AppError('Sorry, we open are available from 8 to 17');
    }

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError('You shall not go back in past! 🧙');
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDateAndProvider(
      {
        provider_id,
        date: appointmentDate,
      },
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked. 😟');
    }

    const checkAppointmentsFromUser = await this.appointmentsRepository.findByDateAndClient(
      {
        user_id,
        date: appointmentDate,
      },
    );

    if (checkAppointmentsFromUser) {
      throw new AppError(
        'You have already booked in this hour, please cancel it first',
      );
    }

    const appointment = await this.appointmentsRepository.create({
      user_id,
      provider_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
