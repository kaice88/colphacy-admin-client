import { Flex, Pagination, Title, useMantineTheme } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { handleGlobalException } from "../utils/error";
import { notificationShow } from "../components/Notification";
import { useForm } from "react-hook-form";
import { ErrorObject } from "../types/error";
import { AllProvidersProps } from "../types/Provider";
import useProvider from "../hooks/useProvider";
import ProviderTable from "../components/_Provider/ProviderTable";
export default function ProviderPage() {
  const theme = useMantineTheme();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [allProviders, setAllProviders] = useState<AllProvidersProps>({
    items: [],
    numPages: 0,
    offset: 0,
    limit: 0,
    totalItems: 0,
  });
  const itemsPerPage = allProviders.limit;
  const startIndex = allProviders.offset;
  const endIndex = startIndex + itemsPerPage;
  const totalProviders = allProviders.totalItems;
  const totalPages = allProviders.numPages;
  const offset = currentPage * 10 - 10;
  const search = {
    offset: offset,
    limit: 10,
    keyword: searchValue,
  };
  const filter = {
    offset: offset,
    limit: 10,
  };
  const [searchArr, setSearchArr] = useState(search);

  const { fetchProvider, fetchProvidersSearchKeywork } = useProvider(
    search,
    filter
  );
  const { setError } = useForm({
    defaultValues: {
      offset: "",
      limit: "",
    },
  });
  async function fetchProviderData() {
    const data = await fetchProvider.refetch();
    if (data.isSuccess) {
      setAllProviders(data.data.data);
    } else if (data.isError) {
      const error = data.error as ErrorObject;
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
  async function fetchKeyworkData() {
    const data = await fetchProvidersSearchKeywork.refetch();
    if (data.isSuccess) {
      setAllProviders(data.data.data);
    } else if (data.isError) {
      const error = data.error as ErrorObject;
      handleGlobalException(error, () => {
        setError("offset", {
          type: "manual",
          message: error.response.data.offset,
        });
        setError("limit", {
          type: "manual",
          message: error.response.data.limit,
        });
      });
    }
  }
  useEffect(() => {
    if (searchArr.keyword) {
      fetchKeyworkData();
    } else {
      fetchProviderData();
    }
  }, [searchArr]);
  useEffect(() => {
    setSearchArr((prev) => {
      return {
        ...prev,
        offset: offset,
        keyword: searchValue,
      };
    });
  }, [searchValue, offset]);
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
  const handleEdit = () => {};
  return (
    <div className="unit-ctn">
      <Title size="h5" color={theme.colors.cobaltBlue[0]}>
        Danh sách danh mục
      </Title>
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
      </Flex>
      <div className="unit-table">
        <ProviderTable
          startIndex={startIndex}
          endIndex={endIndex}
          allProvideres={allProviders}
          handleEdit={handleEdit}
        />
      </div>
      <br />
      <div className="pagination-ctn">
        {totalProviders === 0 ? (
          <div> Không tìm thấy kết quả nào.</div>
        ) : totalProviders === 1 ? (
          <div>Tìm thấy 1 kết quả.</div>
        ) : (
          <div>
            Hiển thị{" "}
            {endIndex <= totalProviders
              ? itemsPerPage
              : totalProviders % itemsPerPage}{" "}
            kết quả từ {startIndex + 1} -{" "}
            {endIndex <= totalProviders ? endIndex : totalProviders} trong tổng{" "}
            {totalProviders} kết quả
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
