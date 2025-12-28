// src/pages/Signup/Signup.jsx
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import checkIcon from '../../assets/icon/check.svg';
import { useSignupFlow } from './useSignupFlow';

import Step1Agreement from './steps/Step1Agreement';
import Step2EmailVerify from './steps/Step2EmailVerify';
import Step3Password from './steps/Step3Password';
import Step4Profile from './steps/Step4Profile';

export default function Signup() {
  const navigate = useNavigate();
  const axiosConfig = useMemo(() => ({ withCredentials: true }), []);
  const flow = useSignupFlow({ navigate, axiosConfig });

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-[#191919] pt-[15vh]">
      <div className="mb-12 flex h-[42px] items-center justify-center">
        <h1 className="text-[32px] font-medium tracking-[-0.02em] leading-[1.4] text-white">
          회원가입
        </h1>
      </div>

      {flow.step === 1 && (
        <Step1Agreement
          agreed={flow.agreed}
          setAgreed={flow.setAgreed}
          onNext={() => flow.setStep(2)}
          onBack={() => navigate('/login')}
          checkIcon={checkIcon}
        />
      )}

      {flow.step === 2 && (
        <Step2EmailVerify
          email={flow.email}
          onChangeEmail={flow.setEmailAndResetVerify}
          mailSent={flow.mailSent}
          emailToken={flow.emailToken}
          onChangeToken={flow.setEmailTokenPersist}
          emailVerified={flow.emailVerified}
          inlineMessage={flow.inlineMessage}
          inlineType={flow.inlineType}
          onSendEmail={flow.handleEmailAuth}
          onVerifyToken={flow.handleVerifyToken}
          onNext={flow.handleStep2Next}
          onBack={() => flow.setStep(1)}
        />
      )}

      {flow.step === 3 && (
        <Step3Password
          password={flow.password}
          setPassword={flow.setPassword}
          confirmPassword={flow.confirmPassword}
          setConfirmPassword={flow.setConfirmPassword}
          errorMessage={flow.errorMessage}
          onNext={flow.handleStep3Next}
          onBack={() => {
            flow.setErrorMessage('');
            flow.setStep(2);
          }}
        />
      )}

      {flow.step === 4 && (
        <Step4Profile
          userName={flow.userName}
          setUserName={flow.setUserName}
          generation={flow.generation}
          setGeneration={flow.setGeneration}
          userClass={flow.userClass}
          setUserClass={flow.setUserClass}
          userNumber={flow.userNumber}
          setUserNumber={flow.setUserNumber}
          onNumberChange={flow.handleNumberChange}
          errorMessage={flow.errorMessage}
          isStep4Valid={flow.isStep4Valid}
          onComplete={flow.handleComplete}
        />
      )}
    </div>
  );
}
