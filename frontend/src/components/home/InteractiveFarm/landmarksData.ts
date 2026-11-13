import {
  Camera,
  Droplets,
  FileSpreadsheet,
  Navigation,
  Radio,
  ShieldCheck,
} from 'lucide-react';
import { media } from '../../../data/mockData';
import type { LandmarkConfig } from './types';

export const LANDMARKS: LandmarkConfig[] = [
  {
    id: 'drones',
    number: '01',
    key: 'drones',
    route: '/drones',
    xPercent: 77,
    yPercent: 24,
    icon: Navigation,
    image: media.drone,
  },
  {
    id: 'spraying',
    number: '02',
    key: 'spraying',
    route: '/services',
    xPercent: 42,
    yPercent: 42,
    icon: Droplets,
    image: media.crop,
  },
  {
    id: 'fieldOps',
    number: '03',
    key: 'fieldOps',
    route: '/services',
    xPercent: 66,
    yPercent: 62,
    icon: Radio,
    image: media.aerial,
  },
  {
    id: 'subsidy',
    number: '04',
    key: 'subsidy',
    route: '/subsidy',
    xPercent: 21,
    yPercent: 68,
    icon: ShieldCheck,
    image: media.field,
  },
  {
    id: 'gallery',
    number: '05',
    key: 'gallery',
    route: '/gallery',
    xPercent: 16,
    yPercent: 28,
    icon: Camera,
    image: media.rows,
  },
  {
    id: 'quotation',
    number: '06',
    key: 'quotation',
    route: '/quotation',
    xPercent: 86,
    yPercent: 74,
    icon: FileSpreadsheet,
    image: '/assets/campaigns/amulya-agrotech-company-poster.jpeg',
  },
];

