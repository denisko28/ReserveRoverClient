import { FC, useEffect, useState } from "react"
import styles from "./ModerationPage.module.scss";
import { Button, Carousel, Select, Table } from "flowbite-react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { fetchModerPlaces, updatePlaceStatus } from "../../redux/slices/moderationsSlice";
import SearchInput from "../../components/search-input/search-input";
import { ModerationStatuses } from "../../enums/moderationStatuses";
import Datepicker from "react-tailwindcss-datepicker";
import { DateValueType } from "react-tailwindcss-datepicker/dist/types";
import { format } from "date-fns";
import ToggleButtons from "../../components/toggle-buttons";
import SidebarModal from "../../components/modals/SidebarModal";
import useModal from "../../hooks/useModal";
import { getPlaceDetails } from "../../redux/slices/placeDetailsSlice";
import DetailsMainContent from "../../components/details-main-content/details-main-content";
import { toast } from "react-toastify";

const STATUS_NAMES = ["Очікує", "Відхилено", "Схвалено"];

const ModerationPage: FC = function () {
  const selector = useAppSelector(state => state);
  const { moderPlaces } = selector.moderations;
  const { placeDetails } = selector.placeDetails;
  const dispatch = useAppDispatch();

  const { isOpen, toggle } = useModal();

  const [searchString, setSearchString] = useState<string | undefined>(undefined);
  const [moderationStatus, setModerationStatus] = useState<number>(ModerationStatuses.Requested);
  const [dateBoundaries, setDateBoundaries] = useState<DateValueType>({ startDate: null, endDate: null });
  const [newPlaceStatus, setNewPlaceStatus] = useState<number | null>();

  useEffect(() => {
    handleSearch();
  }, [dispatch, moderationStatus, dateBoundaries])

  const handleSearch = () => {
    console.log(dateBoundaries);
    dispatch(fetchModerPlaces({
      titleQuery: searchString,
      moderationStatus: moderationStatus,
      fromTime: dateBoundaries?.startDate ? format(Date.parse(dateBoundaries.startDate as string),
        "yyyy/MM/dd HH:mm") : null,
      tillTime: dateBoundaries?.endDate ? format(Date.parse(dateBoundaries.endDate as string),
        "yyyy/MM/dd HH:mm") : null
    }));
  }

  const selectPlace = (placeId: number) => {
    dispatch(getPlaceDetails(placeId));
    toggle();
  }

  const changePlaceStatus = async () => {
    if (!newPlaceStatus || !placeDetails)
      return;

    toggle();
    toast.promise(
      updatePlaceStatus({ placeId: placeDetails?.id, moderationStatus: newPlaceStatus }),
      {
        pending: 'Обробка',
        success: 'Статус успішно оновлено 👌',
        error: 'Помилка! Не вдалося оновити 🤯'
      }
    ).then(() => handleSearch());
  }

  return (
    <>
      <div className={`w-full bg-white ${styles["tables-page"]}`}>
        <div className={styles["header"]}>
          <h3 className="text-3xl font-bold">Керування столиками</h3>
          <div className="flex flex-row gap-4 w-full whitespace-nowrap items-center">
            <h3 className="font-medium">Статус модерації:</h3>
            <ToggleButtons members={STATUS_NAMES} onChange={setModerationStatus} />
            <Datepicker
              useRange={false}
              value={dateBoundaries}
              onChange={setDateBoundaries}
              placeholder="Оберіть діапазон дат"
              readOnly
              inputClassName="relative transition-all duration-300 pl-4 pr-14 w-full border-gray-300 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-blue-500 focus:ring-blue-500/20 py-2"
              containerClassName="relative w-full text-gray-700 z-20"
            />
            <SearchInput onChange={(e) => setSearchString(e.target.value)} onSubmit={handleSearch} />
          </div>
        </div>
        <Table hoverable>
          <Table.Head className="position-sticky top-0">
            <Table.HeadCell>
              ID
            </Table.HeadCell>
            <Table.HeadCell>
              Заклад
            </Table.HeadCell>
            <Table.HeadCell>
              ID Менеджера
            </Table.HeadCell>
            <Table.HeadCell>
              Місто
            </Table.HeadCell>
            <Table.HeadCell>
              Кількість фото
            </Table.HeadCell>
            <Table.HeadCell>
              Створено заявку
            </Table.HeadCell>
            <Table.HeadCell>
              Дата публікації
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {
              moderPlaces.map(place => {
                const submissionDateTime = format(new Date(place.submissionDateTime), "yyyy/MM/dd, HH:mm");
                const publicDate = place.publicDate ? format(new Date(place.publicDate),
                  "yyyy/MM/dd") : "-";

                return <Table.Row className="bg-white" key={place.id} onClick={() => selectPlace(place.id)}>
                  <Table.Cell className="font-medium text-gray-900">
                    {place.id}
                  </Table.Cell>
                  <Table.Cell>
                    {place.title}
                  </Table.Cell>
                  <Table.Cell>
                    {place.managerId}
                  </Table.Cell>
                  <Table.Cell>
                    {place.cityName}
                  </Table.Cell>
                  <Table.Cell>
                    {place.imagesCount}
                  </Table.Cell>
                  <Table.Cell>
                    {submissionDateTime}
                  </Table.Cell>
                  <Table.Cell>
                    {publicDate}
                  </Table.Cell>
                </Table.Row>
              })
            }
          </Table.Body>
        </Table>
      </div>

      <SidebarModal isOpen={isOpen} toggle={toggle} headerText="Деталі резервації" size="lg"
        className="flex flex-col gap-5 h-full"
        footerContent={<>
          <p className="font-medium">Статус:</p>
          <Select className="w-36" onChange={(e) => setNewPlaceStatus(+e.target.value)}>
            {
              STATUS_NAMES.map((status, index) => <option key={status} value={index}>{status}</option>)
            }
          </Select>
          <Button color="primary" type="button" onClick={() => changePlaceStatus()}>Змінити статус</Button>
        </>}
      >
        {
          placeDetails &&
          <>
            <>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Заклад створено: {format(new Date(placeDetails.submissionDateTime), "dd.MM.yyyy, HH:mm")}
              </p>
              <Carousel className={styles["carousel"]} slide={false}>
                <img
                  src={placeDetails?.mainImageUrl}
                />
                {
                  placeDetails?.imageUrls.map((url, index) => <img key={index} src={url} />)
                }
              </Carousel>
              <DetailsMainContent placeDetails={placeDetails} />
            </>
          </>
        }
      </SidebarModal>
    </>
  )
}

export default ModerationPage;