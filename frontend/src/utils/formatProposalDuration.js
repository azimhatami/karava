import { toPersianNumbers } from './toPersianNumbers';

export const DURATION_UNIT_OPTIONS = [
  { value: 'day', label: 'روز' },
  { value: 'week', label: 'هفته' },
  { value: 'month', label: 'ماه' },
];

const DURATION_UNIT_LABELS = {
  day: 'روز',
  week: 'هفته',
  month: 'ماه',
};

export function getDurationUnitLabel(unit = 'day') {
  return DURATION_UNIT_LABELS[unit] || DURATION_UNIT_LABELS.day;
}

export function formatProposalDuration(duration, unit = 'day') {
  if (duration == null || duration === '') return '—';
  return `${toPersianNumbers(duration)} ${getDurationUnitLabel(unit)}`;
}
