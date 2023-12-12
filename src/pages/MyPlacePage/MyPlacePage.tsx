import { ChangeEvent, FC, useEffect, useRef } from "react"
import styles from "./MyPlacePage.module.scss";
import { Button, Checkbox, HelperText, Label, Select, Textarea } from "flowbite-react";
import TextValidInput from "../../components/TextValidInput";
import { useForm } from "react-hook-form";
import { HiOutlineCamera } from "react-icons/hi";
import { set } from "date-fns";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { fetchCities } from "../../redux/slices/citiesSlice";
import { createPlace, setPlaceImages, uploadPlaceImg } from "../../redux/slices/placesSlice";
import NoPlaceYet from "../../components/no-place-yet";
import { useNavigate, useParams } from "react-router-dom";
import PAYMENT_METHODS from "../../enums/paymentMethods";
import { ModerationStatuses } from "../../enums/moderationStatuses";
import NotModeratedYet from "../../components/not-moderated-yet";
import { getPlaceDetails } from "../../redux/slices/placeDetailsSlice";
import LoadingIndicator from "../../components/loading-indicator/LoadingIndicator";
import { getManagersPlaceInfo } from "../../redux/slices/userInfoSlice";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

const generateTimeOptions = () => {
  const startTime = set(new Date(), { hours: 0, minutes: 0 });
  const endTime = set(new Date(), { hours: 23, minutes: 30 });

  const timeOptions = [];
  let currentTime = new Date(startTime);

  while (currentTime <= endTime) {
    const option = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    timeOptions.push(<option key={option} value={option}>{option}</option>);

    currentTime.setMinutes(currentTime.getMinutes() + 30);
  }

  return timeOptions;
};

const EMPTY_DEFAULT_VALUES = {
  title: "",
  opensAt: "",
  closesAt: "",
  cityId: "",
  avgBill: "",
  address: "",
  description: "",
  paymentMethods: new Array<string>
};

