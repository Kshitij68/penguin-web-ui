import React, { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import toast from "react-hot-toast";
import classNames from "classnames";

// COMPONENTS
import Table from "../../../../components/common/Table/Table";
import Button from "../../../../components/common/Button/Button";
import Field from "../../../../components/common/Field/Field";

// ICONS
import { MdDelete } from "react-icons/md";

// CONTEXT
import { RolesRow, useDataContext } from "../../../../context/DataContext";

// CONSTANTS
import { COLUMN_DATA_TYPES } from "../../../../utils/constants";

// CSS
import "./ConfigureAccess.scss";

interface PermissionRow {
  item: string;
  [key: string]: boolean | string;
}

const ConfigureAccess = () => {
  const { data, setData, roles } = useDataContext();

  const handleCheckBoxChange = (rowIndex: number, role: string) => {
    setData((prevData) => {
      const updated = [...prevData];
      const currentValue = updated[rowIndex][role] as boolean;
      updated[rowIndex] = {
        ...updated[rowIndex],
        [role]: !currentValue,
      };
      return updated;
    });
  };

  const handleDelete = (rowIndex: number) => {
    setData((prevData) => {
      const updated = [...prevData];
      const filteredData = updated.filter((_, index) => index !== rowIndex);
      return filteredData;
    });
  };

  const handleAddColumn = () => {
    toast(
      (t) => {
        const [newColumn, setNewColumn] = useState({ name: "", dataType: "" });

        const handleNewColumn = (key: string, value: string) => {
          setNewColumn((prev) => ({ ...prev, [key]: value }));
        };

        const handleColumnAdd = () => {
          const { name, dataType } = newColumn;
          const trimmedValue = name.trim();
          if (!trimmedValue) return;

          const exist = data.some((row) => row.item === name);

          if (exist) {
            toast.error("Column already exist");
            return;
          }

          const newRow: PermissionRow = { item: trimmedValue };
          roles.forEach((role: RolesRow) => {
            const { name } = role || {};
            newRow[name] = false;
          });
          newRow["data_type"] = dataType;
          newRow["canDelete"] = true;

          const updatedData = [...data, newRow];
          setData(updatedData);
          toast.dismiss(t.id);
        };

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Field
              type="text"
              placeholder="Enter column name"
              name="name"
              onChange={(e) => handleNewColumn("name", e.target.value)}
              label="Add new column"
              value={newColumn.name}
            />
            <Field
              type="dropdown"
              options={COLUMN_DATA_TYPES}
              placeholder="Enter Data Type"
              name="dataType"
              onChange={(e) => handleNewColumn("dataType", e.target.value)}
              label="Column data type"
              value={newColumn.dataType}
            />
            <div style={{ display: "flex", gap: "8px" }}>
              <Button
                style={{ flex: 1 }}
                onClick={handleColumnAdd}
                disabled={!newColumn.name || !newColumn.dataType}
              >
                Add
              </Button>
              <Button style={{ flex: 1 }} onClick={() => toast.dismiss(t.id)}>
                Cancel
              </Button>
            </div>
          </div>
        );
      },
      {
        duration: Infinity,
      }
    );


  };
  const tableColumns: ColumnDef<PermissionRow>[] = useMemo(
    () => [
      {
        accessorKey: "item",
        header: "",
        cell: (info) => info.getValue(),
      },
      ...roles.map(({ id, name }: RolesRow) => ({
        accessorKey: name,
        header: name,
        cell: (info: any) => {
          const rowIndex = info.row.index;
          return (
            <input
              type="checkbox"
              checked={info.getValue() as boolean}
              onChange={() => handleCheckBoxChange(rowIndex, name)}
            />
          );
        },
      })),
      {
        accessorKey: "action",
        header: "ACTION",
        cell: (info: any) => {
          const row = info.row || {};
          const { original, index } = row || {};
          const canDelete = original || {};
          return (
            <div
              className={classNames("delete", {
                disabledDelete: !canDelete,
              })}
              onClick={() => handleDelete(index)}
            >
              <MdDelete />
            </div>
          );
        },
      },
    ],
    [roles, handleAddColumn, handleCheckBoxChange]
  );

  return (
    <div className="permission-table-container">
      <Table data={data} columns={tableColumns} />
      <Button className="add-column-btn" onClick={() => handleAddColumn()}>
        + Add Column
      </Button>
    </div>
  );
};

export default ConfigureAccess;
