import {
    Button,
    Center,
    Flex,
    Modal,
    Pagination,
    Title,
    useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import EmployeeForm from '../components/Employee/EmployeeForm';
import EmployeeTable from '../components/Employee/EmployeeTable';
import { useEffect, useRef, useState } from 'react';
import useEmployee, { useEmployeeDetail } from '../hooks/useEmployee';
import { notificationShow } from '../components/Notification';
import { handleGlobalException } from '../utils/error';
import { useNavigate } from 'react-router-dom';

const LIMIT = 10;
export default function Employee() {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [employeeId, setEmployeeId] = useState<number | undefined>();
    const [branchId, setBranchId] = useState<number>();
    const [roleId, setRoleId] = useState<number>();
    const [gender, setGender] = useState<string>();
    const [active, setActive] = useState<boolean>();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [keyword, setKeyWord] = useState<string>('');
    const [opened, { open, close }] = useDisclosure(false);
    const [mode, setMode] = useState<'ADD' | 'EDIT' | 'DELETE'>('EDIT');
    const theme = useMantineTheme();
    const navigate = useNavigate()
    const { employeeData, loading, fetchEmployee } =
        useEmployee((currentPage - 1) * LIMIT, keyword, LIMIT, branchId, roleId, gender, active);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword = e.target.value;
        setKeyWord(keyword);
        setCurrentPage(1);
    };
    
    const {
        onSubmitEmployeeForm,
        fetchEmployeeById,
        detailEmployee
    } = useEmployeeDetail(employeeId);
    const handleEdit = (Id: number) => {
        setMode('EDIT');
        setEmployeeId(Id);
        open();
    };

    const handleAdd = () => {
        setMode('ADD');
        open();
    };

    const handleDelete = (Id: number) => {
        setMode('DELETE');
        setEmployeeId(Id);
        open();
    };

    const handleCloseModal = () => {
        close();
    };

    const changeActiveEmployee = () =>{
        async function fetchDetailEmployee() {
            const data = await fetchEmployeeById.refetch();
            if (data.isSuccess) {
                detailEmployee.active = !detailEmployee.active
                setActive(detailEmployee.active)
                console.log(detailEmployee);
            } else if (data.isError) {
                const error = data.error;
                handleGlobalException(error, () => { });
            }
        }
        fetchDetailEmployee();
        return detailEmployee
    }
    return (
        <div className="branch-ctn">
            <Title size="h5" color={theme.colors.cobaltBlue[0]}>
                Danh sách nhân viên
            </Title>
            <Flex justify="space-between" align="center" py="lg">
                <div className="search">
                    <input
                        ref={inputRef}
                        value={keyword}
                        placeholder="Tìm kiếm theo tên tài khoản, sđt"
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
                <Button
                    leftIcon={<IconPlus size="15px" />}
                    styles={(theme) => ({
                        root: {
                            backgroundColor: theme.colors.munsellBlue[0],
                            ...theme.fn.hover({
                                backgroundColor: theme.fn.darken(
                                    theme.colors.munsellBlue[0],
                                    0.1,
                                ),
                            }),
                        },
                    })}
                    onClick={() => {
                        setEmployeeId(undefined);
                        setMode('ADD');
                        open();
                    }}
                >
                    Thêm nhân viên
                </Button>
            </Flex>
            <Modal
                size= {mode!=="DELETE"?"70%":"30%"}
                opened={opened}
                onClose={close}
                radius={5}
                centered
                title={
                    mode === 'ADD'
                        ? 'Thêm nhân viên'
                        : mode === "EDIT"
                            ?'Sửa nhân viên'
                            // : 'Vô hiệu hóa nhân viên'
                            : detailEmployee?.active
                                ? 'Vô hiệu hóa nhân viên'
                                : 'Hủy hiệu hóa nhân viên'
                }
                styles={() => ({
                    title: {
                        fontWeight: 'bold',
                    },
                })}
            >
                {mode !== "DELETE" &&
                    <EmployeeForm
                        onClose={handleCloseModal}
                        mode={mode}
                        employeeId={employeeId}
                    />
                }
                {mode === "DELETE" &&
                    <Flex direction="column">
                        <Center>
                            <Flex gap="md" pb={20}>
                                <Button
                                    radius={50}
                                    onClick={() => {
                                        onSubmitEmployeeForm(
                                            changeActiveEmployee(),
                                            (error) => {
                                                handleGlobalException(error, () => {
                                                    notificationShow('error','Error!', error.response.data[0])
                                                });
                                            },
                                            () => {
                                                notificationShow(
                                                    'success',
                                                    'Success!',
                                                    'Vô hiệu hóa nhân viên thành công!'
                                                    // detailEmployee.active
                                                    //     ? 'Vô hiệu hóa nhân viên thành công!'
                                                    //     : 'Hủy vô hiệu hóa nhân viên thành công!'
                                                );
                                                close()
                                            },
                                        );
                                    }}
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
                                >
                                    Xác nhận
                                </Button>
                                <Button
                                    radius={50}
                                    onClick={() => {
                                        close()
                                    }}
                                    styles={(theme) => ({
                                        root: {
                                            backgroundColor: theme.colors.red[5],
                                            ...theme.fn.hover({
                                                backgroundColor: theme.fn.darken(
                                                    theme.colors.red[0],
                                                    0.1
                                                ),
                                            }),
                                        },
                                    })}
                                >
                                    Hủy
                                </Button>
                            </Flex>
                        </Center>
                    </Flex>
                }
            </Modal>
            <div className="branch-table">
                <EmployeeTable
                    data={employeeData?.items}
                    startIndex={employeeData?.offset}
                    handleEdit={handleEdit}
                    handleAdd={handleAdd}
                    handleDelete={handleDelete}
                />
            </div>
            {!loading && employeeData && (
                <Flex justify="space-between" align="center" py="lg">
                    <div>
                        {employeeData?.totalItems === 0 ? (
                            <div>Không tìm thấy kết quả nào.</div>
                        ) : employeeData?.totalItems === 1 ? (
                            <div>Tìm thấy 1 kết quả.</div>
                        ) : (
                            <div>
                                Hiển thị {employeeData?.items.length} kết quả từ{' '}
                                {employeeData?.offset + 1} -{' '}
                                {employeeData?.offset + employeeData?.items.length} trong tổng{' '}
                                {employeeData?.totalItems} kết quả
                            </div>
                        )}
                    </div>
                    <Pagination
                        value={currentPage}
                        total={employeeData?.numPages}
                        onChange={setCurrentPage}
                        position="center"
                        styles={(theme) => ({
                            control: {
                                '&[data-active]': {
                                    backgroundColor: theme.colors.munsellBlue[0],
                                    border: 0,
                                },
                            },
                        })}
                    />
                </Flex>
            )}
        </div>
    );
}
