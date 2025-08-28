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
import { FETCH_DB_NAMES_URL, FETCH_ROLES_URL, CREATE_REPORT_URL, VALIDATE_QUERY, FETCH_REPORT_URL } from "../utils/url";

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

interface Report {
  name: string;
  url: string;
  id: string;
};

interface ValidateQueryProps {
  query: string;
  db_name: string;
  onSuccess: () => void;
}

export type CreateReportPayloadProps = {
  reportName: string;
  sqlScript: string;
  columns: {
    name: string;
    type: string | boolean;
    writableBy: string[];
  }[];
  stages?: any[]; // optional
};

interface CreateReportProps {
  payload: CreateReportPayloadProps;
}

export interface Stage {
  name: string;
  description: string;
  roles: string[];
}

export interface FormDataRow {
  report_name: string;
  database: string;
  query: string;
  stages?: Stage[];
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
  reports: Report[];
}

export const INITIAL_FORM_STATE: FormDataRow = {
  report_name: "",
  database: "",
  query: "",
  stages: [{ name: "", description: "", roles: [] }, { name: "", description: "", roles: [] }]
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<PermissionRow[]>([]);
  const [databases, setDatabases] = useState<DatabaseRow[]>([]);
  const [roles, setRoles] = useState([]);
  const [columns, setColumns] = useState<ColumnDef<PermissionRow>[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [reports, setReport] = useState([])

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

  const fetchReports = async () => {
    try {
      const response = await fetch(FETCH_REPORT_URL);
      if (response.status === 200) {
        const result = await response.json();
        setReport(result)
      }
    } catch (error) {
      toast.error("Error fetching reports, please try again later");
    }
  }

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

      const result = await response.json();
      const { columns, error } = result || {};

      if (response.status === 200) {
        setLoading(false);
        toast.success("Query validated Successfully");
        onSuccess();

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
      } else {
        setLoading(false)
        toast.error(error)
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
      const result = await response.json();
      const { error } = result || {}

      if (response.status === 200) {
        setLoading(false);
        toast.success("Report created successfully");
        setData([]);
        setColumns([]);
        setCurrentStep(0);
        setFormData(INITIAL_FORM_STATE);
      } else {
        setLoading(false)
        toast.error(error || "Error creating report, please try again later")
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error creating report, please try again later");
    }
  };

  useEffect(() => {
    fetchDatabases();
    fetchRoles();
    fetchReports()
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
        reports
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
