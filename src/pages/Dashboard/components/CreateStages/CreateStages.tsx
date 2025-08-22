import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';

// COMPONENTS
import Table from '../../../../components/common/Table/Table';
import Field from '../../../../components/common/Field/Field';

// INTERFACE
import { FormData } from '../../Dashboard';

// CSS
import "./CreateStage.scss"
import Button from '../../../../components/common/Button/Button';
import { MdDelete } from 'react-icons/md';
import classNames from 'classnames';

interface PermissionRow {
    item: string;
    stage_name: string;
    stage_description: string;
    roles: any[string];
}

type CreateStageProps = {
    formData: FormData;
    handleFormData: (key: string, value: any) => void;
};


const CreateStages: React.FC<CreateStageProps> = ({ formData, handleFormData }) => {
    const handleStageChange = (index: any, key: string, value: any) => {
        const newStages = [...formData.stages];
        newStages[index] = {
            ...newStages[index],
            [key]: value,
        };
        handleFormData("stages", newStages);
    }

    const addNewStage = () => {
        const newStage = [...formData.stages];
        newStage.push({ stage_name: "", stage_description: "", roles: [] })
        handleFormData("stages", newStage)
    }

    const deleteStage = (index: number) => {
        const newStages = formData.stages.filter((_, indexVal) => indexVal !== index);
        handleFormData("stages", newStages)
    }

    return (
        <>
            <div className='stage-container'>
                <div className='stages'>
                    {formData.stages.map((stage, index) => <div className='stage-row'>
                        <span className='stage-title'>Stage {index + 1}</span>
                        <Field label='Name' useDebounce type='text' name='stage_name' onChange={(e) => handleStageChange(index, "stage_name", e.target.value)} value={stage.stage_name} />
                        <Field label="Description" useDebounce type='text' name='stage_description' onChange={(e) => handleStageChange(index, "stage_description", e.target.value)} value={stage.stage_description} />
                        <Field label='Roles' options={[]} type='dropdown' name="roles" onChange={(e) => console.log("roles: ", e.target.value)} value={""} />
                        <div className='flex-center'><MdDelete className={classNames('delete flex-center', { disabled: index <= 1 })} onClick={() => deleteStage(index)} /></div>
                    </div>)}
                </div>
            </div>
            <div className='mt-2 mb-4'>
                <Button size='small' variant='outlined' onClick={addNewStage}>Add Stage</Button>
            </div>
        </>
    )
}

export default CreateStages