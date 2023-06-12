import { FC } from "react"
import styles from "./UserSavedPage.module.scss";
import SavedCard from "../../components/saved-card/SavedCard";

const UserSavedPage: FC = function () {
    return (
        <div className={`w-full bg-white ${styles["user-saved-page"]}`}>
            <div>
                <h3 className="text-3xl font-bold mb-1">
                    Збережені
                </h3>
                <p className="text-base text-gray-500 dark:text-gray-300">
                    Тут ви можете переглянути всі збережені вами заклади
                </p>
            </div>
            <div className="w-full flex flex-row gap-2 rounded-xl p-3 bg-primary-100">
                <p className="font-medium">Збережених закладів:</p>
                <p className="font-bold text-primary-700">3</p>
            </div>
            <div className={styles["cards-cont"]}>
                <SavedCard title="Familia Grande" imgUrl="/images/test-rest-img.png"
                    placeLink="/details" />
                <SavedCard title="Familia Grande" imgUrl="/images/test-rest-img.png"
                    placeLink="/details" />
                <SavedCard title="Familia Grande" imgUrl="/images/test-rest-img.png"
                    placeLink="/details" />
            </div>
        </div>
    )
}

export default UserSavedPage;