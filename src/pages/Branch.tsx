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
  const offset = (currentPage - 1) * limitInit;
  const filter = {
    offset: offset,
    limit: 10,
    province: provinceSlug,
    district: districtSlug,
  };
  const search = {
    offset: offset,
    limit: 10,
    keyword: searchValue,
  };

  const {
    fetchBranchProvinces,
    fetchBranchDistricts,
    fetchBranch,
    fetchBranchSearchKeywork,
  } = useBranchProvinces(search, filter, provinceSlug);

  const { setError } = useForm({
    defaultValues: {
      offset: "",
      limit: "",
    },
  });

  const [filterArr, setFilterArr] = useState(filter);
  const [searchArr, setSearchArr] = useState(search);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const handleProvincesChange = (value: string) => {
    setProvinceSlug(value);
    setDistrictSlug("");
    setSearchValue("");
    setCurrentPage(1);
  };
  const handleDistrictsChange = (value: string) => {
    setDistrictSlug(value);
    setSearchValue("");
    setCurrentPage(1);
  };

  useEffect(() => {
    setFilterArr({
      offset: offset,
      limit: 10,
      province: provinceSlug,
      district: districtSlug,
    });
  }, [districtSlug, provinceSlug, offset]);
  useEffect(() => {
    setSearchArr({
      offset: offset,
      limit: 10,
      keyword: searchValue,
    });
  }, [searchValue, offset]);

  useEffect(() => {
    async function fetchBranchData() {
      const data = await fetchBranch.refetch();

      if (data.isSuccess) {
        setAllBranches(data.data.data);
      } else if (data.isError) {
        const error = data.error.response;
        handleGlobalException(error, () => {});
      }
    }
    fetchBranchData();

    if (searchArr.keyword) {
      async function fetchKeyworkData() {
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
      fetchKeyworkData();
    }
  }, [filterArr, searchArr]);
  useEffect(() => {
    if (provinceSlug === null) {
      setBranchesDistricts([]);
    }
    async function fetchProvincesData() {
      const data = await fetchBranchProvinces.refetch();
      if (data.isSuccess) {
        setBranchesProvinces(data.data.data);
      } else if (data.isError) {
        const error = data.error.response;
        handleGlobalException(error, () => {});
      }
    }
    fetchProvincesData();
    if (provinceSlug) {
      async function fetchDistrictsData() {
        const data = await fetchBranchDistricts.refetch();
        if (data.isSuccess) {
          setBranchesDistricts(data.data.data);
        } else if (data.isError) {
          const error = data.error.response;
          handleGlobalException(error, () => {});
        }
      }
      fetchDistrictsData();
    }
  }, [provinceSlug]);

  const formattedProvinces = formatProvincesDistricts(branchesProvinces);
  const itemsPerPage = allBranches.limit;
  const startIndex = allBranches.offset;
  const endIndex = startIndex + itemsPerPage;
  const totalBranches = allBranches.totalItems;
  const totalPages = allBranches.numPages;

  const formattedDistricts = formatProvincesDistricts(branchesDistricts);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    if (!searchValue.startsWith(" ")) {
      setSearchValue(searchValue);
      setProvinceSlug("");
      setDistrictSlug("");
      setBranchesDistricts([]);
      setCurrentPage(1);
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
        <div className="label">hoặc</div>
        <Select
          placeholder="Chọn Tỉnh/ Thành"
          data={formattedProvinces}
          onChange={handleProvincesChange}
          value={provinceSlug}
          clearable
        />
        <Select
          placeholder="Chọn Quận/ Huyện"
          data={formattedDistricts}
          onChange={handleDistrictsChange}
          value={districtSlug}
          clearable
        />
        <Button
          className="button add-button"
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

export default Branch;
