const { checkDataSortingPoolModel } = require("../models/sortingPoolModel");
const { logInfo, logError } = require("../utils/logger");

const checkDataSortingPoolController = async (req, res) => {
    const { nopick } = req.body;

    try {
        // Validasi input
        if (!nopick) {
            logError("Error in checkDataSortingPoolController: Number pick is required");
            return res.status(400).json({
                success: false,
                message: "Number pick is required",
            });
        }

        // Memanggil model untuk mengambil data
        const response = await checkDataSortingPoolModel(nopick);

        // Memeriksa apakah respons kosong
        if (!response || response.length === 0) {
            logInfo(`Info in checkDataSortingPoolController: Data PB nomor pick ${nopick} tidak ada, belum selesai scan atau sudah selesai loading.`);
            return res.status(404).json({
                success: false,
                message: `Data PB nomor pick ${nopick} tidak ada, belum selesai scan, atau sudah selesai loading.`,
            });
        }

        // Jika data ditemukan
        logInfo(`Info in checkDataSortingPoolController: Data hasil pick dan scan nomor ${nopick} ditemukan`);
        return res.status(200).json({
            success: true,
            data: response,
        });
    } catch (error) {
        logError(`Error in checkDataSortingPoolController: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const checkDataByTglAndSPController = async (req, res) => {
    const { tglPic, noUrutSp } = req.body;

    try {
        // Validasi input
        if (!tglPic || !noUrutSp) {
            logError("Error in checkDataByTglAndSPController: tglPic and noUrutSp are required");
            return res.status(400).json({
                success: false,
                message: "Tanggal Pick and Nomor SP are required",
            });
        }

        // Memanggil model untuk mengambil data
        const { checkDataByTglAndSPModel } = require("../models/sortingPoolModel");
        const response = await checkDataByTglAndSPModel(tglPic, noUrutSp);

        // Memeriksa apakah respons kosong
        if (!response || response.length === 0) {
            logInfo(`Info in checkDataByTglAndSPController: Data PB tanggal pick ${tglPic} SP ${noUrutSp} tidak ada.`);
            return res.status(404).json({
                success: false,
                message: `Data PB tanggal pick ${tglPic} SP ${noUrutSp} tidak ada.`,
            });
        }

        // Jika data ditemukan
        logInfo(`Info in checkDataByTglAndSPController: Data ditemukan untuk tanggal pick ${tglPic} SP ${noUrutSp}`);
        return res.status(200).json({
            success: true,
            data: response,
        });
    } catch (error) {
        logError(`Error in checkDataByTglAndSPController: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    checkDataSortingPoolController,
    checkDataByTglAndSPController,
};
