const { getPool, sql } = require('../config/db');
const { logInfo, logError } = require('../utils/logger');

const checkDataPickingModel = async (date, nopick, pluid) => {
    try {
        const pool = await getPool();
        
        // Query untuk mengambil Urut dari dpd_TokoDPD
        const queryStore = `
            SELECT Urut 
            FROM dpd_TokoDPD 
            WHERE CONVERT(DATE, TglPic) = @date AND NoToko = @nopick
        `;
        const requestStore = pool.request();
        requestStore.input('date', sql.Date, date); 
        requestStore.input('nopick', sql.VarChar, nopick);

        const resultStore = await requestStore.query(queryStore);

        // Memastikan bahwa hasil query tidak kosong
        if (resultStore.recordset.length === 0) {
            logInfo('Info in checkDataPickingModel: Tidak ada data yang ditemukan untuk query store.');
            return []; // Mengembalikan array kosong jika tidak ada data
        }

        // Mengambil Urut dari hasil query
        const urut = resultStore.recordset[0].Urut;

        // Query untuk memeriksa apakah tabel tersedia
        const queryCheckTable = `
            SELECT * 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_NAME = 'Split_Picking_${urut}' 
        `;
        
        const requestCheckTable = pool.request();
        const resultCheckTable = await requestCheckTable.query(queryCheckTable);

        // Memastikan bahwa tabel ada
        if (resultCheckTable.recordset.length === 0) {
            logInfo(`Info in checkDataPickingModel: Tabel Split_Picking_${urut} tidak ditemukan.`);
            return []; // Mengembalikan array kosong jika tabel tidak ada
        }

        // Query untuk mengambil data item dari tabel yang dinamis
        const queryItem = `
            SELECT NOTOKO, Line, PRDCD, PN_IP_DPD, PN_ID_DPD
            FROM Split_Picking_${urut} 
            WHERE NOTOKO = @nopick AND PRDCD = @pluid
        `;
        const requestItem = pool.request();
        requestItem.input('nopick', sql.VarChar, nopick);
        requestItem.input('pluid', sql.VarChar, pluid);

        const resultItem = await requestItem.query(queryItem);
        return resultItem.recordset; // Mengembalikan hasil item
    } catch (err) {
        logError('Error in checkDataPickingModel: Error saat mengambil data picking:', err);
        throw err; // Melempar kembali error untuk penanganan lebih lanjut
    }
};

const updateDataPickingModel = async (seqno, pluid, zona, station, ip, id) => {
    try {
        const line = zona + station;
        const pool = await getPool();
        // Memeriksa apakah tabel tersedia sebelum melakukan update
        const queryCheckTable = `
            SELECT * 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_NAME = 'Split_Picking_${seqno}'
        `;
        
        const requestCheckTable = pool.request();
        const resultCheckTable = await requestCheckTable.query(queryCheckTable);
        // Memastikan bahwa tabel ada
        if (resultCheckTable.recordset.length === 0) {
            logError(`Error in updateDataPickingModel: Tabel Split_Picking_${seqno} tidak ditemukan.`);
            throw new Error(`Tabel Split_Picking_${seqno} tidak ditemukan.`);
        }
        // Query untuk memperbarui data
        const query = `
            UPDATE Split_Picking_${seqno} 
            SET Line = @line, PN_IP_DPD = @ip, PN_ID_DPD = @id 
            WHERE PRDCD = @pluid
        `;
        const request = pool.request();
        request.input('pluid', sql.VarChar, pluid);
        request.input('line', sql.VarChar, line);
        request.input('ip', sql.VarChar, ip);
        request.input('id', sql.VarChar, id);
        const result = await request.query(query);
        
        // Memeriksa jumlah baris yang terpengaruh
        if (result.rowsAffected[0] === 0) {
            logError(`Error in updateDataPickingModel: Tidak ada data yang diperbarui untuk PRDCD: ${pluid}`);
            throw new Error(`Tidak ada data yang diperbarui untuk PRDCD: ${pluid}`);
        }
        return { success: true, message: `Data Picking PRDCD: ${pluid} berhasil diperbarui` };
    } catch (err) {
        logError('Error in updateDataPickingModel: Error saat memperbarui data picking:', err);
        throw err;
    }
};

module.exports = {
    checkDataPickingModel,
    updateDataPickingModel
};
