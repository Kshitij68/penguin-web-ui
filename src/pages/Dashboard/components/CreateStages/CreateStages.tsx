import React from 'react';
import classNames from 'classnames';

// COMPONENTS
import Field from '../../../../components/common/Field/Field';
import Button from '../../../../components/common/Button/Button';

// ASSET
import { MdDelete } from 'react-icons/md';

// INTERFACE
import { FormData } from '../../Dashboard';

// CONTEXT
import { useDataContext } from '../../../../context/DataContext';

// CSS
import "./CreateStage.scss"

type CreateStageProps = {
    formData: FormData;
    handleFormData: (key: string, value: any) => void;
};


const CreateStages: React.FC<CreateStageProps> = ({ formData, handleFormData }) => {

    const { roles } = useDataContext()

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
        newStage.push({ name: "", description: "", roles: [] })
        handleFormData("stages", newStage)
    }

    const deleteStage = (index: number) => {
        const newStages = formData.stages.filter((_, indexVal) => indexVal !== index);
        handleFormData("stages", newStages)
    }

    const rolesOptions = roles.map(role => ({ label: role.name, value: role.id }));

    return (
        <>
            <div className='stage-container'>
                <div className='stages'>
                    {formData.stages.map((stage, index) => <div className='stage-row'>
                        <span className='stage-title'>Stage {index + 1}</span>
                        <Field label='Name' useDebounce type='text' name='name' onChange={(e) => handleStageChange(index, "name", e.target.value)} value={stage.name} />
                        <Field label="Description" useDebounce type='text' name='description' onChange={(e) => handleStageChange(index, "description", e.target.value)} value={stage.description} />
                        <Field
                            type="multiselect"
                            label="Role"
                            name="role"
                            placeholder="Add a role..."
                            options={rolesOptions}
                            value={stage.roles}
                            onChange={(_: string, value: string[]) => handleStageChange(index, "roles", value)}
                        />
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