const { checkDataSortingPoolModel } = require('../models/sortingPoolModel');
const { logInfo, logError } = require('../utils/logger');

const checkDataSortingPoolController = async (req, res) => {
    const { nopick } = req.body;

    try {
        // Validasi input
        if (!nopick) {
            logError('Error in checkDataSortingPoolController: Number pick is required');
            return res.status(400).json({
                success: false,
                message: 'Number pick is required'
            });
        }

        // Memanggil model untuk mengambil data
        const response = await checkDataSortingPoolModel(nopick);

        // Memeriksa apakah respons kosong
        if (!response || response.length === 0) {
            logInfo(`Info in checkDataSortingPoolController: Data hasil pick dan scan nomor ${nopick} tidak ditemukan`);
            return res.status(404).json({
                success: false,
                message: `Data hasil pick dan scan nomor ${nopick} tidak ditemukan`
            });
        }

        // Jika data ditemukan
        logInfo(`Info in checkDataSortingPoolController: Data hasil pick dan scan nomor ${nopick} ditemukan`);
        return res.status(200).json({
            success: true,
            data: response
        });

    } catch (error) {
        logError(`Error in checkDataSortingPoolController: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    checkDataSortingPoolController
};
