import { getConfig } from '@edx/frontend-platform';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) { return parts.pop().split(';').shift(); }
};

// eslint-disable-next-line no-unused-vars
export default function timeLocale(number, index, totalSec) {
  let languageCode = 'en';
  try {
    languageCode = getCookie(getConfig().LANGUAGE_PREFERENCE_COOKIE_NAME);
  } catch {}

  if (languageCode === 'vi') {
    return [
      ['vừa đăng', 'vừa đăng'],
      ['%s giây trước', '%s giây trước'],
      ['1 phút trước', '1 phút trước'],
      ['%s phút trước', '%s phút trước'],
      ['1 giờ trước', '1 giờ trước'],
      ['%s giờ trước', '%s giờ trước'],
      ['1 ngày trước', '1 ngày trước'],
      ['%s ngày trước', '%s ngày trước'],
      ['1 tuần trước', '1 tuần trước'],
      ['%s tuần trước', '%s tuần trước'],
      ['4 tuần trước', '1 tháng trước'],
      [`${number * 4} tuần trước`, '%s tháng trước'],
      ['1 năm trước', '1 năm trước'],
      ['%s năm trước', 'in %s năm trước'],
    ][index];
  }

  return [
    ['just now', 'right now'],
    ['%ss', 'in %s seconds'],
    ['1m', 'in 1 minute'],
    ['%sm', 'in %s minutes'],
    ['1h', 'in 1 hour'],
    ['%sh', 'in %s hours'],
    ['1d', 'in 1 day'],
    ['%sd', 'in %s days'],
    ['1w', 'in 1 week'],
    ['%sw', 'in %s weeks'],
    ['4w', 'in 1 month'],
    [`${number * 4}w`, 'in %s months'],
    ['1y', 'in 1 year'],
    ['%sy', 'in %s years'],
  ][index];
}
