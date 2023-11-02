const http = require('http');
const fs = require('fs');
const xml = require('fast-xml-parser');

const server = http.createServer((req, res) => {
    try { const xmlData = fs.readFileSync('data.xml', 'utf8');
    if (!xmlData) { throw new Error ('Empty file or file not found')};

    const options = {
        attributeNamePrefix: '',
        ignoreAttribute: false,
    };

    const parser = new xml.XMLParser(options);
    const obj = parser.parse(xmlData, options);

    if (obj && obj.exhange && Array.isArray(obj.exhange.currency)){
        const data = obj.exhange.currency;
        const sorted = data.map((item) => ({
            txt: item.txt,
            cc: item.cc,
            rate: item.rate,
        }));

        const newObj = {
            data: {currency: sorted,},
        };

        const builder = new xml.XMLBuilder();
        const xmlStr = builder.build(newObj);

        res.writeHead(200, {'Content-Type': 'application/xml'});
        res.end(xmlStr);
    }
}
catch (error){
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end('Error:' +error.message);
}

});

server.listen(8000, () => {
    console.log('Server is running localhost: 8000');
})