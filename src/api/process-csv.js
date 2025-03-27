import multer from 'multer';
import { Parser } from 'json2csv';
import csv from 'csv-parser';
import stream from 'stream';
import { promisify } from 'util';

const pipeline = promisify(stream.pipeline);
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('archivoCSV');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    return new Promise((resolve, reject) => {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al subir archivo' });
            }

            if (!req.file) {
                return res.status(400).json({ error: 'No se subió ningún archivo' });
            }

            const resultados = [];
            const bufferStream = new stream.PassThrough();
            bufferStream.end(req.file.buffer);

            bufferStream
                .pipe(csv({ separator: ';' }))
                .on('data', (fila) => {
                    const sentValue = Number(fila['sent']);
                    if (sentValue !== 0) {
                        resultados.push({
                            Envio: fila['name'],
                            Sent: sentValue,
                            Open: fila['unique open'],
                            Clicks: fila['unique click'],
                            Fecha: fila['sent at'],
                        });
                    }
                })
                .on('end', async () => {
                    resultados.sort((a, b) => {
                        const [dayA, monthA, yearA] = a.Fecha.split('/');
                        const [dayB, monthB, yearB] = b.Fecha.split('/');

                        const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
                        const dateB = new Date(`${yearB}-${monthB}-${dayB}`);

                        return dateA - dateB;
                    });

                    const json2csvParser = new Parser({ delimiter: ';' });
                    const csvGenerado = json2csvParser.parse(resultados);

                    res.setHeader('Content-Disposition', 'attachment; filename="reporte-filtrado.csv"');
                    res.setHeader('Content-Type', 'text/csv');

                    resolve(res.send(csvGenerado));
                })
                .on('error', (error) => {
                    reject(res.status(500).json({ error: 'Error al procesar CSV' }));
                });
        });
    });
}
