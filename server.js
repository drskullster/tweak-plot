import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import serve from 'koa-static';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import Koa from 'koa';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const UPLOADS_DIR = path.join(__dirname, 'uploads');
const PRINT_NUMBER_PATH = path.join(__dirname, 'number.txt');
const PORT = 3001;

const app = new Koa()
const router = new Router();
app.use(bodyParser({
    jsonLimit: '50mb',
}));

let printNumber;

// Create upload directory if it doesn't exist
const ensureUploadsDirExists = async () => {
    try {
        await fs.access(UPLOADS_DIR);
    } catch (error) {
        console.log('Uploads directory not found, creating it...');
        await fs.mkdir(UPLOADS_DIR);
        console.log('Uploads directory created successfully.');
    }
};

const ensureNumberFileExists = async () => {
    try {
        await fs.readFile(PRINT_NUMBER_PATH);
    } catch (e) {
        console.log('Print number file not found, creating it...');
        await fs.writeFile(PRINT_NUMBER_PATH, '' + 1);
        console.log('Print number file created');
    }
}

const getPrintNumber = async () => {
    try {
        const number = parseInt(await fs.readFile(PRINT_NUMBER_PATH, { encoding: 'utf8' }));
        if (isNaN(number)) {
            throw 'Could not read print number';
        }
        printNumber = number;
    } catch (error) {
        console.log(error);
        printNumber = 1;
    }
}

const writePrintNumber = async () => {
    try {
        await fs.writeFile(PRINT_NUMBER_PATH, '' + printNumber);
    } catch (err) {
        console.log(err);
    }
}

app.use(serve('src'));

router.post('/save-svg', async (ctx) => {
    try {
        const { svgContent } = ctx.request.body;

        if (!svgContent) {
            ctx.status = 400; // Bad Request
            ctx.body = { message: 'SVG content is missing.' };
            return;
        }

        const uniqueFilename = `${pad(printNumber)}.svg`;
        const filePath = path.join(UPLOADS_DIR, uniqueFilename);

        await fs.writeFile(filePath, svgContent, 'utf8');
        
        printNumber++;
        
        await writePrintNumber();

        console.log(`Successfully saved SVG to: ${filePath}`);
        ctx.status = 201; // 201 Created
        ctx.body = {
            message: 'SVG saved successfully!',
            printNumber,
        };

    } catch (error) {
        console.error('Error saving SVG:', error);
        ctx.status = 500; // Internal Server Error
        ctx.body = { message: 'An error occurred while saving the file.' };
    }
});

router.get('/print-number', async (ctx) => {
    ctx.status = 201;
    ctx.type = 'application/json';
    ctx.body = printNumber;
})

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, async () => {
    await ensureUploadsDirExists();
    await ensureNumberFileExists();
    await getPrintNumber();
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log('Send a POST request to /save-svg to save your SVG.');
    console.log(`Starting print number at ${printNumber}`);
});



function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}