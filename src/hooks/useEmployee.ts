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
  gender: string | undefined,
  active: boolean
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
  }, [offset, keyword, branchId, roleId, gender, limit, active]);
  return {
    loading: fetchEmployee.isLoading,
    employeeData: fetchEmployee.data?.data,
    fetchEmployee,
  };
}

export function useEmployeeDetail(employeeId: number | undefined) {
  const [loading, setLoading] = useState(false);

  const handleSubmitEmployeeForm = useMutation({
    mutationKey: ["add-or-edit-employee"],
    mutationFn: (data: Employee) => {
      return data.id===undefined
        ? axios.post(REQUEST_EMPLOYEES, data)
        : axios.put(REQUEST_EMPLOYEES, {
          id: data.id,
          gender: data.gender,
          branchId: data.branchId,
          active: data.active
        });
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
  // useEffect(()=>{
  //   if(employeeId!==undefined){
  //     fetchEmployeeById.refetch();
  //   }
  // }, [employeeId])
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

  const fetchEmployeeById = useQuery({
    queryKey: ["get-employee"],
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
    onSubmitEmployeeForm,
    fetchBranch,
    fetchEmployeeById,
    detailEmployee: fetchEmployeeById.data?.data as Employee,
    branchData: fetchBranch.data?.data.items,
    loading: handleSubmitEmployeeForm.isLoading,
  };
}
