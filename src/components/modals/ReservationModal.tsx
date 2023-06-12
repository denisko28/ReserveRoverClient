import { FC, useEffect, useState } from 'react';
import CustomModal, { CustomModalProps } from './CustomModal'
import { uk } from 'date-fns/locale';
import { Dropdown, Button, HelperText } from 'flowbite-react';
import { HiOutlineCheckCircle, HiOutlineClock, HiOutlineFastForward, HiOutlineUsers } from 'react-icons/hi';
import CustomDropdown from '../dropdown/CustomDropdown';
import { Datepicker } from '../datepicker/Datepicker';
import { format, subHours } from 'date-fns';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import { TimeOffer, addReservation, getTimeOffers } from '../../redux/slices/reservationSlice';
import LoadingIndicator from '../loading-indicator/LoadingIndicator';
import { addHours } from 'date-fns';
import useAuth from "../../hooks/useAuth";

function generateTimes(startTime: Date, endTime: Date) {
  const times = [];
  let time = new Date(startTime);

  while (time <= endTime) {
    times.push(new Date(time));
    time.setMinutes(time.getMinutes() + 30);
  }

  return times;
}

interface ReservModalProps extends CustomModalProps {
  opensAt: Date;
  closesAt: Date;
  placeId: number;
}

const ReservationModal: FC<ReservModalProps> = (props) => {
  const [chosenDate, setChosenDate] = useState<Date>(new Date());
  const [desiredTime, setDesiredTime] = useState<Date | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [peopleNum, setPeopleNum] = useState<string | null>(null);
  const [chosenTimeOffer, setChosenTimeOffer] = useState<TimeOffer | null>(null);
  const [reservationAdded, setReservationAdded] = useState<boolean>(false);

  const { currentUser } = useAuth();

  const { status, error, timeOffers } = useAppSelector(state => state.reservations);
  const dispatch = useAppDispatch();

  const handleSubmit = () => {
    if (chosenTimeOffer == null || peopleNum == null || currentUser == null)
      return;

    dispatch(addReservation({
      tableSetId: chosenTimeOffer.tableSetId, userId: currentUser.uid,
      reservDate: format(chosenDate, 'yyyy-MM-dd'),
      beginTime: chosenTimeOffer.offeredStartTime + ":00",
      endTime: chosenTimeOffer.offeredEndTime + ":00",
      peopleNum: +peopleNum
    }));
    setReservationAdded(true);
  }

  useEffect(() => {
    if (!chosenDate || !desiredTime || !duration || !peopleNum)
      return;

    setChosenTimeOffer(null);
    dispatch(getTimeOffers({
      placeId: props.placeId,
      reservDate: format(chosenDate, 'yyyy-MM-dd'),
      desiredTime: format(desiredTime, "HH:mm:ss"),
      duration: +duration,
      peopleNum: +peopleNum
    }));
  }, [chosenDate, desiredTime, duration, peopleNum])

  const possibleTime = generateTimes(props.opensAt, subHours(props.closesAt, 1));
  const chosenDateStr = format(chosenDate, "d MMMM, yyyy", { locale: uk });

  let timeOffersContent = null;
  if (status === 'loading') {
    timeOffersContent = <div className="flex items-center h-32">
      <LoadingIndicator />
    </div>;
  } else if (status === 'succeeded') {
    if (timeOffers.length > 0) {
      timeOffersContent = timeOffers.map((offer, index) =>
        <Button key={index} color="gray" className={chosenTimeOffer === offer ?
          'border-primary-700 bg-primary-300 hover:bg-primary-300' : ''}
          onClick={() => setChosenTimeOffer(offer)}>
          {offer.offeredStartTime + "-" + offer.offeredEndTime}
        </Button>);
    } else
      timeOffersContent = <p>Немає доступного часу для обраних критеріїв</p>
  } else if (status === "idle") {
    timeOffersContent = <p>Оберіть тривалість, час та кількість осіб, щоб переглянути пропозиції часу</p>
  }

  if (desiredTime && duration && addHours(desiredTime, +duration) > props.closesAt)
    timeOffersContent = <HelperText className='text-base'>(Бажаний час + тривалість) виходить за межі робочого часу закладу</HelperText>;

  return (
    <CustomModal {...props} className="flex flex-col gap-5 items-center">
      {
        status === "failed"
          ? <p>{error}</p>
          : (reservationAdded
            ? <>
              <HiOutlineCheckCircle className='text-green-400' style={{width: 100, height: 100}}/>
              <div>
                <h3 className='font-bold text-2xl mb-2'>Успіх!</h3>
                <p className='text-gray-500 font-medium'>Резевацію успішно додано!</p>
              </div>
              <Button color="primary" className='w-64' onClick={() => props.toggle()}>Окей</Button>
            </>
            : <>
              <Datepicker onChange={(d) => setChosenDate(d)} locale={uk} selectedDate={chosenDate} />
              <div className="flex flex-row flex-wrap gap-3 justify-center">
                <CustomDropdown className='w-44' text={duration ?? "Оберіть тривалість"}
                  icon={<HiOutlineFastForward className="icon-16" />}>
                  {
                    [...Array(4)].map((_, index) =>
                      <Dropdown.Item key={index} onClick={() => setDuration((index + 1).toString())}>
                        {index + 1} год.
                      </Dropdown.Item>
                    )
                  }
                </CustomDropdown>
                <CustomDropdown className='w-32' text={desiredTime ? format(desiredTime, "HH:mm") : "Оберіть час"}
                  icon={<HiOutlineClock className="icon-16" />}>
                  {
                    possibleTime.map((time, index) =>
                      <Dropdown.Item key={index} onClick={() => setDesiredTime(time)}>
                        {format(time, "HH:mm")}
                      </Dropdown.Item>
                    )
                  }
                </CustomDropdown>
                <CustomDropdown className='w-40' text={peopleNum ?? "Оберіть кількість"}
                  icon={<HiOutlineUsers className="icon-16" />}>
                  {
                    [...Array(10)].map((_, index) =>
                      <Dropdown.Item key={index} onClick={() => setPeopleNum((index + 1).toString())}>
                        {index + 1} oc.
                      </Dropdown.Item>
                    )
                  }
                </CustomDropdown>
              </div>
              <div className="flex flex-row flex-wrap gap-3 justify-center border-y py-5 w-11/12">
                {
                  timeOffersContent
                }
              </div>
              {
                chosenTimeOffer &&
                <h4 className="text-lg font-medium">
                  {`${chosenDateStr}, ${chosenTimeOffer.offeredStartTime}-
                        ${chosenTimeOffer.offeredEndTime}, столик на ${peopleNum} oс.`}
                </h4>
              }
              <Button color="primary" size="xl" disabled={chosenTimeOffer == null} onClick={handleSubmit}>
                Забронювати
              </Button>
            </>
          )
      }
    </CustomModal>
  )
}

export default ReservationModal