const MyPlacePage: FC = function () {
  const navigator = useNavigate();
  const { action } = useParams();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const selector = useAppSelector(state => state);
  const { cities } = selector.cities;
  const { managerPlaceInfo } = selector.userInfo;
  const { placeImages } = selector.places;
  const { placeDetails, status, error } = selector.placeDetails;
  const dispatch = useAppDispatch();

  const { currentUser } = useAuth();

  useEffect(() => {
    dispatch(fetchCities());

    if (managerPlaceInfo?.id && action === "edit") {
      dispatch(getPlaceDetails(managerPlaceInfo?.id));
    }
  }, [dispatch])

  useEffect(() => {
    if (!placeDetails)
      return;
    dispatch(setPlaceImages(placeDetails.imageUrls))
  }, [placeDetails])

  const { register, handleSubmit, formState: { errors, isSubmitted } } = useForm({
    values: (action === "create" || !placeDetails) ? EMPTY_DEFAULT_VALUES : {
      title: placeDetails.title,
      opensAt: placeDetails.opensAt.slice(0, -3),
      closesAt: placeDetails.closesAt.slice(0, -3),
      cityId: placeDetails.cityId,
      avgBill: placeDetails.avgBill,
      address: placeDetails.address,
      description: placeDetails.description,
      paymentMethods: placeDetails.paymentMethods.map((method: number) => method.toString())
    }
  });

  const onSubmit = async (data: any) => {
    const placeParams = { ...data };
    placeParams.mainImageUrl = placeImages[0];
    placeParams.imageUrls = placeImages;
    placeParams.opensAt += ":00";
    placeParams.closesAt += ":00";
    placeParams.cityId = +placeParams.cityId;
    placeParams.avgBill = +placeParams.avgBill;
    placeParams.paymentMethods = placeParams.paymentMethods.map((method: string) => +method);

    debugger;
    if (action === "create") {
      toast.promise(
        createPlace(placeParams),
        {
          pending: 'Обробка',
          success: 'Заклад успішно створено 👌',
          error: 'Помилка! Не вдалося створити заклад 🤯'
        }
      ).then(() => {
        if (currentUser)
          dispatch(getManagersPlaceInfo(currentUser.uid));
      });
    }
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) {
      return;
    }

    dispatch(uploadPlaceImg(e.target.files[0]));
  };

  let content;
  if (status === 'failed') {
    content = <p>{error}</p>;
  } else if (status === 'loading') {
    content = <div className="flex flex-col justify-center h-80"><LoadingIndicator /></div>
  } else {
    const paymentCheckboxes = PAYMENT_METHODS.map(((payment, index) =>
      ({ value: index.toString(), label: payment })));

    const timeOptions = generateTimeOptions();
    const cityOptions = cities.map(city => <option key={city.id} value={city.id}>{city.name}</option>);

    content = <>
      {
        !managerPlaceInfo && action !== "create"
          ? <NoPlaceYet onClick={() => navigator("/my-place/create")} />
          : (managerPlaceInfo?.moderationStatus === ModerationStatuses.Requested
            ? <NotModeratedYet />
            : <>
              <div className="flex flex-row gap-8">
                <TextValidInput
                  {...register("title", {
                    value: "vddv",
                    required: "Поле є обов'язковим",
                    pattern: {
                      value: /[\p{L}0-9\s-]{4,80}/u,
                      message: 'Назва повинна бути від 4 до 80 символів та складатись лише із букв, цифр, дефісів та пробілів',
                    },
                  })}
                  labelText="Назва"
                  placeholder="Назва закладу..."
                  type="text"
                  errorMessage={errors.title?.message}
                  className="w-fill"
                />
                <div className="w-fit flex flex-col gap-y-2">
                  <Label>Працює</Label>
                  <div className="flex flex-row gap-3 items-center">
                    З
                    <Select className="w-36" color={errors.opensAt ? "failure" : "gray"}
                      {...register("opensAt", { required: true })}>
                      {timeOptions}
                    </Select>
                    до
                    <Select className="w-36" color={errors.closesAt ? "failure" : "gray"}
                      {...register("closesAt", { required: true })}>
                      {timeOptions}
                    </Select>
                  </div>
                  <HelperText>
                    {errors.opensAt || errors.closesAt ? "Поля є обов'язковими" : ""}
                  </HelperText>
                </div>
              </div>
              <div className="flex flex-row gap-8">
                <div className="w-fit flex flex-col gap-y-2">
                  <Label>Місто</Label>
                  <Select color={errors.cityId ? "failure" : "gray"}
                    className="w-80" {...register("cityId", { required: true })}>
                    {cityOptions}
                  </Select>
                  <HelperText>
                    {errors.cityId ? "Поля є обов'язковими" : ""}
                  </HelperText>
                </div>
                <TextValidInput
                  {...register("address", {
                    required: "Поле є обов'язковим",
                    pattern: {
                      value: /.{15,120}/u,
                      message: 'Назва повинна бути від 15 до 120 символів',
                    },
                  })}
                  labelText="Адреса"
                  placeholder="Адреса вашого закладу..."
                  type="text"
                  errorMessage={errors.address?.message}
                />
              </div>
              <div className="w-fit flex flex-col gap-y-2">
                <Label>Фото</Label>
                <div className={styles["images-grid"]}>
                  {
                    placeImages.map(url => <img key={url} src={url} />)
                  }
                  {/* <img src="/images/rest-img1.jpeg" />
                        <img src="/images/rest-img2.jpeg" />
                        <img src="/images/rest-img3.jpeg" />
                        <img src="/images/rest-img4.jpeg" />
                        <img src="/images/rest-img5.jpeg" />
                        <img src="/images/rest-img6.jpeg" /> */}
                  <input
                    type="file"
                    ref={inputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button color="gray" style={{ borderColor: (isSubmitted && placeImages.length < 1) ? "#f05152" : "" }} onClick={() => inputRef.current?.click()}>
                    <HiOutlineCamera className="icon-48 text-gray-500" />
                    Додати фото
                  </Button>
                </div>
                {(isSubmitted && placeImages.length < 1) &&
                  <HelperText>Заклад повинен мати хоча б одне фото</HelperText>}
              </div>
              <div className="flex flex-row w-full gap-8">
                <div className="flex flex-col gap-y-2 w-full">
                  <Label>Опис</Label>
                  <Textarea color={errors.description ? "failure" : "gray"}
                    className="aspect-video" {...register("description",
                      { value: undefined, required: true })} />
                  <HelperText>
                    {errors.description || errors.description ? "Поле є обов'язковим" : ""}
                  </HelperText>
                </div>
                <div className="flex flex-col gap-y-2 w-full">
                  <TextValidInput
                    {...register("avgBill", { required: "Поле є обов'язковим" })}
                    labelText="Середній чек (грн)"
                    placeholder="100"
                    type="number"
                    className="w-40 mb-3"
                    errorMessage={errors.avgBill?.message}
                  />
                  <>
                    <Label>Способи оплати</Label>
                    {
                      paymentCheckboxes.map((checkbox, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Checkbox id={`c${index}`} value={checkbox.value}
                            {...register("paymentMethods", { required: true })} />
                          <label htmlFor={`c${index}`}>{checkbox.label}</label>
                        </div>
                      ))
                    }
                    <HelperText>
                      {errors.paymentMethods ? "Поле є обов'язковим" : ""}
                    </HelperText>
                  </>
                </div>
              </div>
            </>
          )
      }
    </>
  }

  return (
    <form className={`w-full bg-white ${styles["my-place-page"]}`} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles["header"]}>
        <h3 className="text-3xl font-bold mb-1">
          Мій заклад
        </h3>
        {
          ((!managerPlaceInfo && action === "create") || (managerPlaceInfo && managerPlaceInfo.moderationStatus !== ModerationStatuses.Requested))
          && <div className="flex flex-row gap-4">
            <Button color="gray">Скасувати зміни</Button>
            <Button color="primary" type="submit">{action !== "create" ? "Зберегти зміни" : "Створити заклад"}</Button>
          </div>
        }
      </div>
      <div className="bg-white flex flex-col gap-6 rounded-xl border p-4 mt-20">
        {content}
      </div>
    </form>
  )
}

export default MyPlacePage;