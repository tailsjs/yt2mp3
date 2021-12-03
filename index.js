const fetch = require("node-fetch"),
    cheerio = require("cheerio"),
    args = process.argv.slice(2),
    fs = require("fs"),
    startTime = Math.floor(Date.now()/1000);

if(!args[0])return console.log("No video URL!");
if(!args[0].match(/(http(s?)\:\/\/)?(www\.)?(youtube\.com\/watch\?v\=.{11}|youtu\.be\/.{11})/))return console.log("You must input youtube url!\nExample: https://youtube.com/watch?v=testvideo12");
let videoid = "";
if(args[0].includes("youtube.com")){
    videoid = args[0].split("=")[1]
}else{
    videoid = args[0].split("/")[3]
};
logger("Ok, trying to download....");

fetch("https://www.yt-download.org/api/button/mp3/" + videoid)
    .then(async e => {
            const $ = cheerio.load(await e.text());
            let urls = [];
            $("a").each(function(i,e){
                urls.push($(e).attr("href"))
            })
            logger(`URLs parsed! Downloading to ${videoid} folder.`);
            if(!fs.existsSync(`./${videoid}`))fs.mkdirSync(`./${videoid}`);
            for(let i of urls){
                if(!fs.existsSync(`./${videoid}/${i.split("/")[6]}.mp3`))fs.appendFileSync(`./${videoid}/${i.split("/")[6]}.mp3`, "");
                fetch(i).then(async function(res){
                    await fs.writeFileSync(`./${videoid}/${i.split("/")[6]}.mp3`, await res.buffer());
                    logger(`${i.split("/")[6]}kbps version downloaded!`)
                })
            }
        });
function logger(text){
    return console.log(`[${Math.floor(Date.now()/1000)-startTime}s] | ${text}`)
}