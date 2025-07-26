require("./settings.js")
const express = require("express");
const cors = require("cors");
const path = require("path");
const crypto = require("crypto")
const bodyParser = require('body-parser');
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3100;
const axios = require("axios")
const { getBuffer, fetchJson, tanggal, capital } = require('./function/function.js')  
const { groq } = require("./function/openai.js")
const { stalk } = require("node-tiklydown")
const { setTimeout: sleep } = require('timers/promises');
const fetch = require("node-fetch")
const { PlayStore } = require('./function/playstore.js') 
const { aioRetatube } = require("./function/alldl.js")
const { snackvideo } = require("./function/snackvideo.js")
const { mediaFire } = require("./function/mediafire.js")
const { terabox } = require("./function/terabox.js")
const { pxpic } = require("./function/removebg.js")
const { fdroid } = require('./function/fdroid.js') 
const { Buddy } = require('./function/buddy.js')
const { SimSimi } = require('./function/simsimi.js')
const { blackbox } = require('./function/blackbox.js')
const { xnxxdl, xnxxsearch } = require('./function/xnxxdl.js')
const { ttSearch } = require('./function/tiktoksearch.js') 
const { souncloudDl } = require('./function/soundcloud.js') 
const { lirikLagu } = require('./function/liriklagu.js') 
const { ephoto } = require('./function/pornhub.js') 
const { ytdlv2, ytmp3, ytmp4 } = require('@vreden/youtube_scraper') 
const { youtube, twitter } = require("btch-downloader")
const { Ytdll } = require("./function/youtube.js")
const scp = require("caliph-api")
const { pinterest2, pinterest } = require('./function/pinterest.js') 
const { pindlVideo } = require('./function/pindl.js') 
const scp2 = require("imon-videos-downloader")
const { googleImage } = require('./function/gimage.js') 
const { githubstalk } = require('./function/githubstalk.js') 
const { youtubeStalk } = require('./function/ytstalk.js') 
const { fbdl } = require('./function/facebook.js') 
const { shortUrl, shortUrl2 } = require('./function/tinyurl.js') 
const { remini } = require('./function/remini.js')
const { igdl } = require('./function/instagram.js') 
const { chatbot } = require('./function/gpt.js')
const { DeepSeek } = require('./function/deepseek.js')
const { uploaderImg } = require('./function/uploadImage.js');
const { tiktokdl } = require('./function/tiktok.js') 
const {
  convertCRC16,
  generateTransactionId,
  generateExpirationTime,
  elxyzFile,
  generateQRIS,
  createQRIS,
  checkQRISStatus
} = require('./function/orkut.js')


app.enable("trust proxy");
app.set("json spaces", 2);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "function")));
app.use(bodyParser.raw({ limit: '50mb', type: '*/*' }))


app.get('/api/orkut/createpayment', async (req, res) => {
    const { apikey, amount } = req.query;
    if (!apikey) {
    return res.json("Isi Parameter Apikey.");
    }
    const check = global.apikey
    if (!check.includes(apikey)) return res.json("Apikey Tidak Valid!.")
    if (!amount) {
    return res.json("Isi Parameter Amount.")
    }
    const { codeqr } = req.query;
    if (!codeqr) {
    return res.json("Isi Parameter CodeQr menggunakan qris code kalian.");
    }
    try {
        const paymentData = await createQRIS(amount, codeqr); // Renamed for clarity
        // Respond with the structure from contoh.json
        res.status(200).json({
            statusCode: 200,
            creator: "Act - DigitalShop", // Using creator from contoh.json
            data: paymentData, // paymentData already matches the 'data' structure
            message: "QRIS generated successfully"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})



app.get('/api/orkut/cekstatus', async (req, res) => {
    const { merchant, keyorkut } = req.query;
    if (!merchant) {
        return res.status(400).json({ // Use 400 for bad request
            statusCode: 400,
            creator: "Act - DigitalShop",
            data: null,
            message: "Isi Parameter Merchant."
        });
    }
    if (!keyorkut) {
        return res.status(400).json({ // Use 400 for bad request
            statusCode: 400,
            creator: "Act - DigitalShop",
            data: null,
            message: "Isi Parameter Keyorkut."
        });
    }
    try {
        const statusData = await checkQRISStatus(merchant, keyorkut); // Renamed for clarity

        let message = "Status checked successfully";
        // Check if it's the 'No Transaction' case
        if (statusData.brand_name === "No Transaction") {
            message = "No transactions found.";
        }

        // Respond with the structure like contoh.json
        res.status(200).json({
            statusCode: 200,
            creator: "Act - DigitalShop", // Using creator from contoh.json
            data: statusData, // statusData contains the transaction details
            message: message
        });
    } catch (error) {
        console.error("Error checking status:", error); // Log the actual error
        res.status(500).json({
            statusCode: 500,
            creator: "Act - DigitalShop",
            data: null,
            message: error.message || "Internal Server Error"
        });
    }
})


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'landing.html'));
});

