import { Button, Carousel, Rating } from "flowbite-react";
import { FC, useEffect } from "react";
import styles from './DetailsPage.module.scss';
import ReviewCard from "../../components/review-card/review-card";
import useModal from "../../hooks/useModal";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import LoadingIndicator from "../../components/loading-indicator/LoadingIndicator";
import { parse } from "date-fns";
import { useParams } from "react-router-dom";
import BackArrow from "../../components/BackArrow";
import { getPlaceDetails, getPlaceReviews } from "../../redux/slices/placeDetailsSlice";
import ReservationModal from "../../components/modals/ReservationModal";
import DetailsMainContent from "../../components/details-main-content/details-main-content";

const DetailsPage: FC = function () {
  const { isOpen, toggle } = useModal();
  const { placeId } = useParams();
  const { status, error, placeDetails, reviews } = useAppSelector(state => state.placeDetails);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!placeId)
      return;

    dispatch(getPlaceDetails(+placeId));
    dispatch(getPlaceReviews(+placeId));
  }, [dispatch])

  let content = <LoadingIndicator />
  if (status === 'failed') {
    content = <p>{error}</p>;
  } else if (status === 'succeeded') {
    if (!placeDetails || !placeId)
      return <p>{error}</p>;

    const opensAt = parse(placeDetails.opensAt, 'HH:mm:ss', new Date());
    const closesAt = parse(placeDetails.closesAt, 'HH:mm:ss', new Date());
    const filledStarsNum = Math.floor(placeDetails.avgMark ?? 0);

    content = (
      <>
        <BackArrow className="mt-0">Повернутися до пошуку</BackArrow>
        <div className={`bg-white ${styles["details-page"]}`}>
          <div className={styles["left-part"]}>
            <Carousel className={`${styles["carousel"]}`} slide={false}>
              <img
                src={placeDetails?.mainImageUrl}
              />
              {
                placeDetails?.imageUrls.map((url, index) => <img key={index} src={url} />)
              }
            </Carousel>
            <div className={styles["reviews"]}>
              <div className={`gap-3 ${styles["review"]}`}>
                <div>
                  <h3>Оцінка</h3>
                  <div className="flex gap-4">
                    <p className="text-3xl font-bold">{placeDetails.avgMark} / 5</p>
                    <Rating size="md">
                      {
                        [...Array(5)].map((_, index) =>
                          <Rating.Star key={index} filled={index < filledStarsNum} />
                        )
                      }
                    </Rating>
                  </div>
                </div>
                <Button color="primary">Додати відгук</Button>
              </div>
              {
                reviews.map((review, index) =>
                  <ReviewCard key={index} review={review} />
                )
              }
            </div>
          </div>
          <div className={styles["right-part"]}>
            <DetailsMainContent placeDetails={placeDetails} modalToggle={toggle}/>
          </div>
        </div>
        <ReservationModal isOpen={isOpen} toggle={toggle} placeId={+placeId} opensAt={opensAt} closesAt={closesAt}/>
      </>
    )
  }

  return content;
};

export default DetailsPage;
