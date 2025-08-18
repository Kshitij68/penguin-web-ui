import { ColumnDef } from "@tanstack/react-table";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import toast from "react-hot-toast";

// CONSTANTS
import { FETCH_DB_NAMES_URL, FETCH_ROLES_URL, CREATE_REPORT_URL, VALIDATE_QUERY } from "../utils/url";

// Interfaces
interface PermissionRow {
  item: string;
  [key: string]: string | boolean;
}

interface DatabaseRow {
  label: string;
  value: string;
}

export interface RolesRow {
  id: string;
  name: string;
}

interface ValidateQueryProps {
  query: string;
  db_name: string;
  onSuccess: () => void;
}

interface CreateReportProps {
  payload: any;
}

interface FormDataRow {
  report_name: string;
  database: string;
  query: string;
}

interface DataContextType {
  data: PermissionRow[];
  setData: React.Dispatch<React.SetStateAction<PermissionRow[]>>;
  databases: DatabaseRow[];
  roles: RolesRow[];
  setDatabases: React.Dispatch<React.SetStateAction<DatabaseRow[]>>;
  validateQuery: (params: ValidateQueryProps) => Promise<any>;
  columns: ColumnDef<PermissionRow>[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnDef<PermissionRow>[]>>;
  loading: boolean;
  createReport: (payload: CreateReportProps) => Promise<any>;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  formData: FormDataRow;
  setFormData: React.Dispatch<React.SetStateAction<FormDataRow>>;
}

const INITIAL_FORM_STATE = {
  report_name: "",
  database: "",
  query: "",
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<PermissionRow[]>([]);
  const [databases, setDatabases] = useState<DatabaseRow[]>([]);
  const [roles, setRoles] = useState([]);
  const [columns, setColumns] = useState<ColumnDef<PermissionRow>[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const fetchDatabases = async () => {
    try {
      const response = await fetch(FETCH_DB_NAMES_URL);
      const result = await response.json();
      const databases = result.db_name.map((database: string) => ({
        label: database,
        value: database,
      }));
      setDatabases(databases);
    } catch (error) {
      toast.error("Error fetching databases, please try again later");
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch(FETCH_ROLES_URL);
      const result = await response.json();
      setRoles(result.roles);
    } catch (error) {
      toast.error("Error fetching roles, please try again later");
    }
  };

  const validateQuery = async ({
    query,
    db_name,
    onSuccess,
  }: ValidateQueryProps): Promise<any> => {
    try {
      setLoading(true);
      const response = await fetch(VALIDATE_QUERY, {
        method: "POST",
        body: JSON.stringify({ query, db_name }),
        headers: {
          "Content-type": "application/json",
        },
      });

      if (response.status === 200) {
        setLoading(false);
        toast.success("Query validated Successfully");
        onSuccess();
        const result = await response.json();
        const { columns } = result || {};

        const tableData = columns.map(
          ({
            col_name,
            data_type,
          }: {
            col_name: string;
            data_type: string;
          }) => {
            const row: PermissionRow = { item: col_name, data_type };
            roles.forEach((role: RolesRow) => {
              const { name } = role || {};
              row[name] = false;
            });
            return row;
          }
        );
        setData(tableData);
        setColumns(columns);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error validating query, please try again later");
    }
  };

  const createReport = async ({ payload }: CreateReportProps): Promise<any> => {
    try {
      setLoading(true);
      const response = await fetch(CREATE_REPORT_URL, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.status === 200) {
        setLoading(false);
        toast.success("Report created successfully");
        setData([]);
        setColumns([]);
        setCurrentStep(0);
        setFormData(INITIAL_FORM_STATE);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error creating report, please try again later");
    }
  };

  useEffect(() => {
    fetchDatabases();
    fetchRoles();
  }, []);

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        databases,
        setDatabases,
        roles,
        validateQuery,
        columns,
        setColumns,
        loading,
        createReport,
        currentStep,
        setCurrentStep,
        formData,
        setFormData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be within a DataProvider");
  }
  return context;
};
