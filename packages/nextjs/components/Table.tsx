import { ChangeEvent, useEffect, useState } from "react";
import useSort from "../hooks/useSort";
import useTableSearch from "../hooks/useTableSearch";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

interface TableColumn {
  key: string;
  title: string;
  isSortable?: boolean;
  isSearchable?: boolean;
  render?: (row: Record<string, any>) => React.ReactNode;
}

interface TableProps {
  data: Record<string, any>[];
  columns: TableColumn[];
  className?: string;
  onViewRowDetailsClicked?: (row: Record<string, any>) => void;
}

interface HoveredCell {
  row: Record<string, any>;
  columnKey: string | null;
}

export default function Table({ data, columns, className, onViewRowDetailsClicked }: TableProps) {
  const [search, setSearch] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState(columns[0].key);
  const [isAscending, setIsAscending] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editValues, setEditValues] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<HoveredCell | null>(null);

  const filteredData = useTableSearch(data, columns, search);
  const sortedData = useSort(filteredData, sortKey, isAscending);
  const [tableData, setTableData] = useState(sortedData);

  useEffect(() => {
    setTableData(sortedData);
  }, [sortedData]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setIsAscending(!isAscending);
    } else {
      setSortKey(key);
      setIsAscending(true);
    }
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>, field: string) => {
    setSearch(prevState => ({
      ...prevState,
      [field]: e.target.value,
    }));
  };

  const handleEditClick = (id: any) => {
    setEditId(id);
    const itemToEdit = data.find(item => item.id === id);
    setEditValues(itemToEdit as any);
  };

  const handleEditChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setEditValues(prevEditValues => ({
      ...prevEditValues,
      [name]: value,
    }));
  };

  const saveCollege = async () => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 3000);
    });
  };

  const handleSaveClick = async (id: any) => {
    setIsSaving(true);
    const index = data.findIndex(item => item.id === id);
    const updatedData = [...data];
    updatedData[index] = editValues;
    // make an API call here to save the updated data to the server
    await saveCollege();
    setTableData(updatedData);
    setEditId(null);
    setEditValues({});
    setIsSaving(false);
  };

  const handleCancelClick = () => {
    setEditId(null);
    setEditValues({});
  };

  function handleCellMouseEnter(row: any, columnKey: string | null) {
    setHoveredCell({ row, columnKey } as any);
  }

  function handleCellMouseLeave() {
    setHoveredCell(null);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRowViewClick = (row: Record<string, any>, _: string) => {
    if (onViewRowDetailsClicked) {
      onViewRowDetailsClicked(row);
    }
  };

  return (
    <table className={`table border border-t-slate-300 shadow w-full ${className}`}>
      <thead>
        <tr>
          {columns.map(column => (
            <th key={column.key} className="px-4 py-2" onClick={() => column.isSortable && handleSort(column.key)}>
              <div className={`ml-1 inline-flex items-center space-x-1 ${column.isSortable && "cursor-pointer"}`}>
                {column.title}
                {column.isSortable && (
                  <>
                    <svg className={`fill-current h-4 w-4 ${isAscending ? "" : "hidden"}`} viewBox="0 0 20 20">
                      <path d="M10 3l-7 9h14l-7-9z" />
                    </svg>
                    <svg
                      className={`fill-current h-4 w-4 ${isAscending ? "hidden" : ""} transform rotate-180`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 3l-7 9h14l-7-9z" />
                    </svg>
                  </>
                )}
              </div>
            </th>
          ))}
          <th>Actions</th>
        </tr>
        <tr>
          {columns.map((column: any) => (
            <th key={`${column.key}-filter`}>
              {column.isSearchable && (
                <input
                  id={`${column.key}-filter`}
                  className="input input-bordered input-sm w-full max-w-xs"
                  type="text"
                  value={search[column.key] || ""}
                  onChange={e => handleSearch(e, column.key)}
                  placeholder={`Search by ${column.title}`}
                />
              )}
            </th>
          ))}
          <th></th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((row: Record<string, any>) => (
          <tr key={row.id} onMouseEnter={() => handleCellMouseEnter(row, null)} onMouseLeave={handleCellMouseLeave}>
            {columns.map(column => (
              <td
                key={column.key}
                className="relative px-4 py-2"
                onMouseEnter={() => handleCellMouseEnter(row, column.key)}
                onMouseLeave={handleCellMouseLeave}
              >
                {editId === row.id ? (
                  <input
                    className="input input-bordered input-sm w-full max-w-xs"
                    type="text"
                    name={column.key}
                    value={editValues[column.key] || ""}
                    onChange={handleEditChange}
                  />
                ) : column.render ? (
                  column.render(row)
                ) : (
                  <>
                    {row[column.key]}
                    {hoveredCell?.row === row && hoveredCell?.columnKey === column.key && (
                      <span
                        className="badge absolute top-0 right-0 mt-1 mr-1 cursor-pointer z-10"
                        onClick={() => handleRowViewClick(row, column.key)}
                      >
                        View
                        <ArrowUpRightIcon className="ml-1 h-4 w-4" />
                      </span>
                    )}
                  </>
                )}
              </td>
            ))}
            <td className="">
              {editId === row.id ? (
                <>
                  <button
                    className={`btn btn-outline btn-xs cursor-pointer ${isSaving && "loading"}`}
                    onClick={() => handleSaveClick(row.id)}
                  >
                    Save
                  </button>
                  <button className="btn btn-outline btn-xs btn-error ml-2 cursor-pointer" onClick={handleCancelClick}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <div className="dropdown dropdown-right">
                    <label tabIndex={0} className="btn btn-xs cursor-pointer">
                      Manage
                    </label>
                    <ul tabIndex={0} className="dropdown-content menu p-1 shadow bg-base-100 w-52">
                      <li>
                        <span className="p-1" onClick={() => handleRowViewClick(row, "")}>
                          View
                        </span>
                      </li>
                      <li>
                        <span className="p-1" onClick={() => handleEditClick(row.id)}>
                          Edit
                        </span>
                      </li>
                      <li>
                        <span className="p-1">Manage Milestones</span>
                      </li>
                      <li>
                        <span className="p-1">Cancel</span>
                      </li>
                    </ul>
                  </div>
                  {/* <div className="btn btn-outline btn-xs cursor-pointer" onClick={() => handleEditClick(row.id)}>
                    Edit
                  </div>
                  <div
                    className="btn btn-outline btn-xs btn-error ml-2 cursor-pointer"
                    onClick={() => console.log(`Delete row ${row.id}`)}
                  >
                    Delete
                  </div> */}
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