app.get('/docs', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.get("/api/ai/openai-prompt", async (req, res) => {
    const { prompt, msg } = req.query;
    if (!prompt || !msg) return res.json("Isi Parameternya!");

    try {
        var anu = await groq(`${msg}`, `${prompt}`)
        if (!anu.status) {
        res.json ({
        status: false,
        creator: global.creator,
        result: anu.respon
        })
        }

        res.json({
            status: true,
            creator: global.creator,
            result: anu.respon     
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/ai/openai", async (req, res) => {
    const { msg } = req.query;
    if (!msg) return res.json("Isi Parameternya!");

    try {
        var anu = await groq(`${msg}`)
        if (!anu.status) {
        res.json ({
        status: false,
        creator: global.creator,
        result: anu.respon
        })
        }

        res.json({
            status: true,
            creator: global.creator,
            result: anu.respon     
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/ai/blackbox", async (req, res) => {
    const { msg } = req.query;
    if (!msg) return res.json("Isi Parameternya!");

    try {
        var anu = await blackbox(`${msg}`)
        if (!anu.status) {
        res.json ({
        status: false,
        creator: global.creator
        })
        }

        res.json({
            status: true,
            creator: global.creator,
            result: anu
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/ai/simsimi", async (req, res) => {
    const { msg } = req.query;
    if (!msg) return res.json("Isi Parameternya!");

    try {
        var anu = await SimSimi(`${msg}`)
        if (!anu) {
        res.json ({
        status: false,
        creator: global.creator
        })
        }

        res.json({
            status: true,
            creator: global.creator,
            result: anu
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/ai/deepseek", async (req, res) => {
    const { msg } = req.query;
    if (!msg) return res.json("Isi Parameternya!");

    try {
        var anu = await DeepSeek(`${msg}`, false)
        if (!anu) {
        res.json ({
        status: false,
        creator: global.creator
        })
        }

        res.json({
            status: true,
            creator: global.creator,
            result: anu
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/ai/gpt4", async (req, res) => {
    const { text } = req.query;
    if (!text) return res.json("Isi Parameternya!");

    try {
        var anu = await chatbot.send(`${text}`)
        if (!anu?.choices[0]?.message?.content) {
        res.json ({
        status: false,
        creator: global.creator,
        result: null
        })
        }

        res.json({
            status: true,
            creator: global.creator,
            result: anu.choices[0].message.content
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/ai/gpt-3-5-turbo", async (req, res) => {
    const { text } = req.query;
    if (!text) return res.json("Isi Parameternya!");

    try {
        var anu = await chatbot.send(`${text}`, "gpt-3.5-turbo")
        if (!anu?.choices[0]?.message?.content) {
        res.json ({
        status: false,
        creator: global.creator,
        result: null
        })
        }

        res.json({
            status: true,
            creator: global.creator,
            result: anu.choices[0].message.content
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})


app.get("/api/ai/gemini", async (req, res) => {
    const { text } = req.query;
    if (!text) return res.json("Isi Parameternya!");

try {
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyCPlGoKHoePXhHIaI7TLUESYgExSiB5XbI");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = text

const result = await model.generateContent(prompt);
const anu = await result.response.text()
       
        if (!anu) {
        res.json ({
        status: false,
        creator: global.creator,
        result: null
        })
        }

        res.json({
            status: true,
            creator: global.creator,
            result: anu
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})


app.get("/api/download/fbdl", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await fbdl(`${url}`)
        res.json({
        status: true, 
        creator: global.creator, 
        result: anu
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/download/terabox", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await terabox(`${url}`)
        res.json({
        status: true, 
        creator: global.creator, 
        result: anu
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/download/snackvideo", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await snackvideo(`${url}`)
        res.json({
        status: true, 
        creator: global.creator, 
        result: anu
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/download/xnxxdl", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await xnxxdl(`${url}`)
        res.json({
        status: true, 
        creator: global.creator, 
        result: anu.result
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/download/igdl", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await igdl(`${url}`)
        res.json({
        status: true, 
        creator: global.creator, 
        result: anu
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/download/tiktokdl", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await tiktokdl.fetchData(`${url}`)

        res.json({
            status: true,
            creator: global.creator,
            result: anu     
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/download/ytdlv2", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await Ytdll(`${url}`, "mp3")

        res.json({
            status: true,
            creator: global.creator,
            result: anu
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
});

app.get("/api/download/ytmp3", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await ytdlv2(`${url}`)

        res.json({
            status: true,
            creator: global.creator,
            metadata: anu.details, 
            download: anu.downloads
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
});

app.get("/api/download/ytmp4", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await ytdlv2(`${url}`)

        res.json({
            status: true,
            creator: global.creator,
            metadata: anu.details, 
            download: anu.downloads
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
});

app.get("/api/download/twitter", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await twitter(`${url}`)

        res.json({
            status: true,
            creator: global.creator,
            result: anu
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
});

app.get("/api/download/doodstream", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await Buddy(`${url}`)

        res.json({
            status: true,
            creator: global.creator,
            result: anu.response
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
});

app.get("/api/download/soundcloud", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await souncloudDl.process(`${url}`)
        res.json({
            status: true,
            creator: global.creator,
            result: anu       
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/download/aiodl", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await aioRetatube(`${url}`)
        res.json({
            status: true,
            creator: global.creator,
            result: anu       
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/download/gdrive", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await scp2.GDLink(`${url}`)
        res.json({
            status: true,
            creator: global.creator,
            result: anu.data
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
});

app.get("/api/download/mediafire", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await mediaFire(`${url}`)
        res.json({
            status: true,
            creator: global.creator,
            result: anu
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
});


app.get("/api/download/pindlvid", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await pindlVideo(`${url}`)
        res.json({
            status: true,
            creator: global.creator,
            result: anu.data
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/download/capcut", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await scp2.capcut(`${url}`)
        res.json({
            status: true,
            creator: global.creator,
            result: anu.data
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
});

app.get("/api/download/spotify", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await fetch('https://spotifydown.app/api/download?link='+url, {headers:{Referer:'https://spotifydown.app/'}})
		const links = await anu.json();
        res.json({
            status: true,
            creator: global.creator,
            result: links.data.link
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
});


app.get("/api/download/playspotify", async (req, res) => {
    const { q } = req.query;
    if (!q) return res.json("Isi Parameternya!");
    try {
        const Spotify = {
	async search(que){
		const r = await fetch('https://spotifydown.app/api/metadata?link='+que, {method: 'POST'})
		return r.json();
	},
	async details(que){
		const r = await fetch('https://spotifydown.app/api/metadata?link='+que, {method: 'POST'})
		return r.json();
	},
	async download(que){
		const r = await fetch('https://spotifydown.app/api/download?link='+que, {headers:{Referer:'https://spotifydown.app/'}})
		return r.json();
	}
}
async function start() {
	const cari = await Spotify.search(q)
	const detail = await Spotify.details(cari.data.tracks[0].link)
	const download = await Spotify.download(detail.data.link)
	return {
	metadata: detail.data, 
	download: download.data
	}
}
const links = await start()
        res.json({
            status: true,
            creator: global.creator,
            result: links
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/imagecreator/remini", async (req, res) => {
    try {     
      const { url } = req.query
      if (!url) return res.json("Isi Parameternya!");
      const image = await getBuffer(url)
      if (!image) res.json("Error!");
      const result = await remini(image, "enhance")
      await res.set("Content-Type", "image/png")
      await res.send(result)
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/imagecreator/removebg", async (req, res) => {
    try {     
      const { url } = req.query
      if (!url) return res.json("Isi Parameternya!");
      const image = await getBuffer(url)
      if (!image) res.json("Error!");
      const result = await pxpic.create(image, "removebg")
      res.json({
            status: true,
            creator: global.creator,
            result: result.resultImageUrl
        });
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/imagecreator/upscale", async (req, res) => {
    try {     
      const { url } = req.query
      if (!url) return res.json("Isi Parameternya!");
      const image = await getBuffer(url)
      if (!image) res.json("Error!");
      const result = await pxpic.create(image, "upscale")
      res.json({
            status: true,
            creator: global.creator,
            result: result.resultImageUrl
        });
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/imagecreator/bratgenerator", async (req, res) => {
    try {     
      const { text } = req.query
      if (!text) return res.json("Isi Parameternya!");
      const image = await getBuffer(`https://brat.caliphdev.com/api/brat?text=${text}`)
      if (!image) res.json("Error!")
      await res.set("Content-Type", "image/png")
      await res.send(image)
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/imagecreator/emojitogif", async (req, res) => {
    try {     
      const { emoji } = req.query
      if (!emoji) return res.json("Isi Parameternya!");
      
function encodeEmoji(emoji) {
return [...emoji].map(char => char.codePointAt(0).toString(16)).join('');
}

const unik = await encodeEmoji(emoji)
      const image = await getBuffer(`https://fonts.gstatic.com/s/e/notoemoji/latest/${unik}/512.webp`)
      if (!image) res.json("Error!")
      await res.set("Content-Type", "image/webp")
      await res.send(image)
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/tools/tinyurl", async (req, res) => {
    try {     
      const { url } = req.query
      if (!url) return res.json("Isi Parameternya!");
      if (!url.startsWith("https://")) return res.json("Link tautan tidak valid!")
      const result = await shortUrl(url)
      if (!result) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      link: result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/tools/whois", async (req, res) => {
    try {     
      const { domain } = req.query
      if (!domain) return res.json("Isi Parameternya!");
     const whoiser = require('whoiser')
      const result = await whoiser(domain)
      if (!result) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      result: result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/tools/isgd", async (req, res) => {
    try {     
      const { url } = req.query
      if (!url) return res.json("Isi Parameternya!");
      if (!url.startsWith("https://")) return res.json("Link tautan tidak valid!")
      const result = await shortUrl2(url)
      if (!result) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      link: result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/tools/ocr", async (req, res) => {
    try {     
      const { url } = req.query
  if (!url) return res.json("Isi Parameternya!");
  if (!url.startsWith("https://")) return res.json("Link tautan tidak valid!")
const { ocrSpace } = require('ocr-space-api-wrapper');
const anuin = await ocrSpace(url)
      const result = anuin.ParsedResults[0].ParsedText
      if (!result) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      result: result.toString()
      })
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})

app.get("/api/tools/igstalk", async (req, res) => {
const { username } = req.query
if (!username) return res.json("Isi Parameternya!")
const ig = require("./function/igstalk.js")
const anu = await ig.stalk(username)
if (anu.metadata) {
res.json({
      status: true, 
      creator: global.creator, 
      result: anu.metadata
})
} else {
res.json({
      status: false, 
      creator: global.creator, 
      result: {}
})
}
})

app.get("/api/tools/npmstalk", async (req, res) => {
const { pkgname } = req.query
if (!pkgname) return res.json("Isi Parameternya!")

async function npmstalk(packageName) {
  let stalk = await axios.get("https://registry.npmjs.org/"+packageName)
  let versions = stalk.data.versions
  let allver = Object.keys(versions)
  let verLatest = allver[allver.length-1]
  let verPublish = allver[0]
  let packageLatest = versions[verLatest]
  return {
    name: packageName,
    versionLatest: verLatest,
    versionPublish: verPublish,
    versionUpdate: allver.length,
    latestDependencies: Object.keys(packageLatest.dependencies).length,
    publishDependencies: Object.keys(versions[verPublish].dependencies).length,
    publishTime: stalk.data.time.created,
    latestPublishTime: stalk.data.time[verLatest]
  }
}

const anu = await npmstalk(pkgname)
if (anu) {
res.json({
      status: true, 
      creator: global.creator, 
      result: anu
})
} else {
res.json({
      status: false, 
      creator: global.creator, 
      result: {}
})
}
})

app.get("/api/tools/tiktokstalk", async (req, res) => {
    try {     
      const { user } = req.query
      if (!user) return res.json("Isi Parameternya!");
      const result = await stalk(user).then(res => res.data)
      if (!result) return res.json("Error!");
      let value = {
      nama: result.user.nickname, 
      user: result.user.uniqueId, 
      bio: result.user.signature, 
      privatemode: result.user.privateAccount,
      profile: result.user.avatarMedium, 
      followers: result.stats.followerCount, 
      following: result.stats.followingCount
      }
      res.json({
      status: true, 
      creator: global.creator, 
      result: value
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/tools/githubstalk", async (req, res) => {
    try {     
      const { user } = req.query
      if (!user) return res.json("Isi Parameternya!");
      const result = await githubstalk(user).then(res => res)
      if (!result) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      result: result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/tools/youtubestalk", async (req, res) => {
    try {     
      const { user } = req.query
      if (!user) return res.json("Isi Parameternya!");
      const result = await youtubeStalk(user)
      if (!result) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      result: result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.post("/api/tools/upload", async (req, res) => {
    try {     
      const image = req.body
      if (!image) return res.send("POST METHOD!")
      const result = await uploaderImg(image)
      if (!result.status) return res.send("Image Tidak Ditemukan!")
      return res.json(result)
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/pterodactyl/listpanel", async (req, res) => {
    try {     
let { eggid, nestid, loc, domain, ptla, ptlc } = req.query
if (!eggid || !nestid || !loc || !domain || !ptla || !ptlc) return res.json("Isi Parameternya!")
domain = "https://" + domain
let egg = eggid
let listnya = []
let f = await fetch(domain + "/api/application/servers?page=1", {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + ptla
}
})
let res2 = await f.json();
let servers = res2.data;
if (servers.length < 1) return res.json("Tidak ada server panel!");
for (let server of servers) {
let s = server.attributes
let f3 = await fetch(domain + "/api/client/servers/" + s.uuid.split`-`[0] + "/resources", {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + ptlc
}
})
let data = await f3.json();
let status = data.attributes ? data.attributes.current_state : s.status;
await listnya.push({
id_server: s.id, 
name: s.name, 
ram: `${s.limits.memory}`, 
cpu: `${s.limits.cpu}`, 
disk: `${s.limits.disk}`, 
created_at: `${s.created_at.split("T")[0]}`
})
}
res.json({
status: true, 
creator: global.creator,
totalserver: listnya.length.toString(),
result: listnya
})
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/search/pinterest", async (req, res) => {
    try {     
      const { q } = req.query
      if (!q) return res.json("Isi Parameternya!");
      const result = await pinterest2(q)
      if (!result) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      result: result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/search/xnxx", async (req, res) => {
    try {     
      const { q } = req.query
      if (!q) return res.json("Isi Parameternya!");
      const result = await xnxxsearch(q)
      if (!result) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      result: result.result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/search/npm", async (req, res) => {
    try {     
      const { q } = req.query
      if (!q) return res.json("Isi Parameternya!");
      let anuan = await fetch(`http://registry.npmjs.com/-/v1/search?text=${q}`)
	let { objects } = await anuan.json()
	let result = await objects.map(({ package: pkg }) => {
		return `*${pkg.name}* (v${pkg.version})\n_${pkg.links.npm}_\n_${pkg.description}_`
	})
      if (!result.length) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      result: result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})


app.get("/api/search/sfile", async (req, res) => {
    try {     
      const { q } = req.query
      if (!q) return res.json("Isi Parameternya!");
      let result = await scp.search.sfile(q)
      if (!result) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      result: result.result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/search/playstore", async (req, res) => {
    try {     
      const { q } = req.query
      if (!q) return res.json("Isi Parameternya!");
      let result = await PlayStore(q)
      if (!result) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      result: result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/search/fdroid", async (req, res) => {
    try {     
      const { q } = req.query
      if (!q) return res.json("Isi Parameternya!");
      let result = await fdroid.search(q)
      if (!result) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      result: result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/search/happymod", async (req, res) => {
    try {     
      const { q } = req.query
      if (!q) return res.json("Isi Parameternya!");
      let result = await scp.search.happymod(q)
      result = result.result.map((e) => {
      return { icon: e.thumb, name: e.title, link: e.link }
     })
      if (!result) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      result: result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/search/gimage", async (req, res) => {
    try {     
      const { q } = req.query
      if (!q) return res.json("Isi Parameternya!");
      const result = await googleImage(q)
      if (!result) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      result: result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})


app.get("/api/search/ytsearch", async (req, res) => {
    try {     
      const { q } = req.query
      if (!q) return res.json("Isi Parameternya!");
      const result = await ytsearch(q)
      if (!result) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      result: result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/search/tiktoksearch", async (req, res) => {
    try {     
      const { q } = req.query
      if (!q) return res.json("Isi Parameternya!");
      const result = await ttSearch(q)
      if (!result) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      result: result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/search/lyrics", async (req, res) => {
    try {     
      const { q } = req.query
      if (!q) return res.json("Isi Parameternya!");
      const result = await lirikLagu(q)
      if (!result) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      result: result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/imagecreator/pornhub", async (req, res) => {
    try {     
      const { text1, text2 } = req.query
      if (!text1 || !text2) return res.json("Isi Parameternya!");
      const image = await ephoto(text1, text2)
      if (!image) res.json("Error!")
      res.json({
      status: true, 
      creator: global.creator, 
      result: image
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})


app.get("/api/imagecreator/emojimix", async (req, res) => {
    try {     
      const { emoji1, emoji2 } = req.query
      if (!emoji1 || !emoji2) return res.json("Isi Parameternya!");
      let image = await fetch(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`).then(res => res.json()).then(res => res.results[0].url)
      if (!image) res.json("Error!")
      res.json({
      status: true, 
      creator: global.creator, 
      result: image
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/imagecreator/qc", async (req, res) => {
    try {     
      const { text, fotoUrl, nama } = req.query
      if (!text || !nama || !fotoUrl) return res.json("Isi Parameternya!");
const json = {
  "type": "quote",
  "format": "png",
  "backgroundColor": "#000000",
  "width": 812,
  "height": 968,
  "scale": 2,
  "messages": [
    {
      "entities": [],
      "avatar": true,
      "from": {
        "id": 1,
        "name": nama,
        "photo": {
          "url": fotoUrl
        }
      },
      "text": text,
      "replyMessage": {}
    }
  ]
};
        const response = axios.post('https://bot.lyo.su/quote/generate', json, {
        headers: {'Content-Type': 'application/json'}
}).then(async (res) => {
    const buffer = Buffer.from(res.data.result.image, 'base64')
  return buffer
})
      if (!response) res.json("Error!")
      await res.set("Content-Type", "image/png")
      await res.send(response)
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/pterodactyl/delete", async (req, res) => {
    let { domain, ptla, idserver } = req.query;
    if (!domain || !ptla || !idserver) return res.status(400).json({ message: "Isi semua parameter: domain, ptla, idserver!" });

    const originalDomain = domain;
    domain = domain.startsWith("http") ? domain : "https://" + domain;
    const serverIdNum = Number(idserver);

    if (isNaN(serverIdNum)) {
        return res.status(400).json({ message: "idserver harus berupa angka." });
    }

    let pteroAuthHeaders = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + ptla
    };

    let foundServerAttributes = null;

    try {
        // 1. List Servers to find the server by ID
        const listServersResponse = await fetch(`${domain}/api/application/servers?page=1`, {
            method: "GET",
            headers: pteroAuthHeaders
        });

        if (!listServersResponse.ok) {
            const errorText = await listServersResponse.text();
            console.error(`Pterodactyl API Error (listing servers ${listServersResponse.status}): ${errorText}`);
            return res.status(listServersResponse.status).json({ message: "Error listing servers from Pterodactyl panel.", details: errorText });
        }

        const listResult = await listServersResponse.json();
        let servers = listResult.data || [];

        for (let server of servers) {
            if (server.attributes && server.attributes.id === serverIdNum) {
                foundServerAttributes = server.attributes;
                break;
            }
        }

        if (!foundServerAttributes) {
            return res.status(404).json({ message: `Server dengan ID ${serverIdNum} tidak ditemukan.` });
        }

        // 2. Delete the found server
        const deleteServerResponse = await fetch(`${domain}/api/application/servers/${foundServerAttributes.id}`, {
            method: "DELETE",
            headers: pteroAuthHeaders
        });

        if (!deleteServerResponse.ok) {
            // Log error but proceed to user deletion as per original logic intent
            const errorText = await deleteServerResponse.text();
            console.warn(`Pterodactyl API Warning (deleting server ${foundServerAttributes.id} - ${deleteServerResponse.status}): ${errorText}`);
        }
        // Successful DELETE often returns 204 No Content, no body to parse.

        // 3. List Users to find a matching user (if server name was intended for this)
        // The original logic matched user.first_name.toLowerCase() with server.name.toLowerCase()
        const serverNameForUserMatch = foundServerAttributes.name ? foundServerAttributes.name.toLowerCase() : null;

        if (serverNameForUserMatch) { // Only proceed if server had a name to match
            const listUsersResponse = await fetch(`${domain}/api/application/users?page=1`, {
                method: "GET",
                headers: pteroAuthHeaders
            });

            if (!listUsersResponse.ok) {
                const errorText = await listUsersResponse.text();
                console.warn(`Pterodactyl API Warning (listing users ${listUsersResponse.status}): ${errorText}. Skipping user deletion.`);
            } else {
                const usersResult = await listUsersResponse.json();
                let users = usersResult.data || [];

                for (let user of users) {
                    if (user.attributes && typeof user.attributes.first_name === 'string' && 
                        user.attributes.first_name.toLowerCase() === serverNameForUserMatch) {
                        
                        const deleteUserResponse = await fetch(`${domain}/api/application/users/${user.attributes.id}`, {
                            method: "DELETE",
                            headers: pteroAuthHeaders
                        });
                        if (!deleteUserResponse.ok) {
                            const errorText = await deleteUserResponse.text();
                            console.warn(`Pterodactyl API Warning (deleting user ${user.attributes.id} - ${deleteUserResponse.status}): ${errorText}`);
                        }
                        // Found and attempted to delete the user, break if only one such user is expected
                        break; 
                    }
                }
            }
        }

        return res.json({
            status: true,
            creator: global.creator, // Assuming global.creator is defined
            result: `Sukses memulai proses penghapusan untuk server panel *${capital(foundServerAttributes.name || 'N/A')}*`
        });

    } catch (error) {
        console.error("Error in /api/pterodactyl/delete handler:", error);
        return res.status(500).json({ message: "Internal server error processing Pterodactyl delete request.", details: error.message });
    }
});

app.get("/api/pterodactyl/create", async (req, res) => {
  const crypto = require("crypto");
  const fetch = require("node-fetch");

  let {
    domain,
    ptla,
    ptlc,
    loc,
    eggid,
    nestid,
    ram,
    disk,
    cpu,
    username,
    version,
    node,
    password
  } = req.query;

  if (!domain || !ptla || !ptlc || !loc || !eggid || !nestid || !ram || !disk || !cpu || !username || !node) {
    return res.json({ status: false, error: "Isi semua parameter!" });
  }

  try {
    domain = domain.startsWith("http") ? domain : "https://" + domain;
    const apikey = ptla;
    const email = username.toLowerCase() + "@gmail.com";
    const name = capital(username) + " Server";
    const desc = tanggal(Date.now());

    let user = null;
    let usr_id = null;
    let finalPassword = password || (username + crypto.randomBytes(3).toString("hex"));

    // 🔍 Cek user by email
    const emailRes = await fetch(`${domain}/api/application/users?filter[email]=${encodeURIComponent(email)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apikey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const emailData = await emailRes.json();
    if (emailData.errors) return res.json({ status: false, error: emailData.errors[0].detail });

    if (emailData.data.length > 0) {
      user = emailData.data[0].attributes;
      usr_id = user.id;
      finalPassword = null; // ❌ jangan ubah password
    } else {
      // 🔍 Cek user by username
      const usernameRes = await fetch(`${domain}/api/application/users?filter[username]=${encodeURIComponent(username.toLowerCase())}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apikey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const usernameData = await usernameRes.json();
      if (usernameData.errors) return res.json({ status: false, error: usernameData.errors[0].detail });

      if (usernameData.data.length > 0) {
        user = usernameData.data[0].attributes;
        usr_id = user.id;
        finalPassword = null;
      } else {
        // ✅ Buat user baru
        const createUserRes = await fetch(`${domain}/api/application/users`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apikey}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            username: username.toLowerCase(),
            email,
            first_name: capital(username),
            last_name: "Server",
            language: "en",
            password: finalPassword,
          }),
        });

        const newUser = await createUserRes.json();
        if (newUser.errors) return res.json({ status: false, error: newUser.errors[0].detail });

        user = newUser.attributes;
        usr_id = user.id;
      }
    }

    // 📦 Ambil Egg dan Variables
    const eggRes = await fetch(`${domain}/api/application/nests/${nestid}/eggs/${eggid}?include=variables`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apikey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const eggData = await eggRes.json();
    const egg = eggData.attributes;
    if (!egg) return res.json({ status: false, error: "Egg tidak ditemukan atau tidak valid." });

    const startup_cmd = egg.startup || "./bedrock_server";
    const envVars = eggData?.attributes?.relationships?.variables?.data || [];

    // 🔧 Set environment
    const environment = {};
    for (const v of envVars) {
      const key = v.attributes.env_variable;
      const defaultVal = v.attributes.default_value;
      environment[key] = key === "BEDROCK_VERSION" ? (version || "1.21.0") : defaultVal || "";
    }

    // 📡 Ambil allocation dari node
    const allocRes = await fetch(`${domain}/api/application/nodes/${node}/allocations`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apikey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const allocData = await allocRes.json();
    const available = allocData.data.find(a => a.attributes.assigned === false);
    if (!available) return res.json({ status: false, error: "Tidak ada allocation yang tersedia di node ini." });

    const allocation_id = available.attributes.id;

    // 🚀 Buat server
    const serverRes = await fetch(`${domain}/api/application/servers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apikey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        description: desc,
        user: usr_id,
        egg: parseInt(eggid),
        docker_image: egg.docker_image,
        startup: startup_cmd,
        environment,
        limits: {
          memory: parseInt(ram),
          swap: 0,
          disk: parseInt(disk),
          io: 500,
          cpu: parseInt(cpu),
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 5,
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: [],
        },
        allocation: {
          default: allocation_id,
        },
        start_on_completion: true,
      }),
    });

    const serverData = await serverRes.json();
    if (serverData.errors) return res.json({ status: false, error: serverData.errors[0].detail });

    return res.json({
      status: true,
      creator: global.creator || "System",
      result: {
        id_user: usr_id,
        id_server: serverData.attributes.id,
        username: user.username,
        password: finalPassword || "Tersimpan saat registrasi",
        ram,
        disk,
        cpu,
        domain,
        version: environment["BEDROCK_VERSION"],
        created_at: tanggal(Date.now()),
      },
    });

  } catch (error) {
    console.error("❌ Server creation error:", error);
    return res.json({ status: false, error: error.message || "Terjadi kesalahan internal." });
  }
});


app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("Error");
});


app.use((req, res, next) => {
res.send("Hello World :)")
});


app.listen(PORT, () => {
  console.log(`Server Telah Berjalan > http://localhost:${PORT}`)
})

