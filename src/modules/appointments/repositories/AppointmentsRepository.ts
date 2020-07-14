import { EntityRepository, Repository } from 'typeorm';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointments';

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {
  public async findByDate(
    date: Date,
    provider_id: string, // eslint-disable-line camelcase
  ): Promise<Appointment | null> {
    const findAppointment = await this.findOne({
      where: { date, provider_id },
    });

    return findAppointment || null;
  }
}

export default AppointmentsRepository;
