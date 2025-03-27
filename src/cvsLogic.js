const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { Parser } = require('json2csv'); 

// const app = express();

// const upload = multer({ dest: 'uploads/' });


// app.get('/', (req, res) => {
//   res.send(`
//     <h2>Subir archivo CSV</h2>
//     <form action="/upload" method="POST" enctype="multipart/form-data">
//       <input type="file" name="archivoCSV" accept=".csv" />
//       <button type="submit">Procesar</button>
//     </form>
//   `);
// });


// app.post('/upload', upload.single('archivoCSV'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No se subió ningún archivo');
//   }


// const filePath = req.file.path;
// const resultados = [];

// fs.createReadStream(filePath)
//   .pipe(csv({ separator: ';' }))
//   .on('data', (fila) => { 
//     const sentValue = Number(fila['sent'])
//     if(sentValue != 0){
//     const filaFiltrada = {
//       Envio: fila['name'],
//       Sent: sentValue,
//       Open: fila['unique open'], 
//       Clicks: fila['unique click'],
//       Fecha: fila['sent at'],
//     };
//     resultados.push(filaFiltrada)
//   }})
//   .on('end', () => {
//     console.log('✅ Datos extraídos del CSV original:');
//     console.table(resultados);

// // Ordenamos por fecha (sentAt)
//     resultados.sort((a, b) => {
//       const [dayA, monthA, yearA] = a.Fecha.split('/');
//       const [dayB, monthB, yearB] = b.Fecha.split('/');

//       const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
//       const dateB = new Date(`${yearB}-${monthB}-${dayB}`);

//       return dateA - dateB; // Menor a mayor
//     });

//     console.log('🔹 Datos ordenados por fecha:');
//     console.table(resultados);

//     const json2csvParser = new Parser({ delimiter: ';' });
//       const csvFiltrado = json2csvParser.parse(resultados);

//       // Opcional: Borrar el archivo subido (ya no lo necesitamos)
//       fs.unlinkSync(filePath);

//       // Devolvemos el CSV para descargar
//       res.setHeader('Content-Disposition', 'attachment; filename="reporte-filtrado.csv"');
//       res.set('Content-Type', 'text/csv');
//       return res.send(csvFiltrado);
//     });
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Servidor iniciado en http://localhost:${PORT}`);
// });














const resultados = [];

const archivoCsv = path.join(__dirname, '../data/data_prueba2.csv');

fs.createReadStream(archivoCsv)
  .pipe(csv({ separator: ';' })) 
  .on('data', (fila) => {
    const sentValue = Number(fila['sent'])
    if(sentValue != 0){
    const filaFiltrada = {
      Envio: fila['name'],
      Sent: sentValue,
      Open: fila['unique open'],
      Clicks: fila['unique click'],
      Fecha: fila['sent at'],
    };
    resultados.push(filaFiltrada)
  }})
  .on('end', () => {
    console.log('✅ Datos extraídos del CSV original:');
    console.table(resultados);

// Ordenamos por fecha (sentAt)
    resultados.sort((a, b) => {
      const [dayA, monthA, yearA] = a.Fecha.split('/');
      const [dayB, monthB, yearB] = b.Fecha.split('/');

      const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
      const dateB = new Date(`${yearB}-${monthB}-${dayB}`);

      return dateA - dateB; // Menor a mayor
    });

    console.log('🔹 Datos ordenados por fecha:');
    console.table(resultados);

    // Generar nuevo archivo CSV automáticamente
    const json2csvParser = new Parser({ delimiter: ';' });
    const csvGenerado = json2csvParser.parse(resultados);

    const rutaSalidaCsv = path.join(__dirname, '../data/reporte-filtrado5.csv');

    fs.writeFileSync(rutaSalidaCsv, csvGenerado);

    console.log('🎯 CSV generado correctamente en la carpeta data.');
  
  });
