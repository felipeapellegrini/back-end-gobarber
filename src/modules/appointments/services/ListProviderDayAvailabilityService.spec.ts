import FakeAppointmentsRepositories from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepositories;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepositories();
    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });
  it('should be able to list the day availability from provider', async () => {
    await fakeAppointmentsRepository.create({
      date: new Date(2020, 1, 20, 14, 0, 0),
      provider_id: 'provider',
    });

    await fakeAppointmentsRepository.create({
      date: new Date(2020, 1, 20, 15, 0, 0),
      provider_id: 'provider',
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 1, 20, 11).getTime();
    });

    const dayAvailability = await listProviderDayAvailability.execute({
      provider_id: 'provider',
      year: 2020,
      month: 2,
      day: 20,
    });

    expect(dayAvailability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 11, available: false },
        { hour: 12, available: true },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: false },
      ]),
    );
  });
});
