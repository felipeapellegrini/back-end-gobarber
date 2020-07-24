import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

interface IRequest {
  user_id: string;
  provider_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
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

    const dateFormatted = format(
      appointmentDate,
      "dd/MM/yyyy 'às' HH'h'mm'min",
    );

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para o dia ${dateFormatted}`,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        'yyyy-M-d',
      )}`,
    );

    return appointment;
  }
}

export default CreateAppointmentService;
