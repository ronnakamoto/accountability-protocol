import { useState, useEffect } from "react";

const useTableSearch = (data, columns, search) => {
    const [filteredData, setFilteredData] = useState(data);

    useEffect(() => {
        let filteredItems = data;
        columns.forEach((column) => {
            if (column.isSearchable && search[column.key]) {
                filteredItems = filteredItems.filter((item) =>
                    item[column.key]
                        .toString()
                        .toLowerCase()
                        .includes(search[column.key].toLowerCase())
                );
            }
        });
        setFilteredData(filteredItems);
    }, [data, columns, search]);

    return filteredData;
};

export default useTableSearch;
