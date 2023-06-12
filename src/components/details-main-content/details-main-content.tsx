import { FC } from 'react'
import IconAndInfo from '../icon-and-info';
import { Button } from 'flowbite-react';
import { HiOutlineClock, HiOutlineStar, HiOutlineLocationMarker, HiOutlineBookmark, HiOutlineFlag } from 'react-icons/hi';
import { PlaceDetails } from '../../redux/slices/placeDetailsSlice';
import { format, parse } from 'date-fns';
import styles from './details-main-content.module.scss';
import PAYMENT_METHODS from '../../enums/paymentMethods';

const DetailsMainContent: FC<{ placeDetails: PlaceDetails, modalToggle?: () => void }> =
  ({ placeDetails, modalToggle }) => {
    const opensAt = parse(placeDetails.opensAt, 'HH:mm:ss', new Date());
    const closesAt = parse(placeDetails.closesAt, 'HH:mm:ss', new Date());
    const openingTime = format(opensAt, "HH:mm");
    const closingTime = format(closesAt, "HH:mm");

    return (
      <>
        <h3 className="text-5xl font-bold">{placeDetails?.title}</h3>
        <div className={styles["info-action-cont"]}>
          <div>
            <IconAndInfo className={styles["info-badge"]}
              icon={<HiOutlineClock className="icon-16" />} info={openingTime + "-" + closingTime} />
            <IconAndInfo className={styles["info-badge"]}
              icon={<HiOutlineStar className="icon-16" />}
              info={placeDetails.avgMark ? placeDetails.avgMark.toString() : "..."} />
            <IconAndInfo className={styles["info-badge"]}
              icon={<HiOutlineLocationMarker className="icon-16" />} info={placeDetails.address} />
          </div>
          {
            modalToggle && <div>
              <Button color="gray" className="icon-button icon-filled">
                <HiOutlineBookmark className="icon-24" />
                Зберегти
              </Button>
              <Button color="primary" className="icon-button" onClick={modalToggle}>
                <HiOutlineFlag className="icon-24" />
                Забронювати
              </Button>
            </div>
          }
        </div>
        <div>
          <h3 className="text-2xl font-medium mb-3">Про заклад</h3>
          <p className="whitespace-pre-line">
            {placeDetails.description}
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-medium mb-3">Способи оплати</h3>
          {
            placeDetails.paymentMethods.map((method, index) =>
              <p key={index}>&bull;{PAYMENT_METHODS[method]}<br /></p>)
          }
        </div>
      </>
    )
  }

export default DetailsMainContent;