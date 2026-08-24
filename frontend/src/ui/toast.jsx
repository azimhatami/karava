import hotToast from 'react-hot-toast';
import KaravaToast from './KaravaToast';

function showToast(variant, title, options = {}) {
  const { subtitle, duration = 4000, ...rest } = options;

  return hotToast.custom(
    (t) => (
      <KaravaToast
        t={t}
        variant={variant}
        title={title}
        subtitle={subtitle}
      />
    ),
    { duration, ...rest },
  );
}

export const toast = {
  success(title, options) {
    return showToast('success', title, options);
  },
  error(title, options) {
    return showToast('error', title, options);
  },
  info(title, options) {
    return showToast('info', title, options);
  },
};

export default toast;
