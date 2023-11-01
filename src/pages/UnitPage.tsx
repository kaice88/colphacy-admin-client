import { Button, Flex, Group, Modal, Pagination } from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import useUnit from "../hooks/useUnit";
import { handleGlobalException } from "../utils/error";
import UnitTable from "../components/Unit/UnitTable";
import UnitFrom, { Unit } from "../components/Unit/UnitFrom";
import { notificationShow } from "../components/Notification";
import { useNavigate } from "react-router-dom";

interface AllUnitProps {
  items: ItemsProps[];
  numPages: number;
  offset: number;
  limit: number;
  totalItems: number;
}
interface ItemsProps {
  id: number;
  address: string;
  phone: string;
}
export default function UnitPage() {
  const limitInit = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const offset = (currentPage - 1) * limitInit;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [allUnits, setAllUnits] = useState<AllUnitProps>({
    items: [],
    numPages: 0,
    offset: 0,
    limit: 0,
    totalItems: 0,
  });
  const search = {
    offset: offset,
    limit: 10,
    keyword: searchValue,
  };
  const [searchArr, setSearchArr] = useState(search);
  const [unit, setUnit] = useState<Unit>();
  const [addFormOpened, setAddFormOpened] = useState(false);
  const [editFormOpened, setEditFormOpened] = useState(false);
  const [deleteFormOpened, setDeleteFormOpened] = useState(false);
  const navigater = useNavigate();
  const { fetchUnit } = useUnit();
  useEffect(() => {
    setSearchArr({
      offset: offset,
      limit: 10,
      keyword: searchValue,
    });
  }, [searchValue, offset]);

  async function fetchUnitData() {
    const data = await fetchUnit.refetch();
    if (data.isSuccess) {
      setAllUnits(data.data.data);
    } else if (data.isError) {
      const error = data.error;
      handleGlobalException(error, () => {
        if (error.response.status === 400) {
          const data = error.response.data;
          Object.keys(data).forEach((key) => {
            notificationShow("error", "Error!", data[key]);
          });
        }
      });
    }
  }
  useEffect(() => {
    fetchUnitData();
  }, []);
  const itemsPerPage = allUnits.limit;
  const startIndex = allUnits.offset;
  const endIndex = startIndex + itemsPerPage;
  const totalUnits = allUnits.totalItems;
  const totalPages = allUnits.numPages;
  const handleSuccessSubmit = () => {
    close();
    fetchUnitData();
    navigater(0);
  };
  const handleCancelForm = () => {
    close();
  };
  const handleEdit = (unit: Unit) => {
    setUnit(unit);
    setEditFormOpened(true);
  };
  const handleDelete = (unit: Unit) => {
    setDeleteFormOpened(true);
    setUnit(unit);
  };
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    if (!searchValue.startsWith(" ")) {
      setSearchValue(searchValue);
      setCurrentPage(1);
    }
  };
  return (
    <div className="unit-ctn">
      <h1 className="unit-title">Danh sách đơn vị tính</h1>
      <Flex>
        <div className="search-field">
          <div className="search">
            <input
              ref={inputRef}
              value={searchValue}
              placeholder="Tìm kiếm..."
              spellCheck={false}
              onChange={handleChange}
            />
            <button
              className="search-btn"
              onMouseDown={(e) => e.preventDefault()}
            >
              <IconSearch size="1.3rem"></IconSearch>
            </button>
          </div>
        </div>
        <Modal
          opened={addFormOpened}
          onClose={() => setAddFormOpened(false)}
          size="60"
          centered
          m={20}
        >
          <UnitFrom
            title="add"
            unit={unit}
            onSuccesSubmit={handleSuccessSubmit}
            onCancelForm={handleCancelForm}
          />
        </Modal>
        <Modal
          opened={editFormOpened}
          onClose={() => setEditFormOpened(false)}
          size="60"
          centered
          m={20}
        >
          <UnitFrom
            onSuccesSubmit={handleSuccessSubmit}
            onCancelForm={handleCancelForm}
            title="edit"
            unit={unit}
          />
        </Modal>
        <Modal
          opened={deleteFormOpened}
          onClose={() => setDeleteFormOpened(false)}
          size="60"
          centered
          m={20}
        >
          <UnitFrom
            onSuccesSubmit={handleSuccessSubmit}
            onCancelForm={handleCancelForm}
            title="delete"
            unit={unit}
          />
        </Modal>
        <Group ml="auto">
          <Button
            className="button unit-add-button"
            leftIcon={<IconPlus size="15px" />}
            styles={(theme) => ({
              root: {
                backgroundColor: theme.colors.munsellBlue[0],
                ...theme.fn.hover({
                  backgroundColor: theme.fn.darken(
                    theme.colors.munsellBlue[0],
                    0.1
                  ),
                }),
              },
            })}
            onClick={() => {
              setAddFormOpened(true);
            }}
          >
            Thêm đơn vị tính
          </Button>
        </Group>
      </Flex>
      <div className="unit-table">
        <UnitTable
          startIndex={startIndex}
          endIndex={endIndex}
          allUnites={allUnits}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      </div>
      <div className="pagination-ctn">
        {totalUnits === 0 ? (
          <div>Không tìm thấy kết quả nào.</div>
        ) : totalUnits === 1 ? (
          <div>Tìm thấy 1 kết quả.</div>
        ) : (
          <div>
            Hiển thị{" "}
            {endIndex <= totalUnits ? itemsPerPage : totalUnits % itemsPerPage}{" "}
            kết quả từ {startIndex + 1} -{" "}
            {endIndex <= totalUnits ? endIndex : totalUnits} trong tổng{" "}
            {totalUnits} kết quả
          </div>
        )}
        <Pagination
          value={currentPage}
          total={totalPages}
          onChange={handlePageChange}
          position="center"
          styles={(theme) => ({
            control: {
              "&[data-active]": {
                backgroundColor: theme.colors.munsellBlue[0],
                border: 0,
              },
            },
          })}
        />
      </div>
    </div>
  );
}
