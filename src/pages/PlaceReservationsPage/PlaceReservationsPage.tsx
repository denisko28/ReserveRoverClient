import { FC, useEffect, useState } from "react"
import styles from "./PlaceReservationsPage.module.scss";
import { Button } from "flowbite-react";
import { HiOutlineCollection, HiOutlinePlusSm } from "react-icons/hi";
import Datepicker from "react-tailwindcss-datepicker";
import { DateValueType } from "react-tailwindcss-datepicker/dist/types";
import { Gantt, Task, ViewMode } from "@denisko28/timeline2";
import "@denisko28/timeline2/dist/index.css";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import LoadingIndicator from "../../components/loading-indicator/LoadingIndicator";
import { fetchTimelineReservs } from "../../redux/slices/reservationSlice";
import { format } from "date-fns";
import NoPlaceYet from "../../components/no-place-yet";
import { useNavigate } from "react-router";
import { ModerationStatuses } from "../../enums/moderationStatuses";
import NotModeratedYet from "../../components/not-moderated-yet";

const PlaceReservationsPage: FC = function () {
  const selector = useAppSelector(state => state);
  const { status, error, timelineReservations } = selector.reservations;
  const { managerPlaceInfo } = selector.userInfo;
  const dispatch = useAppDispatch();

  const navigator = useNavigate();
  const [chosenDate, setChosenDate] = useState<Date>(new Date());

  const handleValueChange = (newValue: DateValueType) => {
    console.log("newValue:", newValue);
    if (newValue)
      setChosenDate(new Date(newValue.startDate as string));
  }

  useEffect(() => {
    if (!managerPlaceInfo) return;

    dispatch(fetchTimelineReservs({
      placeId: managerPlaceInfo.id,
      targetDate: format(chosenDate, "yyyy-MM-dd"),
    }));
  }, [managerPlaceInfo, chosenDate])

  let tasks: Task[] = [];
  if (status === 'failed') {
    return <p>{error}</p>;
  } else if (status === 'succeeded') {
    for (var i = 0; i < timelineReservations.length; i++) {
      const timelineReservation = timelineReservations[i];
      if (!timelineReservation) continue;

      for (var j = 0; j < timelineReservation.tableReservations.length; j++) {
        var reservation = timelineReservation.tableReservations[j];
        if (!reservation) break;

        tasks.push({
          id: reservation.id,
          groupName: `Столик ${i + 1} (місткість: ${timelineReservation.tableCapacity} ос.):`,
          userName: reservation.userName,
          type: 'task',
          start: new Date(reservation.beginTime),
          end: new Date(reservation.endTime),
          progress: 100,
          styles: { progressColor: '#ffcb00', progressSelectedColor: '#dbaf02' }
        });
      }
    }
  }

  return (
    <div className={` bg-white ${styles["place-reservs-page"]}`}>
      <div className={styles["header"]}>
        <h3 className="text-3xl font-bold mb-1">
          Резервації
        </h3>
        {
          (managerPlaceInfo && managerPlaceInfo.moderationStatus !== ModerationStatuses.Requested) &&
          <div className="flex flex-row gap-4 items-center">
            <p>Дата резервацій:</p>
            <Datepicker
              useRange={false}
              asSingle={true}
              value={{ startDate: chosenDate, endDate: chosenDate }}
              onChange={handleValueChange}
              readOnly
              primaryColor="yellow"
              inputClassName="relative transition-all duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-medium text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-blue-500 focus:ring-blue-500/20"
              containerClassName="w-48 relative w-full text-gray-700"
              toggleClassName="h-12 absolute right-0 h-full px-3 text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
            />
            <Button color="primary" className="icon-button">
              <HiOutlinePlusSm className="icon-16" />
              Додати резервацію
            </Button>
          </div>
        }
      </div>
      {
        status === 'loading'
          ? <div className="flex flex-col justify-center h-60 mt-20">
            <LoadingIndicator />
          </div>
          : <div className="mt-20">
            {
              tasks.length > 0
                ? <Gantt
                  tasks={tasks}
                  viewMode={ViewMode.Hour}
                  viewDate={new Date()}
                  listCellWidth="200px"
                  columnWidth={65}
                  todayColor="#ff00003d"
                  hasScrollbars={{ bottom: true }}
                />
                : <div className="h-96 bg-white rounded-xl border p-4 flex flex-col gap-3 justify-center items-center">
                  {
                    !managerPlaceInfo
                      ? <NoPlaceYet onClick={() => navigator("/my-place/create")} />
                      : (managerPlaceInfo?.moderationStatus === ModerationStatuses.Requested
                        ? <NotModeratedYet />
                        : <>
                          <HiOutlineCollection className='text-gray-500 w-1/5' style={{ height: 100 }} />
                          <p className='text-gray-500 font-medium'>На обрану дату ще не немає резервацій.</p>
                        </>
                      )
                  }
                </div>
            }
          </div>
      }
    </div>
  )
}

export default PlaceReservationsPage;