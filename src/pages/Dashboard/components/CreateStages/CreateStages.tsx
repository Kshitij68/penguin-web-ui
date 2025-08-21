import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';

// COMPONENTS
import Table from '../../../../components/common/Table/Table';
import Field from '../../../../components/common/Field/Field';

// INTERFACE
import { PermissionRow } from '../ConfigureAccess/ConfigureAccess';

// CSS
import "./CreateStage.scss"


const CreateStages = () => {
    const tableColumns: ColumnDef<PermissionRow>[] = useMemo(
        () => [
            {
                accessorKey: "stage_name",
                header: "Stage name",
                cell: (info) => <Field type='text' name='stage_name' onChange={(e) => console.log("name: ", e.target.value)} value={""} />,
            },
            {
                accessorKey: "stage_description",
                header: "Stage description",
                cell: (info) => <Field type='text' name='stage_description' onChange={(e) => console.log("description: ", e.target.value)} value={""} />,
            },
            {
                accessorKey: "role",
                header: "Roles",
                cell: (info) => <Field options={[]} type='dropdown' name="roles" onChange={(e) => console.log("roles: ", e.target.value)} value={""} />,
            },


        ],
        []
    );
    return (
        <div className='stage-container'><Table columns={tableColumns} data={[{ item: "", stage_name: "", stage_description: "", role: "" }]} /></div>
    )
}

export default CreateStages