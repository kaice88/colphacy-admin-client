import { Button, Pagination, Select } from "@mantine/core";
import BranchTable from "../components/Branch/BranchTable";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import useBranchProvinces from "../hooks/useBranch";
import { handleGlobalException } from "../utils/error";
import { useForm } from "react-hook-form";
interface AllBranchesProps {
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
function formatProvincesDistricts(
  branchesProvinces: { slug: string; name: string }[]
) {
  return branchesProvinces.map((province) => ({
    value: province.slug,
    label: province.name,
  }));
}
function Branch() {
  const limitInit = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [branchesProvinces, setBranchesProvinces] = useState([]);
  const [allBranches, setAllBranches] = useState<AllBranchesProps>({
    items: [],
    numPages: 0,
    offset: 0,
    limit: 0,
    totalItems: 0,
  });
  const [provinceSlug, setProvinceSlug] = useState("");
  const [districtSlug, setDistrictSlug] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [branchesDistricts, setBranchesDistricts] = useState([]);

  // Function to handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const handleProvincesChange = (value: string) => {
    setProvinceSlug(value);
    setDistrictSlug("");
    setSearchValue("");
  };
  const handleDistrictsChange = (value: string) => {
    setDistrictSlug(value);
    setSearchValue("");
  };
  const offset = (currentPage - 1) * limitInit;

  const {
    fetchBranchProvinces,
    fetchAllBranch,
    fetchBranchDistricts,
    fetchBranchSearchDistricts,
    fetchBranchSearchKeywork,
    fetchBranchSearchProvinces,
  } = useBranchProvinces(
    offset,
    limitInit,
    provinceSlug,
    districtSlug,
    searchValue
  );

  const { setError } = useForm({
    defaultValues: {
      offset: "",
      limit: "",
    },
  });

  //fetch provinces
  useEffect(() => {
    async function fetchData() {
      const data = await fetchBranchProvinces.refetch();
      if (data.isSuccess) {
        setBranchesProvinces(data.data.data);
      } else if (data.isError) {
        const error = data.error.response;
        handleGlobalException(error, () => {});
      }
    }
    fetchData();
  }, []);
  const formattedProvinces = formatProvincesDistricts(branchesProvinces);

  //fetch all branch
  useEffect(() => {
    async function fetchData() {
      const data = await fetchAllBranch.refetch();
      if (data.isSuccess) {
        setAllBranches(data.data.data);
      } else if (data.isError) {
        const error = data.error.response;
        handleGlobalException(error, () => {});
      }
    }
    fetchData();
  }, [currentPage]);
  const itemsPerPage = allBranches.limit;
  const startIndex = allBranches.offset;
  const endIndex = startIndex + itemsPerPage;
  const totalBranches = allBranches.totalItems;
  const totalPages = allBranches.numPages;

  //fetch districts
  useEffect(() => {
    if (provinceSlug) {
      async function fetchData() {
        const data = await fetchBranchDistricts.refetch();
        if (data.isSuccess) {
          setBranchesDistricts(data.data.data);
        } else if (data.isError) {
          const error = data.error.response;
          handleGlobalException(error, () => {});
        }
      }
      fetchData();
    }
  }, [provinceSlug]);

  //search by province and district
  useEffect(() => {
    if (provinceSlug && districtSlug) {
      async function fetchData() {
        const data = await fetchBranchSearchDistricts.refetch();
        if (data.isSuccess) {
          setAllBranches(data.data.data);
        } else if (data.isError) {
          const error = data.error.response;
          handleGlobalException(error, () => {});
        }
      }
      fetchData();
    }
  }, [provinceSlug, districtSlug]);

  //search by province
  useEffect(() => {
    if (provinceSlug) {
      async function fetchData() {
        const data = await fetchBranchSearchProvinces.refetch();
        if (data.isSuccess) {
          setAllBranches(data.data.data);
        } else if (data.isError) {
          const error = data.error.response;
          handleGlobalException(error, () => {});
        }
      }
      fetchData();
    }
  }, [provinceSlug]);

  // search by keyword
  useEffect(() => {
    if (searchValue) {
      async function fetchData() {
        const data = await fetchBranchSearchKeywork.refetch();
        if (data.isSuccess) {
          setAllBranches(data.data.data);
        } else if (data.isError) {
          const error = data.error.response;
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
      fetchData();
    }
  }, [searchValue]);

  const formattedDistricts = formatProvincesDistricts(branchesDistricts);

  //Search
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    if (!searchValue.startsWith(" ")) {
      setSearchValue(searchValue);
      setProvinceSlug("");
      setDistrictSlug("");
      setBranchesDistricts([]);
    }
  };

  return (
    <div className="branch-ctn">
      <h1 className="branch-title">Danh sách chi nhánh</h1>
      <div className="search-field">
        <div className="search">
          <input
            ref={inputRef}
            value={searchValue}
            placeholder="Tìm bằng tên đường và tỉnh thành..."
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
        <Select
          placeholder="Chọn Tỉnh/ Thành"
          data={formattedProvinces}
          onChange={handleProvincesChange}
          value={provinceSlug}
        />
        <Select
          placeholder="Chọn Quận/ Huyện"
          data={formattedDistricts}
          onChange={handleDistrictsChange}
          value={districtSlug}
        />
        <Button
          className="button"
          leftIcon={<IconPlus size="15px" />}
          styles={(theme) => ({
            root: {
              backgroundColor: theme.colors.munsellBlue[0],
            },
          })}
        >
          Thêm chi nhánh
        </Button>
      </div>
      <div className="branch-table">
        <BranchTable
          startIndex={startIndex}
          endIndex={endIndex}
          allBranches={allBranches}
        />
      </div>
      <div className="pagination-ctn">
        {totalBranches === 0 ? (
          <div>Không tìm thấy kết quả nào.</div>
        ) : totalBranches === 1 ? (
          <div>Tìm thấy 1 kết quả.</div>
        ) : (
          <div>
            Hiển thị{" "}
            {endIndex <= totalBranches
              ? itemsPerPage
              : totalBranches % itemsPerPage}{" "}
            kết quả từ {startIndex + 1} -{" "}
            {endIndex <= totalBranches ? endIndex : totalBranches} trong tổng{" "}
            {totalBranches} kết quả
          </div>
        )}
        <Pagination
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

export default Branch;
