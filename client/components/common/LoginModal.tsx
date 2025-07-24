import { RootState } from '@/stores/store';

import { useDispatch, useSelector } from 'react-redux';
import { LoginStep1 } from '../sections/LoginStep1';
import { LoginStep2 } from '../sections/LoginStep2';
import { handleLoginClose } from '@/stores/slices/loginSlice';

export default function LoginModal() {
  const { step, isLoginOpen } = useSelector((state: RootState) => state.login);
  const dispatch = useDispatch();

  if (!isLoginOpen) {
    return null;
  }

  return (
    <div
      onClick={() => dispatch(handleLoginClose())}
      className="fixed inset-0 bg-black/20 flex items-center justify-center z-[999]">
      {step === 1 && <LoginStep1 />}
      {step === 2 && <LoginStep2 />}
    </div>
  );
}
