import { Button } from "flowbite-react";
import { FC, useEffect, useState } from "react";
import 'react-phone-input-2/lib/bootstrap.css'
import '../../styles/phone-input.scss'
import useAuth from "../../hooks/useAuth";
import LoadingIndicator from "../../components/loading-indicator/LoadingIndicator";
import { useNavigate } from "react-router";

const EmailVerifPage: FC = function () {
  const { currentUser, isLoading, sendVerifEmail, signOutRequest } = useAuth();
  const [emailResent, setEmailResent] = useState<boolean>(false);
  const navigator = useNavigate();

  const resendEmail = async () => {
    await sendVerifEmail();
    setEmailResent(true);
  }

  useEffect(() => {
    if(currentUser && currentUser.emailVerified)
      navigator("/")
  }, [currentUser])

  return (
    isLoading
      ? <LoadingIndicator />
      : <form>
        <div>
          <h3 className="text-4xl font-bold mb-2">
            Перевірте ваш Email
          </h3>
          <p className="text-base text-gray-500 dark:text-gray-300">
            Ми надіслали вам лист-підтвердження на <b>{ currentUser?.email }</b> <br /><br />
          </p>
        </div>
        {!emailResent &&
          <Button color="primary" size="lg" className="w-full" onClick={resendEmail}>
            Відправити лист повторно
          </Button>
        }
        <Button color="gray" size="lg" className="w-full"
          onClick={() => signOutRequest().then(() => navigator("/"))}>
          Повернутися до входу
        </Button>
      </form>
  );
};

export default EmailVerifPage;
