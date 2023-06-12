/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button } from "flowbite-react";
import { FC, useEffect, useState } from "react";
import { HiOutlineAdjustments } from "react-icons/hi";
import styles from './MainPage.module.scss';
import PlaceCard from "../../components/place-card/place-card";
import { fetchPlaces, loadMore } from "../../redux/slices/placesSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import ToggleButtons from "../../components/toggle-buttons";
import LoadingIndicator from "../../components/loading-indicator/LoadingIndicator";
import { useLocation } from "react-router-dom";

const MainPage: FC = function () {
  const { places: placesSelector, userInfo } = useAppSelector(state => state);
  const { status, error, places, noMore } = placesSelector;
  const { city } = userInfo;
  const dispatch = useAppDispatch();
  const [sortOrder, setSortOrder] = useState<number>(0);

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const searchString = queryParams.get('searchString');

  const handleScroll = () => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
    if (bottom && status === 'succeeded') {
      if (noMore)
        return;

      dispatch(loadMore({
        cityId: city.id,
        sortOrder: sortOrder,
        titleQuery: searchString
      }));
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [status]);

  useEffect(() => {
    dispatch(fetchPlaces({
      cityId: city.id,
      sortOrder: sortOrder,
      titleQuery: searchString
    }));
  }, [city, sortOrder, searchString])

  let content;
  if (status === 'failed') {
    content = <p>{error}</p>;
  } else if (status === 'succeeded') {
    content = places.map(place => <PlaceCard key={place.id} place={place} />)
  }

  return (
    <div className={`w-full bg-white ${styles["main-page"]}`}>
      <div className="mb-5 flex items-center gap-5">
        <h3 className="font-medium">Сортувати за:</h3>
        <ToggleButtons members={["Популярністю", "Рейтиногом", "Новизною"]} onChange={setSortOrder} />
        <Button color="gray">
          <HiOutlineAdjustments className="rotate-90 icon-16 mr-2" />
          Фільтри
        </Button>
      </div>
      <div className={styles["cards-container"]}>
        {content}
      </div>
      {
        status === 'loading' &&
        <div className="flex items-center h-60">
          <LoadingIndicator />
        </div>
      }
    </div>
  );
};

export default MainPage;
