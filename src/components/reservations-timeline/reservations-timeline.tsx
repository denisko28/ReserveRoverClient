import { Gantt, Task, ViewMode } from "@denisko28/timeline2";
import "@denisko28/timeline2/dist/index.css";
import { addHours } from "date-fns";

const ReservationsTimeline = () => {
  const start = new Date();
  start.setHours(2);
  const end = new Date();
  end.setHours(5);

  let tasks: Task[] = [
    {
      start: start,
      end: end,
      groupName: 'Столик 1',
      id: '123',
      type: 'task',
      progress: 100,
      isDisabled: true,
      styles: { progressColor: '#ffcb00', progressSelectedColor: '#dbaf02' },
    },
    {
      start: addHours(new Date, 2),
      end: addHours(new Date, 4),
      groupName: 'Столик 2',
      id: '1235',
      type: 'task',
      progress: 100,
      isDisabled: true,
      styles: { progressColor: '#ffcb00', progressSelectedColor: '#dbaf02' },
    }
  ];

  return (
    <Gantt
      tasks={tasks}
      viewMode={ViewMode.Hour}
      viewDate={new Date()}
      listCellWidth="200px"
      columnWidth={65}
      todayColor="#ff00003d"
      hasScrollbars={{ bottom: true }}
    />
  )
}


export default ReservationsTimeline;