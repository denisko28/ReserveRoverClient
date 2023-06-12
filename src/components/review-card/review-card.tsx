import { Avatar, Rating } from "flowbite-react";
import { FC } from "react";
import styles from './review-card.module.scss';
import { Review } from "../../redux/slices/placeDetailsSlice";
import { format, parse } from "date-fns";
import uk from "date-fns/locale/uk";

const ReviewCard: FC<{review: Review}> = function ({review}) {
    const creationDate = format(parse(review.creationDate, 'yyyy-MM-dd', new Date()), "d MMMM, yyyy", { locale: uk });

    return (
        <div className={`gap-3 ${styles["review"]}`}>
            <div className={styles["author"]}>
                <Avatar img={review.authorPhotoUrl}/>
                <div>
                    <h3>{review.authorFullName}</h3>
                    <p className="text-xs text-gray-500">{creationDate}</p>
                </div>
            </div>
            <div className={styles["content"]}>
                <Rating size="sm">
                    {
                        [...Array(5)].map((_, index) =>
                            <Rating.Star key={index} filled={index < review.mark} />
                        )
                    }
                </Rating>
                <p className="text-sm">{review.comment}</p>
            </div>
        </div>
    )
}

export default ReviewCard;