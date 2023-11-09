const http = require('http');
const fs = require('fs');
const xml = require ('fast-xml-parser');

const server = http.createServer((req, res) => {
    const xmlData = fs.readFileSync('data.xml', 'utf8');

    const parser = new xml.XMLParser();
    const obj = parser.parse(xmlData);
    let data = obj.exchange.currency;
    
    if (!Array.isArray(data)){
        data=[data];
    }  
        const sorted = data.map((item) => ({
            txt: item.txt,
            rate: item.rate,
            cc: item.cc,
        }));

        const newObj = {
            data: {currency: sorted},
        };

        const builder = new xml.XMLBuilder();
        const xmlStr = builder.build(newObj);

        res.writeHead(200, {'Content-Type': 'application/xml'});
        res.end(xmlStr);

});

server.listen(8000, () => {
    console.log('Server is running localhost: 8000');
})
