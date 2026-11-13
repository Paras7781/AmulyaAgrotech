import type { LucideIcon } from 'lucide-react';

export type LandmarkId = 'drones' | 'spraying' | 'fieldOps' | 'subsidy' | 'gallery' | 'quotation';

export interface LandmarkConfig {
  id: LandmarkId;
  number: string;
  key: string;
  route: string;
  xPercent: number; // 0 - 100
  yPercent: number; // 0 - 100
  icon: LucideIcon;
  image: string;
}

