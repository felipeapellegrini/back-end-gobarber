import FakeAppointmentsRepositories from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepositories;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepositories();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });
  it('should be able to list the month availability from provider', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      date: new Date(2020, 1, 20, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      date: new Date(2020, 1, 20, 9, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      date: new Date(2020, 1, 20, 10, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      date: new Date(2020, 1, 20, 11, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      date: new Date(2020, 1, 20, 12, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      date: new Date(2020, 1, 20, 13, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      date: new Date(2020, 1, 20, 14, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      date: new Date(2020, 1, 20, 15, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      date: new Date(2020, 1, 20, 16, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      date: new Date(2020, 1, 20, 17, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      date: new Date(2020, 1, 21, 9, 0, 0),
    });

    const monthAvailability = await listProviderMonthAvailability.execute({
      provider_id: 'provider',
      year: 2020,
      month: 2,
    });

    expect(monthAvailability).toEqual(
      expect.arrayContaining([
        { day: 20, available: false },
        { day: 21, available: true },
      ]),
    );
  });
});
