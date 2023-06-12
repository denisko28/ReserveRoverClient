import { Button, Avatar } from "flowbite-react";
import { ChangeEvent, FC, useRef, useState } from "react";
import "../../styles/overlay-avatar.scss"
import BackArrow from "../../components/BackArrow";
import { HiOutlinePhotograph } from "react-icons/hi";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router";
import LoadingIndicator from "../../components/loading-indicator/LoadingIndicator";
import TextValidInput from "../../components/TextValidInput";
import { useForm } from "react-hook-form";

const UserNameAndPhotoPage: FC = function () {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            fName: "",
            sName: ""
        }
    });
    const navigator = useNavigate();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { setUserPhoto, setUserName, isLoading } = useAuth();
    const [photoUrl, setPhotoUrl] = useState<string>("");

    const handleUploadClick = () => {
        inputRef.current?.click();
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) {
            return;
        }

        const userPhotoUrl = await setUserPhoto(e.target.files[0]);
        setPhotoUrl(userPhotoUrl);
    };

    const onSubmit = async (data: any) => {
        await setUserName(data.fName + " " + data.sName);
        navigator("/");
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <BackArrow>Назад</BackArrow>
                <h3 className="text-4xl font-bold mb-2">
                    Дані про себе
                </h3>
                <p className="text-base text-gray-500 dark:text-gray-300">Будь ласка, введіть заповніть поля та, за бажанням, завантажте аватар.</p>
            </div>

            <input
                type="file"
                ref={inputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
            {
                isLoading
                    ? <LoadingIndicator />
                    : <div className="mt-5 mb-2 mx-auto overlay-cont" onClick={handleUploadClick}>
                        <Avatar
                            size="lg"
                            alt='User settings'
                            img={photoUrl}
                        />
                        <div className="overlay">
                            <HiOutlinePhotograph className="icon-48" />
                        </div>
                    </div>
            }
            <TextValidInput
                {...register("fName", {
                    required: "Поле є обов'язковим",
                    pattern: {
                        value: /^\p{L}+$/u,
                        message: "Ім'я повинно складатися лише з букв",
                    },
                })}
                labelText="Імʼя"
                placeholder="Антрій"
                type="text"
                errorMessage={errors.fName?.message}
            />
            <TextValidInput
                {...register("sName", {
                    required: "Поле є обов'язковим", 
                    pattern: {
                        value: /^\p{L}+$/u,
                        message: "Прізвище повинно складатися лише з букв",
                    },
                })}
                labelText="Прізвище"
                placeholder="Петренко"
                type="text"
                errorMessage={errors.sName?.message}
            />
            <div className="mb-2">
                <Button color="primary" size="lg" className="w-full" type="submit">
                    Додати інформацію
                </Button>
            </div>
        </form>
    )
}

export default UserNameAndPhotoPage;