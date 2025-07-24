const azerbaijaniMonths = [
  'yanvar',
  'fevral',
  'mart',
  'aprel',
  'may',
  'iyun',
  'iyul',
  'avqust',
  'sentyabr',
  'oktyabr',
  'noyabr',
  'dekabr',
];

export function formatDate(isoDate: string) {
  if (!isoDate) return '';

  const date = new Date(isoDate);
  const day = date.getDate();
  const month = azerbaijaniMonths[date.getMonth()];

  return `${day} ${month}`;
}
