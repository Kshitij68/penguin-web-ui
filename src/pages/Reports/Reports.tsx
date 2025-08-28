import React from "react";
import { useNavigate } from "react-router-dom";

// COMPONENTS
import Table from "../../components/common/Table/Table";
import Button from "../../components/common/Button/Button";

// CONTEXT
import { useDataContext } from "../../context/DataContext";

// CSS
import "./Reports.scss";


const Reports = () => {
  const { reports } = useDataContext()

  const navigate = useNavigate()

  const tableColumns = [{
    accessorKey: "name",
    header: "Report name",
    cell: (info: any) => <span className="reportName">{info.getValue()}</span>,
  }, {
    accessorKey: "url",
    header: "Report URL",
    cell: (info: any) => <a target="_blank" href={info.getValue()}>{info.getValue()}</a>
  }]

  return (
    <div>
      <div className="flex-between mt-2 mb-8">
        <h3>Reports</h3>
        <Button size="small" variant="outlined" onClick={() => navigate("/")}>Create new report</Button>
      </div>
      {reports.length ? <Table columns={tableColumns} data={reports} /> : <div>No reports found</div>}
    </div>
  );
};

export default Reports;
