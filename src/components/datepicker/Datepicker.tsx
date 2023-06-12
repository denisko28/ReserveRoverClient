import React, { forwardRef } from "react";
import styles from "./Datepicker.module.scss";
import clsx from "clsx";
import { curry2 } from "ts-curry";
import {
    eachDayOfInterval,
    format,
    lastDayOfMonth,
    eachMonthOfInterval,
    startOfDay,
    addMonths,
  } from "date-fns";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

export type DatepickerClasses = {
  selectedDay: string;
  rangeDays: string;
  dayItem: string;
  dayLabel: string;
  monthLabel: string;
  dateLabel: string;
  weekendItem: string;
};

export type DatepickerProps = {
  onChange: (d: Date) => void;
  selectedDate: Date | null;
  locale: Locale;
  disabledDates?: Date[];
  classNames?: Partial<DatepickerClasses>;
};

const getTime = (d: Date) => startOfDay(d).getTime();

const isEqualDate = curry2((d1: Date, d2: Date) => getTime(d1) === getTime(d2));

const eachDay = (start: Date, end: Date) => eachDayOfInterval({ start, end });

const eachMonth = (start: Date, end: Date) =>
  eachMonthOfInterval({ start, end });

export const Datepicker = forwardRef<HTMLDivElement, DatepickerProps>(
  (
    {
      locale,
      classNames: CN,
      onChange,
      selectedDate,
      disabledDates
    },
    ref,
  ) => {
    const DATES = React.useMemo(() => {
      const startMonth = new Date();
      const endMonth = addMonths(new Date(), 3);
      const months = eachMonth(startMonth, endMonth);

      return months.map((month, idx) => {
        const last = lastDayOfMonth(month);

        // const last = isSameMonth(month, endDate) ? (endDate ? endDate : month) : lastDayOfMonth(month);
        const startDay = !idx ? (new Date()) : month;
        const days = eachDay(startOfDay(startDay), startOfDay(last));

        return {
          month,
          days,
        };
      });
    }, []);

    const onDateClick = (selectedDate: Date) => {
      onChange(selectedDate);
    };

    const containerRef = React.useRef<HTMLDivElement | null>(null);

    const nextScroll = () => {
      if (containerRef.current) {
        containerRef.current.scrollBy({
          left: +500,
          behavior: "smooth",
        });
      }
    };

    const prevScroll = () => {
      if (containerRef.current) {
        containerRef.current.scrollBy({
          left: -500,
          behavior: "smooth",
        });
      }
    };

    return (
      <div ref={ref} className={styles["container"]}>
        <button onClick={prevScroll} className={clsx(styles["button"], styles["buttonPrev"])}>
            <HiChevronLeft className="icon-24"/>
        </button>
        <div ref={containerRef} className={styles["dateListScrollable"]}>
          {DATES.map(({ month, days }, idx) => {
            const _month = format(month, "LLLL", { locale });
            const _monthCapitalized = _month.toUpperCase();

            return (
              <div key={_month + idx} className={styles["monthContainer"]}>
                <div className={clsx(styles["monthLabel"], "font-medium text-lg")}>
                  {_monthCapitalized}
                </div>
                <div className={styles["daysContainer"]}>
                  {days.map((d, idx) => {
                    const dayLabel = format(d, "EEEEEE", { locale }).toUpperCase();
                    const dateLabel = format(d, "dd", { locale });
                    const isDisabled = disabledDates?.some(isEqualDate(d));
                    const isDaySelected =
                      (selectedDate && isEqualDate(selectedDate, d));

                    return (
                      <div
                        data-testid="DAY_ITEM"
                        key={dayLabel + idx + _month}
                        {...(isDisabled ? { "aria-disabled": "true" } : {})}
                        className={styles["dateDayItem"]}
                        onClick={() => onDateClick(d)}
                      >
                        <div
                          data-testid="DAY_LABEL"
                          className={clsx(styles["dayLabel"], CN?.dayLabel)}
                        >
                          {dayLabel}
                        </div>
                        <div
                          data-testid="DATE_LABEL"
                          className={clsx("text-base font-medium", styles["dateItem"], isDaySelected ? styles["dateItemSelected"] : "")}
                        >
                          {dateLabel}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <button onClick={nextScroll} className={clsx(styles["button"], styles["buttonNext"])}>
          <HiChevronRight className="icon-24"/>
        </button>
      </div>
    );
  },
);

Datepicker.displayName = "Datepicker";

