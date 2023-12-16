import {
    Button,
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
import { useRef, useState } from 'react';
import useEmployee from '../hooks/useEmployee';

const LIMIT = 10;
export default function Employee() {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [employeeId, setEmployeeId] = useState<number | undefined>();
    const [branchId, setBranchId] = useState<number>();
    const [roleId, setRoleId] = useState<number>();
    const [gender, setGender] = useState<string>();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [keyword, setKeyWord] = useState<string>('');
    const [opened, { open, close }] = useDisclosure(false);
    const [mode, setMode] = useState<'ADD' | 'EDIT' | 'VIEW' |'CANCEL'>('VIEW');
    const theme = useMantineTheme();
    const { employeeData, loading, fetchEmployee } =
        useEmployee((currentPage - 1) * LIMIT, keyword, LIMIT, branchId, roleId, gender);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword = e.target.value;
        setKeyWord(keyword);
        setCurrentPage(1);
    };

    const handleEdit = (Id: number) => {
        setMode('EDIT');
        setEmployeeId(Id);
        open();
    };

    const handleView = (Id: number) => {
        setMode('VIEW');
        setEmployeeId(Id);
        open();
    };
    const handleCloseModal = () => {
        close();
        fetchEmployee.refetch();
    };
    const handleCancel = (Id: number) => {
        setMode('CANCEL');
        setEmployeeId(Id);
        open();
    };
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
                size="70%"
                opened={opened}
                onClose={close}
                radius={5}
                centered
                m="20"
                title={
                    mode === 'ADD'
                        ? 'Thêm nhân viên'
                        : mode === 'EDIT'
                            ? 'Sửa nhân viên'
                            : 'Xem nhân viên'
                }
                styles={() => ({
                    title: {
                        fontWeight: 'bold',
                    },
                })}
            >
                <EmployeeForm
                    onClose={handleCloseModal}
                    mode={mode}
                    employeeId={employeeId}
                />
            </Modal>
            <div className="branch-table">
                <EmployeeTable
                    data={employeeData?.items}
                    startIndex={employeeData?.offset}
                    handleEdit={handleEdit}
                    handleView={handleView}
                    handleCancel={handleCancel}
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
