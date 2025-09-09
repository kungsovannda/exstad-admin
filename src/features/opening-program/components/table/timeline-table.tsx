// import { TimelineColumns } from '@/components/program/opening-program/timeline/timelineColumn'
// import { DefaultTableModel } from '@/components/table/default-table-model'
// import { programData } from '@/data/programData'
// import { useState } from 'react'
// import React from 'react'
// import { useMemo } from 'react'

// export default function TimelineTable() {

//     const [timelineData, setTimelineData] = useState(initialTimeline);
//     const handleDateChange = (rowId: number, field: 'startDate' | 'endDate', date: Date) => {
//     setTimelineData((prev) =>
//       prev.map((row) =>
//         row.id === rowId ? { ...row, [field]: date } : row
//       )
//     );
//   };

//   const filteredData = useMemo(() => timelineData, [timelineData]);

//   return (
//     <div>
//       <DefaultTableModel columns={TimelineColumns} data={filteredData} totalItems={programData.length}/>
//     </div>
//   )
// }
