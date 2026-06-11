import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { mainDb } from '@/lib/db/main';
import path from 'path';

export async function GET(): Promise<NextResponse> {
  try {
    const workbook = new ExcelJS.Workbook();
    const filePath = path.join(process.cwd(), 'tools.xlsx');
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      return NextResponse.json({ error: 'Worksheet not found' }, { status: 400 });
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any[][] = [];
    worksheet.eachRow({ includeEmpty: true }, (row) => {
      data.push(Array.isArray(row.values) ? row.values : []);
    });
    
    if (data.length < 2) {
      return NextResponse.json({ error: 'No data found in spreadsheet' }, { status: 400 });
    }
    
    const header = data[0];
    data.shift();
    
    let imported = 0;
    
    for (let i = 0; i < data.length - 2; i++) {
      const row = data[i];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const obj: Record<string, any> = {};
      for (let j = 0; j < header.length; j++) {
        obj[header[j]] = row[j];
      }
      
      // Escape quotes in description (matching original realdata.js logic)
      const description = obj['description'] || '';
      let descFinal = '';
      const count = [0];
      for (let j = 0; j < description.length; j++) {
        if (description.substring(j, j + 1) === '"') {
          count.push(j);
        }
      }
      for (let j = 0; j < count.length - 1; j++) {
        descFinal += description.substring(count[j], count[j + 1]) + '\\';
      }
      descFinal += description.substring(count[count.length - 1]);
      
      // Parse accepted field
      const accepted = obj['accepted'] === true || obj['accepted'] === 'true' || obj['accepted'] === 1 || obj['accepted'] === '1';
      
      const id = i + 1;
      
      // Check if entry already exists (upsert)
      const existing = await mainDb.submission.findUnique({ where: { id } });
      
      if (!existing) {
        await mainDb.submission.create({
          data: {
            id,
            techname: obj['techname'] || '',
            tl1_desc: descFinal,
            tl2_desc: descFinal,
            tl3_desc: descFinal,
            tl4_desc: descFinal,
            link: obj['link'] || '',
            displaytext: obj['displaytext'] || 'default',
            accepted,
            username: 'imported',
            contact: '',
          }
        });
        
        const domainFields = ['R','TP','MT','AR','U','MDL','RA','RoTech','LS','RoThink','EoST','EF','RTE','DLoI','RaAoC'];
        const domainData = {
          R: false, TP: false, MT: false, AR: false, U: false, MDL: false, RA: false,
          RoTech: false, LS: false, RoThink: false, EoST: false, EF: false, RTE: false,
          DLoI: false, RaAoC: false,
        };
        for (const field of domainFields) {
          (domainData as Record<string, boolean>)[field] = obj[field] === true || obj[field] === 'true' || obj[field] === 1 || obj[field] === '1';
        }
        
        await mainDb.domains.create({
          data: { id, ...domainData }
        });
        
        imported++;
      }
    }
    
    return NextResponse.json({ success: true, message: `Imported ${imported} tools from Excel`, imported });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'Import failed', details: String(error) }, { status: 500 });
  }
}