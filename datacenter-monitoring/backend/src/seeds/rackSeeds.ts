import { Rack } from '../entities/Rack';

export const rackSeeds: Partial<Rack>[] = [
  // Zone A Racks
  {
    id: 'RBT-A1',
    zone: 'A',
    position: 1,
    height: '42U',
    power_capacity: 12000,
    temperature: 22.5,
  },
  {
    id: 'RBT-A2',
    zone: 'A',
    position: 2,
    height: '42U',
    power_capacity: 12000,
    temperature: 22.8,
  },
  {
    id: 'RBT-A3',
    zone: 'A',
    position: 3,
    height: '42U',
    power_capacity: 12000,
    temperature: 23.1,
  },
  {
    id: 'RBT-A4',
    zone: 'A',
    position: 4,
    height: '42U',
    power_capacity: 12000,
    temperature: 22.9,
  },

  // Zone B Racks
  {
    id: 'RBT-B1',
    zone: 'B',
    position: 1,
    height: '42U',
    power_capacity: 12000,
    temperature: 22.3,
  },
  {
    id: 'RBT-B2',
    zone: 'B',
    position: 2,
    height: '42U',
    power_capacity: 12000,
    temperature: 22.7,
  },
  {
    id: 'RBT-B3',
    zone: 'B',
    position: 3,
    height: '42U',
    power_capacity: 12000,
    temperature: 22.9,
  },
  {
    id: 'RBT-B4',
    zone: 'B',
    position: 4,
    height: '42U',
    power_capacity: 12000,
    temperature: 23.0,
  },

  // Zone C Racks
  {
    id: 'RBT-C1',
    zone: 'C',
    position: 1,
    height: '42U',
    power_capacity: 15000,
    temperature: 21.8,
  },
  {
    id: 'RBT-C2',
    zone: 'C',
    position: 2,
    height: '42U',
    power_capacity: 15000,
    temperature: 22.1,
  },
  {
    id: 'RBT-C3',
    zone: 'C',
    position: 3,
    height: '42U',
    power_capacity: 15000,
    temperature: 22.4,
  },
  {
    id: 'RBT-C4',
    zone: 'C',
    position: 4,
    height: '42U',
    power_capacity: 15000,
    temperature: 22.2,
  },
];