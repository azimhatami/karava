import { useEffect, useState } from 'react';
import ProfileIncompleteModal from '../../ui/ProfileIncompleteModal';

let showIncompleteHandler = null;

export function showProfileIncompleteModal(payload = {}) {
  if (typeof showIncompleteHandler === 'function') {
    showIncompleteHandler({
      message: payload.message || '',
      missingFields: payload.missingFields || [],
      profilePath: payload.profilePath || '/freelancer/profile',
    });
    return true;
  }
  return false;
}

export function ProfileIncompleteHost() {
  const [state, setState] = useState(null);

  useEffect(() => {
    showIncompleteHandler = setState;
    return () => {
      showIncompleteHandler = null;
    };
  }, []);

  return (
    <ProfileIncompleteModal
      open={Boolean(state)}
      onClose={() => setState(null)}
      message={state?.message}
      missingFields={state?.missingFields}
      profilePath={state?.profilePath}
    />
  );
}
