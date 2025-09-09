import { masterProgramColumns } from './column'
import { DefaultTableModel } from '@/components/table/default-table-model'
import { programData } from '@/data/programData'
import React from 'react'

export default function MasterProgramTable() {
  return (
    <div>
      <DefaultTableModel columns={masterProgramColumns} data={programData} totalItems={programData.length}/>
    </div>
  )
}
