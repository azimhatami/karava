import { Link } from 'react-router-dom';
import AuthContainer from '../features/authentication/AuthContainer';

const Auth = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-ink px-4 py-12">
      <Link to="/" className="flex items-baseline gap-2.5">
        <span className="font-['Sora',_sans-serif] text-[19px] font-bold tracking-[0.14em] text-ink-mint">
          KARAVA
        </span>
        <span className="text-xl font-black text-[#F2F6F4]">کارآوا</span>
      </Link>

      <AuthContainer />

      <p className="text-[13px] text-ink-dim">
        سامانه کاریابی و مدیریت پروژه
      </p>
    </div>
  );
};

export default Auth;
