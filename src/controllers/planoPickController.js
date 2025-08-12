const { checkDataPickingModel, updateDataPickingModel } = require('../models/planoPickModel'); // Memperbaiki nama model
const { logInfo, logError } = require('../utils/logger');

const checkDataPickingController = async (req, res) => {
    const { date, nopick, pluid } = req.body;

    try {
        // Validasi input
        if (!date || !nopick || !pluid) {
            logError('Error in checkDataPickingController: Date, Nopick, and PLUID are required');
            return res.status(400).json({
                success: false,
                message: 'Date, Nopick, and PLUID are required'
            });
        }

        // Memanggil model untuk mengambil data
        const response = await checkDataPickingModel(date, nopick, pluid);

        // Memeriksa apakah respons kosong
        if (!response || response.length === 0) {
            logInfo(`Info in checkDataPickingController: Data picking date ${date} nopick ${nopick} not found`);
            return res.status(404).json({
                success: false,
                message: `No data picking for date ${date} and nopick ${nopick} found`
            });
        }

        // Jika data ditemukan
        logInfo(`Info in checkDataPickingController: Data picking date ${date} nopick ${nopick} and nopick ${pluid} found`);
        return res.status(200).json({
            success: true,
            data: response
        });

    } catch (error) {
        logError(`Error in checkDataPickingController: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateDataPickingController = async (req, res) => {
    const seqno = req.param("seqNO");
    const { pluid, zona, station, ip, id } = req.body;
    try {
        if (!seqno || !pluid || !zona || !station || !ip || !id) {
            logError('Error in updateDataPickingController: PLUID, zona, station, IP, and ID are required');
            return res.status(400).json({
                success: false,
                message: 'Seqno, PLUID, zona, station, IP, and ID are required'
            });
        }

        const response = await updateDataPickingModel(seqno, pluid, zona, station, ip, id);

        logInfo(`Info in updateDataPickingController: Data picking nomor ${seqno} pluid ${pluid} updated successfully`);
        return res.status(200).json(response);
    } catch (error) {
        logError(`Error in updateDataPickingController: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { 
    checkDataPickingController,
    updateDataPickingController
};
