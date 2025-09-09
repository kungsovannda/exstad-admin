import { openingProgramColumns } from './openingColumn'
import { DefaultTableModel } from '@/components/table/default-table-model'
import { openingProgramData } from '@/data/openingProgramData'
import { programData } from '@/data/programData'
import React from 'react'

// Flatten all openingprograms from all programs
const allOpeningPrograms = programData.flatMap(program => program.openingprogram || []);


export default function OpeningProgramTable() {
  return (
    <div>
      <DefaultTableModel columns={openingProgramColumns} data={allOpeningPrograms} totalItems={programData.length}/>
    </div>
  )
}



