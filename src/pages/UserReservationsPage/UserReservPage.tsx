import { FC, useEffect, useState } from "react"
import styles from "./UserReservPage.module.scss";
import SelectorCard from "../../components/selector-card/SelectorCard";
import ReservationCard from "../../components/reservation-card/ReservationCard";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { UserReservation, cancelReserv, fetchUserReservs, getUserReservsCount } from "../../redux/slices/reservationSlice";
import useAuth from "../../hooks/useAuth";
import LoadingIndicator from "../../components/loading-indicator/LoadingIndicator";
import { format } from "date-fns";
import { Button, Table } from "flowbite-react";
import useModal from "../../hooks/useModal";
import SidebarModal from "../../components/modals/SidebarModal";
import StatusBadge, { ReservStatus } from "../../components/status-badge/StatusBadge";

enum ShowOptions {
  SHOW_FUTURE = 0,
  SHOW_ALL = 1,
  SHOW_PAST = 2
}

const UserReservPage: FC = function () {
  const [showOption, setShowOption] = useState<ShowOptions>(ShowOptions.SHOW_FUTURE);
  const [selectedReserv, setSelectedReserv] = useState<UserReservation | null>(null);
  const [triedCanceling, setTriedCanceling] = useState<boolean>(false);

  const { isOpen, toggle } = useModal();
  const { currentUser } = useAuth();

  const { status, error, userReservations: reservations, reservationsCount } = useAppSelector(state => state.reservations);
  const dispatch = useAppDispatch();

  const handleReservationClick = (reservation: UserReservation) => {
    setSelectedReserv(reservation);
    toggle();
  }

  useEffect(() => {
    if (currentUser == null)
      return;

    dispatch(getUserReservsCount(currentUser.uid))
  }, [currentUser])

  useEffect(() => {
    if (currentUser == null)
      return;

    let fromTime = undefined;
    let tillTime = undefined;

    switch (showOption) {
      case ShowOptions.SHOW_FUTURE:
        fromTime = format(new Date(), "yyyy/MM/dd HH:mm");
        break;
      case ShowOptions.SHOW_PAST:
        tillTime = format(new Date(), "yyyy/MM/dd HH:mm");
        break
    }

    dispatch(fetchUserReservs({ userId: currentUser.uid, fromTime, tillTime }));
  }, [currentUser, showOption])

  let content;
  if (status === 'failed') {
    content = <p>{error}</p>;
  } else if (status === 'succeeded') {
    content = reservations.map(reservation =>
      <ReservationCard key={reservation.id} reservation={reservation} onClick={handleReservationClick} />);
  }

  return (
    <>
      <div className={`w-full bg-white ${styles["user-reserv-page"]}`}>
        <div>
          <h3 className="text-3xl font-bold mb-1">
            Мої резервації
          </h3>
          <p className="text-base text-gray-500 dark:text-gray-300">
            Тут ви можете переглянути власні резервації
          </p>
        </div>
        <div className="flex flex-row gap-3">
          <SelectorCard value={(reservationsCount?.futureCount ?? "0").toString()}
            title="Майбутні резервації" selected={showOption == ShowOptions.SHOW_FUTURE}
            onClick={() => setShowOption(ShowOptions.SHOW_FUTURE)} />
          <SelectorCard value={(reservationsCount?.totalCount ?? "0").toString()}
            title="Всі резервації" selected={showOption == ShowOptions.SHOW_ALL}
            onClick={() => setShowOption(ShowOptions.SHOW_ALL)} />
          <SelectorCard value={(reservationsCount?.pastCount ?? "0").toString()}
            title="Минулі резервації" selected={showOption == ShowOptions.SHOW_PAST}
            onClick={() => setShowOption(ShowOptions.SHOW_PAST)} />
        </div>
        <div className={styles["cards-cont"]}>
          {content}
          {/* <ReservationCard title="Familia Grande" imgUrl="/images/test-rest-img.png"
            placeLink="/details" datailsLink="" creationDate="Створено: 30 хв. назад"
            peopleNum={4} reservDateTime="26 березня, з 13:00-15:00"
            status={ReservStatus.RESERVED} /> */}
        </div>
        {
          status === 'loading' &&
          <div className="flex items-center h-60">
            <LoadingIndicator />
          </div>
        }
      </div>

      <SidebarModal isOpen={isOpen} toggle={toggle} headerText="Деталі резервації" className={styles["sidebar-modal"]}>
        {
          selectedReserv &&
          <>
            <a href={"/details/" + selectedReserv.placeId} className="text-xl w-fit font-bold hover:underline">
              {selectedReserv.placeTitle}
            </a>
            <img src={selectedReserv.placeImageUrl} className="rounded-xl" />
            {
              !triedCanceling
                ? <Button color="gray" disabled={selectedReserv.status != ReservStatus.RESERVED}
                  onClick={() => setTriedCanceling(true)}>Скасувати резевацію</Button>
                : <div className="flex flex-col gap-3 border rounded-xl p-4">
                  <p>Ви впевнені що бажаєте скасувати резервацію?</p>
                  <div className="flex flex-row gap-2">
                    <Button color="gray" onClick={() => setTriedCanceling(false)}>Ні</Button>
                    <Button color="primary" onClick={() => {dispatch(cancelReserv(selectedReserv.id)); toggle();}}>
                      Так, скасувати
                    </Button>
                  </div>
                </div>
            }
            <div className={styles["table-cont"]}>
              <Table>
                <Table.Head>
                  <Table.HeadCell colSpan={2}>
                    ДЕТАЛІ
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  <Table.Row>
                    <Table.Cell className="font-medium text-gray-900">Час бронювання</Table.Cell>
                    <Table.Cell>
                      {`${selectedReserv.beginTime.slice(0, -3)} - ${selectedReserv.endTime.slice(0, -3)}`}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="font-medium text-gray-900">Дата резервації</Table.Cell>
                    <Table.Cell>
                      {format(new Date(selectedReserv.reservDate), "dd.MM.yyyy")}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="font-medium text-gray-900">Кількість осіб</Table.Cell>
                    <Table.Cell>
                      {selectedReserv.peopleNum}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="font-medium text-gray-900">Розмір столика</Table.Cell>
                    <Table.Cell>
                      {selectedReserv.peopleNum}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="font-medium text-gray-900">Статус</Table.Cell>
                    <Table.Cell>
                      <StatusBadge status={selectedReserv.status} />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </div>
            <p className="my-2 text-center text-sm text-gray-500 dark:text-gray-300">Створено: {format(new Date(selectedReserv.creationDateTime), "dd.MM.yyyy, HH:mm")}</p>
          </>
        }
      </SidebarModal>
    </>
  )
}

export default UserReservPage;