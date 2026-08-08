const { getPool, sql } = require("../config/db");
const { logInfo, logError } = require("../utils/logger");

const checkDataSortingPoolModel = async (nopick) => {
    try {
        const pool = await getPool();

        // Query untuk mengambil Urut dari dpd_TokoDPD
        const queryStore = `
            SELECT a.NoToko, a.NO_URUTSP, a.TglPic, a.Toko, a.Gate, b.TOK_NAME
            FROM dpd_TokoDPD a
            INNER JOIN dc_toko_t b ON a.Toko = b.TOK_CODE
            WHERE a.NoToko = @nopick AND a.FBackup = 1 AND a.Fgo IS NULL
        `;
        const requestStore = pool.request();
        requestStore.input("nopick", sql.VarChar, nopick);

        const resultStore = await requestStore.query(queryStore);

        // Memastikan bahwa hasil query tidak kosong
        if (resultStore.recordset.length === 0) {
            logInfo(`Info in checkDataSortingPoolModel: Data hasil pick dan scan nomor ${nopick} tidak ada, belum backup atau sudah selesai loading.`);
            return []; // Mengembalikan array kosong jika tidak ada data
        }

        // Mengambil data dari hasil query header
        const headerData = resultStore.recordset[0];

        // Query untuk mengambil detail container dari Dpd_Container_Trans
        const queryDetails = `
            SELECT Zona, Nomor, DusNo, FPakai
            FROM Dpd_Container_Trans
            WHERE NoToko = @nopick AND FPakai = 1
        `;
        const requestDetails = pool.request();
        requestDetails.input("nopick", sql.VarChar, nopick);
        const resultDetails = await requestDetails.query(queryDetails);

        return {
            header: headerData,
            details: resultDetails.recordset,
        };
    } catch (err) {
        logError("Error in checkDataSortingPoolModel: Error saat mengambil data hasil picking dan scanning:", err);
        throw err; // Melempar kembali error untuk penanganan lebih lanjut
    }
};

module.exports = {
    checkDataSortingPoolModel,
};
