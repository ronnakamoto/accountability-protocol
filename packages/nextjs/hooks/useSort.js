import { useState, useEffect } from "react";

const useSort = (list, sortKey, isAscending = true) => {
    const [sortedList, setSortedList] = useState(list);

    // update sorted list whenever sort key or order changes
    useEffect(() => {
        const sorted = [...list].sort((a, b) => {
            const val1 = a[sortKey];
            const val2 = b[sortKey];
            if (val1 < val2) return isAscending ? -1 : 1;
            if (val1 > val2) return isAscending ? 1 : -1;
            return 0;
        });
        setSortedList(sorted);
    }, [list, sortKey, isAscending]);

    return sortedList;
};

export default useSort;
