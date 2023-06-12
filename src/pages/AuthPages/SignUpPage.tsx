import { Alert, Button, Checkbox, HelperText, Label } from "flowbite-react";
import { FC, useState } from "react";
import 'react-phone-input-2/lib/bootstrap.css'
import '../../styles/phone-input.scss'
import BackArrow from "../../components/BackArrow";
import { useForm } from "react-hook-form";
import TextValidInput from "../../components/TextValidInput";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import LoadingIndicator from "../../components/loading-indicator/LoadingIndicator";
import { HiInformationCircle } from "react-icons/hi";

const SignUpPage: FC = function () {
  const { register, handleSubmit, getValues, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
      password: ""
    }
  });
  const navigate = useNavigate();
  const { isLoading, registerManager } = useAuth();
  const [accepts, setAccepts] = useState<boolean>(false);
  const [formSent, setFormSent] = useState<boolean>(false);
  const [registerState, setRegisterState] = useState<number>(0);

  const onSubmit = async () => {
    setFormSent(true);
    if (!accepts)
      return;

    const result = await registerManager(getValues("email"), getValues("password"));
    console.log(result);
    if (result)
      setRegisterState(1);
    else
      setRegisterState(-1);
  }

  return (
    isLoading
      ? <LoadingIndicator />
      : <form onSubmit={handleSubmit(onSubmit)}>
        {
          registerState == 1
            ? <>
              <div>
                <h3 className="text-4xl font-bold mb-2">
                  Успішно зареєстровано!
                </h3>
                <p className="text-base text-gray-500 dark:text-gray-300">
                  Ми надіслали вам лист на <b>{getValues("email")}</b> <br /><br />
                  Будь ласка, підтвердіть реєстрацію, щоб активувати аккаунт
                </p>
              </div>
              <Button color="gray" size="lg" className="w-full" onClick={() => navigate("/auth/sign-in-email")}>
                Повернутися до входу
              </Button>
            </>
            : <>
              <div>
                <BackArrow>Назад</BackArrow>
                <h3 className="text-4xl font-bold mb-2">
                  Створіть обліковий запис
                </h3>
                <p className="text-base text-gray-500 dark:text-gray-300">Будь ласка, введіть ваші дані.</p>
              </div>
              {registerState == -1 &&
                <Alert
                  color="failure"
                  icon={HiInformationCircle}
                >
                  <span>
                    <span className="font-medium">
                      Помилка!
                    </span>
                    {' '}Не вдалось зареєструати користувача, перевірте введені дані, можливо такий користувач вже існує
                  </span>
                </Alert>
              }
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
              <TextValidInput
                {...register("password", {
                  required: "Поле є обов'язковим",
                  pattern: {
                    value: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_\\-]{8,32}$/,
                    message: "Пароль повинен містити: принаймні 1 літеру латинського алфавіту, принаймні 1 цифру, може містити символи !@#$%^&*()_ Довжина паролю від 8 до 32 символів."
                  }
                })
                }
                labelText="Пароль"
                placeholder="••••••••"
                type="password"
                errorMessage={errors.password?.message}
              />
              <div>
                <div className="flex items-center gap-x-3 mb-1">
                  <Checkbox onChange={() => setAccepts(!accepts)} />
                  <Label htmlFor="acceptTerms">
                    Я даю згоду на обробку даних
                  </Label>
                </div>
                {(!accepts && formSent) && <HelperText>Для реєстраії необхідна згода</HelperText>}
              </div>
              <div className="mb-2">
                <Button color="primary" size="lg" className="w-full" type="submit">
                  Зареєструватись
                </Button>
              </div>
            </>
        }
      </form>
  );
};

export default SignUpPage;
