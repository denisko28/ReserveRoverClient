import { Alert, Button } from "flowbite-react";
import { FC, useState } from "react";
import 'react-phone-input-2/lib/bootstrap.css'
import '../../styles/phone-input.scss'
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import TextValidInput from "../../components/TextValidInput";
import useAuth from "../../hooks/useAuth";
import LoadingIndicator from "../../components/loading-indicator/LoadingIndicator";
import { HiInformationCircle } from "react-icons/hi";

const SignInEmailPage: FC = function () {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
      password: "",
    }
  });
  const navigator = useNavigate();
  const { isLoading, signInWithEmailAndPasswordRequest } = useAuth();
  const [unsuccessLogin, setUnsuccessLogin] = useState<boolean>(false);

  const onSubmit = async (data: any) => {
    const result = await signInWithEmailAndPasswordRequest(data.email, data.password);
    if (result?.user)
      navigator("/");
    setUnsuccessLogin(true);
  }

  return (
    isLoading
      ? <LoadingIndicator />
      : <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h3 className="text-4xl font-bold mb-2">
            Вітаємо!
          </h3>
          <p className="text-gray-500 dark:text-gray-300">Будь ласка, введіть ваші дані.</p>
        </div>
        {unsuccessLogin &&
          <Alert
            color="failure"
            icon={HiInformationCircle}
          >
            <span>
              <span className="font-medium">
                Помилка!
              </span>
              {' '}Не вдалося увійти, перевірте email та пароль
            </span>
          </Alert>
        }
        <TextValidInput
          {...register("email", {
            required: "Поле є обов'язковим",
            pattern: {
              value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: 'Формат не є корректним',
            },
          })}
          labelText="E-mail"
          placeholder="name@mail.com"
          type="text"
          errorMessage={errors.email?.message}
        />
        <div className="w-full flex flex-col items-end">
          <TextValidInput
            {...register("password", { required: "Поле є обов'язковим" })}
            labelText="Пароль"
            placeholder="••••••••"
            type="password"
            errorMessage={errors.password?.message}
          />
          <Link
            to="/auth/restore-pass"
            className="mt-2 text-right text-primary-700"
          >
            Забув пароль?
          </Link>
        </div>
        <div className="mb-2">
          <Button color="primary" size="lg" type="submit" className="w-full">
            Увійти
          </Button>
        </div>
        <p className="text-gray-500 dark:text-gray-300">
          Немає облікового запису?&nbsp;
          <Link to="/auth/sign-up" className="text-primary-700">
            Зареєструватись
          </Link>
        </p>
        <hr />
        <p className="text-gray-500 dark:text-gray-300">
          Ви не є власником або адміністратором закладу?&nbsp;
          <Link to="/auth/sign-in-phone" className="text-primary-700">
            Увійдіть як клієнт
          </Link>
        </p>
      </form>
  );
};

export default SignInEmailPage;
