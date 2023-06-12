import { FC, useEffect } from "react"
import styles from "./TablesPage.module.scss";
import { Button, Select, Table } from "flowbite-react";
import { HiOutlinePlusSm, HiOutlineTrash } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { TableSet, addNewTableSet, deleteTableSet, fetchTableSets, updateTableSet } from "../../redux/slices/tableSetsSlice";
import axiosInstance from "../../services/axios-config";
import { toast } from "react-toastify";
import LoadingIndicator from "../../components/loading-indicator/LoadingIndicator";

const TablesPage: FC = function () {
  const selector = useAppSelector(state => state);
  const { tableSets, tableSetIdsToDelete, status, error } = selector.tableSets;
  const { managerPlaceInfo } = selector.userInfo;
  const dispatch = useAppDispatch();

  useEffect(() => {
    getTableSets();
  }, [dispatch, managerPlaceInfo])

  const getTableSets = () => {
    if (!managerPlaceInfo)
      return;

    dispatch(fetchTableSets(managerPlaceInfo.id));
  }

  const submitTableSetsChanges = async () => {
    toast.promise(
      axiosInstance.post("places/manager/placeTableSets", { tableSets, idsToDelete: tableSetIdsToDelete }),
      {
        pending: 'Збереження',
        success: 'Зміни успішно збережено 👌',
        error: 'Помилка! Не вдалося зберегти зміни 🤯'
      }
    ).then(() => getTableSets());
  }

  const onTablesCapacityChange = (index: number, tableSet: TableSet, capacity: number) => {
    const newTableSet = { ...tableSet, tableCapacity: capacity }
    dispatch(updateTableSet({ index, newTableSet }))
  }

  const onTablesNumChange = (index: number, tableSet: TableSet, tablesNum: number) => {
    const newTableSet = { ...tableSet, tablesNum }
    dispatch(updateTableSet({ index, newTableSet }))
  }

  const options = Array.from({ length: 20 }, (_, index) => {
    return <option key={index}>{index + 1}</option>
  });

  let content;
  if (status === 'failed') {
    content = <p>{error}</p>;
  } else if (status === 'loading') {
    content = <div className="flex flex-col justify-center h-80"><LoadingIndicator /></div>
  } else {
    content = <>
      <Button color="primary" className="icon-button w-fit" onClick={() =>
        dispatch(addNewTableSet({ placeId: managerPlaceInfo?.id, tableCapacity: 1, tablesNum: 1 }))}>
        <HiOutlinePlusSm className="icon-16" />
        Додати столик
      </Button>
      <Table>
        <Table.Head>
          <Table.HeadCell>
            Група столиків
          </Table.HeadCell>
          <Table.HeadCell>
            Місткість столика
          </Table.HeadCell>
          <Table.HeadCell>
            Кількість столиків
          </Table.HeadCell>
          <Table.HeadCell>
            Сумарна кількість місць
          </Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">
              Edit
            </span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {tableSets.map((tableSet, index) =>
            <Table.Row key={index}>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                Група столиків {index + 1}
              </Table.Cell>
              <Table.Cell>
                <Select value={tableSet.tableCapacity}
                  onChange={(e) => onTablesCapacityChange(index, tableSet, +e.target.value)}>
                  {options}
                </Select>
              </Table.Cell>
              <Table.Cell>
                <Select value={tableSet.tablesNum}
                  onChange={(e) => onTablesNumChange(index, tableSet, +e.target.value)}>
                  {options}
                </Select>
              </Table.Cell>
              <Table.Cell>
                {tableSet.tableCapacity * tableSet.tablesNum}
              </Table.Cell>
              <Table.Cell>
                <Button color="gray" onClick={() => dispatch(deleteTableSet(index))}>
                  <HiOutlineTrash className="icon-16" />
                </Button>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </>
  }

  return (
    <form className={`w-full bg-white ${styles["tables-page"]}`}>
      <div className={styles["header"]}>
        <h3 className="text-3xl font-bold mb-1">
          Керування столиками
        </h3>
        <div className="flex flex-row gap-4">
          <Button color="gray" onClick={getTableSets}>Скасувати зміни</Button>
          <Button color="primary" onClick={submitTableSetsChanges}>Зберегти зміни</Button>
        </div>
      </div>
      <div className="bg-white flex flex-col gap-6 rounded-xl border p-4 mt-20">
        {content}
      </div>
    </form>
  )
}

export default TablesPage;