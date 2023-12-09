import { FC } from 'react';
import { Table } from '@mantine/core';
import { IconEdit, IconTrashX } from '@tabler/icons-react';
import { Unit } from './UnitForm';
import { deleteModal } from '../../utils/deleteModal';

interface UnitTableProps {
    startIndex: number;
    endIndex: number;
    allUnites: AllUnitesProps;
    handleEdit: (unit: Unit) => void;
    handleDeleteUnit: (data: { id: number }) => void;
}
interface AllUnitesProps {
    items: Unit[];
    numPages: number;
    offset: number;
    limit: number;
    totalItems: number;
}


const ChildTable: FC<UnitTableProps> = ({
    data,
}) => {
    const rows = data.map((element, index) => (
        <tr key={index}>
            <td >{element.unitName}</td>

            <td>{element.expirationDate || "Chưa nhập"}</td>
            <td>{element.quantity}</td>
        </tr>
    ));


    return (
        <Table>
            <thead>
                <tr>
                    <th style={{ textAlign: 'center' }}>Đơn vị tính</th>

                    <th style={{ textAlign: 'center' }}>Ngày hết hạn</th>
                    <th style={{ textAlign: 'center' }}>Số lượng</th>
                </tr>

            </thead>
            <tbody>{rows}</tbody>
        </Table>
    );
};

export default ChildTable;
