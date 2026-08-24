import { Toaster } from 'react-hot-toast';

function KaravaToaster() {
  return (
    <Toaster
      position="top-center"
      containerStyle={{ top: 24 }}
      toastOptions={{
        duration: 4000,
      }}
    />
  );
}

export default KaravaToaster;
