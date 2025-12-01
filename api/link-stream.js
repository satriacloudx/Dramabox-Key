import axios from "axios";

export default async function handler(req, res) {
    try {
        // Get token
        const tokenResponse = await axios.get("https://dramabox-token.vercel.app/token");
        const gettoken = tokenResponse.data;

        const url = "https://sapi.dramaboxdb.com/drama-box/chapterv2/batch/load";
        const headers = {
            "User-Agent": "okhttp/4.10.0",
            "Accept-Encoding": "gzip",
            "Content-Type": "application/json",
            "tn": `Bearer ${gettoken.token}`,
            "version": "430",
            "vn": "4.3.0",
            "cid": "DRA1000000",
            "package-name": "com.storymatrix.drama",
            "apn": "1",
            "device-id": gettoken.deviceid,
            "language": "in",
            "current-language": "in",
            "p": "43",
            "time-zone": "+0800",
            "content-type": "application/json; charset=UTF-8"
        };

        const { bookId, index = 1 } = req.query;

        if (!bookId) {
            return res.status(400).json({
                success: false,
                error: "bookId is required"
            });
        }

        const data = {
            boundaryIndex: 0,
            comingPlaySectionId: -1,
            index: parseInt(index),
            currencyPlaySource: "discover_new_rec_new",
            needEndRecommend: 0,
            currencyPlaySourceName: "",
            preLoad: false,
            rid: "",
            pullCid: "",
            loadDirection: 0,
            startUpKey: "",
            bookId: bookId
        };

        const response = await axios.post(url, data, { headers });
        res.status(200).json({
            success: true,
            data: response.data.data.chapterList[0].cdnList[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}