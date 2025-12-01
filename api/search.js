import axios from 'axios';

export default async function handler(req, res) {
    try {
        // Get token
        const tokenResponse = await axios.get("https://dramabox-key.vercel.app/token");
        const gettoken = tokenResponse.data;

        const url = "https://sapi.dramaboxdb.com/drama-box/search/suggest";
        const headers = {
            "User-Agent": "okhttp/4.10.0",
            "Accept-Encoding": "gzip",
            "Content-Type": "application/json",
            "tn": `Bearer ${gettoken.token}`,
            "version": "430",
            "vn": "4.3.0",
            "cid": "DRA1000042",
            "package-name": "com.storymatrix.drama",
            "apn": "1",
            "device-id": gettoken.deviceid,
            "language": "in",
            "current-language": "in",
            "p": "43",
            "time-zone": "+0800",
            "content-type": "application/json; charset=UTF-8"
        };

        const { keyword } = req.query;

        if (!keyword) {
            return res.status(400).json({
                success: false,
                error: "keyword is required"
            });
        }

        const data = {
            keyword: keyword
        };

        const response = await axios.post(url, data, { headers });
        res.status(200).json({
            success: true,
            data: response.data.data.suggestList
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }

}
