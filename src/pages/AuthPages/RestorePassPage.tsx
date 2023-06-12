import { Button } from "flowbite-react";
import { FC, useState } from "react";
import 'react-phone-input-2/lib/bootstrap.css'
import '../../styles/phone-input.scss'
import { useNavigate } from "react-router-dom";
import BackArrow from "../../components/BackArrow";
import { useForm } from "react-hook-form";
import TextValidInput from "../../components/TextValidInput";
import useAuth from "../../hooks/useAuth";

const RestorePassPage: FC = function () {
  const { register, handleSubmit, getValues, formState: { errors } } = useForm({
    defaultValues: {
      email: ""
    }
  });
  const { restorePassword } = useAuth();
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [emailResent, setEmailResent] = useState<boolean>(false);

  const onRestoreSubmit = async() => {
    await restorePassword(getValues("email"));
    setEmailSent(true);
  }

  const resendEmail = async() => {
    await restorePassword(getValues("email"));
    setEmailResent(true);
  }

  return (
    <form onSubmit={handleSubmit(onRestoreSubmit)}>
      {
        emailSent
          ? <>
            <div>
              <h3 className="text-4xl font-bold mb-2">
                Перевірте ваш Email
              </h3>
              <p className="text-base text-gray-500 dark:text-gray-300">
                Ми надіслали вам лист на <b>{getValues("email")}</b> <br /><br />
                Будь ласка, слідуйте інструкціям в листі, для відновлення паролю
              </p>
            </div>
            {!emailResent &&
              <Button color="primary" size="lg" className="w-full" onClick={resendEmail}>
                Відправити лист повторно
              </Button>
            }
            <Button color="gray" size="lg" className="w-full" onClick={() => navigate("/auth/sign-in-email")}>
              Повернутися до входу
            </Button>
          </>
          : <>
            <BackArrow>Назад</BackArrow>
            <div>
              <h3 className="text-4xl font-bold mb-2">
                Забули пароль?
              </h3>
              <p className="text-base text-gray-500 dark:text-gray-300">
                Введіть email, прив’язаний до облікового запису.
              </p>
            </div>
            <TextValidInput
              {...register("email", {
                required: "Поле є обов'язковим", pattern: {
                  value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: 'Формат не є корректним',
                },
              })}
              labelText="E-mail"
              placeholder="name@mail.com"
              type="text"
              errorMessage={errors.email?.message}
            />
            <div className="mb-2">
              <Button color="primary" size="lg" className="w-full" type="submit">
                Відновлення паролю
              </Button>
            </div>
          </>
      }
    </form>
  );
};

export default RestorePassPage;
