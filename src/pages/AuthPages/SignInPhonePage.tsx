/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button } from "flowbite-react";
import { FC } from "react";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/bootstrap.css'
import '../../styles/phone-input.scss'
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import CustomModal from "../../components/modals/CustomModal";
import useModal from "../../hooks/useModal";
import ReactInputVerificationCode from "react-input-verification-code";
import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import LoadingIndicator from "../../components/loading-indicator/LoadingIndicator";

const SignInPhonePage: FC = function () {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      phone: ""
    }
  });
  const navigate = useNavigate();
  const { isOpen, toggle } = useModal();
  const { signInWithPhoneNumberRequest, otpConfirmation, isLoading } = useAuth();

  const onSubmitOtp = async (otpCode: string) => {
    if (!otpCode || otpCode.includes("·"))
      return

    const result = await otpConfirmation(otpCode)
    if (!result) {
      alert("Incorrect OTP");
      return;
    }
    navigate("/");
  };

  const onSignInSubmit = async (data: any) => {
    if (isOpen)
      return;

    const confirmation = await signInWithPhoneNumberRequest("+" + data.phone);
    if (confirmation)
      toggle();
  }

  return (
    <form onSubmit={handleSubmit(onSignInSubmit)}>
      <div>
        <h3 className="text-4xl font-bold mb-2">
          Вітаємо!
        </h3>
        <p className="text-base text-gray-500 dark:text-gray-300">Будь ласка, введіть ваші дані.</p>
      </div>
      <div>
        <PhoneInput
          {...register("phone", {
            required: "Поле є обов'язковим",
            pattern: {
              value: /^(?:[0-9]\●?){8,13}[0-9]$/,
              message: 'Формат не є корректним',
            },
          })}
          isValid={errors.phone?.message == undefined}
          country={'ua'}
          specialLabel="Номер телефону"
          onChange={phone => setValue("phone", phone)}
          containerClass="flex flex-col items-start gap-y-2"
          inputClass="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 rounded-lg px-3 py-2 text-sm bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 rounded-lg p-2.5 text-sm"
        />
        <p className="mt-2 text-sm text-red-700">{errors.phone?.message}</p>
      </div>
      {
        isLoading && <LoadingIndicator/>
      }
      <div className="mb-2">
        <Button color="primary" size="lg" type="submit" className="w-full">
          Увійти
        </Button>
      </div>
      <hr />
      <p className="text-base text-gray-500 dark:text-gray-300">
        Ви є власником закладу?&nbsp;
        <Link to="/auth/sign-in-email" className="text-primary-700">
          Увійдіть як менеджер
        </Link>
      </p>
      <CustomModal className="flex flex-col items-center gap-5" isOpen={isOpen} toggle={toggle}>
        <p className="text-xl font-medium">Введіть код з SMS</p>
        <p className="text-base text-gray-500">Ми надіслали вам SMS з кодом підтвердження. Будь ласка введіть його в наступне поле.</p>
        <ReactInputVerificationCode length={6} onCompleted={onSubmitOtp} />
        <Button color="primary" size="lg">
          Відправити
        </Button>
      </CustomModal>
    </form>
  );
};

export default SignInPhonePage;
