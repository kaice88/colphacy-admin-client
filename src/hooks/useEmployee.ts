import axios from "../settings/axios";
import { useEffect, useState } from "react";
import { handleGlobalException } from "../utils/error";
import { useMutation, useQuery } from "@tanstack/react-query";
import { REQUEST_EMPLOYEES } from "../constants/apis";
import { Employee, EmployeeListItem } from "../components/Employee/type";

interface ApiResponse {
  data: {
    items: EmployeeListItem[];
    numPages: number;
    offset: number;
    limit: number;
    totalItems: number;
  } | null;
}
export default function useEmployee(
  offset: number,
  keyword: string | undefined,
  limit: number,
  branchId: number | undefined,
  roleId: number | undefined,
  gender: string | undefined
) {
  const fetchEmployee = useQuery<ApiResponse>({
    queryKey: ["get-employees"],
    queryFn: () => {
      const params: { [key: string]: number | string } = {};
      if (offset) {
        params.offset = offset;
      }
      if (keyword) {
        params.keyword = keyword;
      }
      if (branchId) {
        params.branchId = branchId;
      }
      if (roleId) {
        params.roleId = roleId;
      }
      if (gender) {
        params.gender = gender;
      }
      if (limit) {
        params.limit = limit;
      }
      return axios.get(REQUEST_EMPLOYEES, { params });
    },
    enabled: false,
    onError: (error) => {
      handleGlobalException(error, () => {});
    },
  });
  useEffect(() => {
    fetchEmployee.refetch();
  }, [offset, keyword, branchId, roleId, gender, limit]);
  return {
    loading: fetchEmployee.isLoading,
    employeeData: fetchEmployee.data?.data,
    fetchEmployee,
  };
}

export function useEmployeeDetail(employeeId: number | undefined) {
  const [loading, setLoading] = useState(false);

  const handleSubmitEmployeeForm = useMutation({
    mutationKey: ["add-employee"],
    mutationFn: (data: Employee) => {
      return !data.id
        ? axios.post(REQUEST_EMPLOYEES, data)
        : axios.put(REQUEST_EMPLOYEES, data);
    },
  });
  const onSubmitEmployeeForm = (
    data: Employee,
    onError: (error: object) => void,
    onSuccess: () => void
  ) => {
    handleSubmitEmployeeForm.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };

  // async function fetchData() {
  //   try {
  //     setLoading(true);
  //     if (employeeId) {
  //       const employeeData = await axios.get(
  //         `${REQUEST_EMPLOYEES}/${employeeId}`
  //       );
  //       setEmployeeData(employeeData.data);
  //     }
  //   } catch (error) {
  //     handleGlobalException(error, () => {});
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  const fetchEmployee = useQuery({
    queryKey: ["get-employees"],
    queryFn: () => {
      return axios.get(`${REQUEST_EMPLOYEES}/${employeeId}`);
    },
    enabled: false,
    onError: (error) => {},
  });

  const fetchBranch = useQuery({
    queryKey: ["get-branches"],
    queryFn: () => {
      return axios.get("/branches");
    },
    enabled: false,
    onError: (error) => {},
  });

  return {
    loading,
    onSubmitEmployeeForm,
    fetchBranch,
    fetchEmployee,
    // branchData: fetchBranch.data?.data.items
  };
}
