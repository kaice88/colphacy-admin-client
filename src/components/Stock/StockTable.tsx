import { MantineReactTable, useMantineReactTable } from 'mantine-react-table'
import { useMemo } from 'react'
import { Flex, Text, Tooltip, useMantineTheme } from '@mantine/core'
import ChildTable from './TableChildren';




const StockTable = ({ stockData, startIndex, isLoading, result }) => {
    // const collapsedData = {};
    // let index = 0
    // for (let i = stockData.length - 1; i >= 0; i--) {

    //     const { productId, productName, quantity } = stockData[i];
    //     if (collapsedData[productId]) {
    //         collapsedData[productId].totalQuantity += quantity;
    //     } else {
    //         index++
    //         collapsedData[productId] = {
    //             no: startIndex !== undefined ? startIndex + index : '',
    //             productName,
    //             totalQuantity: quantity,
    //             id: productId,
    //         };
    //     }
    // }


    // const result = Object.values(collapsedData);
    // console.log(result, "day");

    const columns = useMemo(
        () => [
            {
                accessorKey: 'no',
                header: 'STT',
                size: 50,
                Cell: ({ renderedCellValue }) => (
                    <Text
                    //   color={globalTheme.fn.darken(globalTheme.colors.orange[0], 0.1)}
                    >
                        {renderedCellValue}
                    </Text>
                ),
            },
            {
                accessorKey: 'productName',
                header: 'Tên sản phẩm',
                size: 200,
                Cell: ({ renderedCellValue }) => (
                    <Text
                    //   color={globalTheme.fn.darken(globalTheme.colors.orange[0], 0.1)}
                    >
                        {renderedCellValue}
                    </Text>
                ),
            },
            {
                accessorKey: 'totalQuantity',
                size: 50,
                header: 'Tổng số lượng',
                Cell: ({ renderedCellValue }) => (
                    <Text
                    //   color={globalTheme.fn.darken(globalTheme.colors.orange[0], 0.1)}
                    >
                        {renderedCellValue}
                    </Text >
                ),
            }
        ],
        [],
    )



    const table = useMantineReactTable({
        columns,
        data: result,
        renderDetailPanel: ({ row }) => {
            return <ChildTable data={stockData.filter(item => item.productId === row.original.id)}></ChildTable>

        },
        mantineDetailPanelProps: props => (
            {
                style: {
                    textAlign: 'center',
                    // padding: '5px',
                },
            }),
        enableColumnActions: false,
        enableSorting: false,
        enableTopToolbar: false,
        enablePagination: false,
        mantineTableBodyCellProps: ({ row }) => ({
            style: {
                padding: '10px',
            },
        }),
        mantineTableContainerProps: ({ table }) => ({
            sx: {
                maxHeight: '500px',
                padding: '3px',
            },
            className: 'table-view-expandable',
        }),
        enableBottomToolbar: false,
        state: { isLoading },
    })

    return <MantineReactTable table={table} />

}

export default StockTable
