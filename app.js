import express from 'express';
import path from 'path';


const app = express();

const __dirname = path.resolve();

app.use('/public', express.static(__dirname + '/public'));

app.use(express.json());

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
}
);

app.post('/calcular', function (req, res) {
    const{ matriz1, matriz2} = req.body;
    
    const matrizMultiplicada = [];

    for (let i = 0; i < matriz1.length; i++) {
        matrizMultiplicada[i] = [];
        for (let j = 0; j < matriz2[0].length; j++) {
            let suma = 0;
            for (let k = 0; k < matriz1[0].length; k++) {
                suma += matriz1[i][k] * matriz2[k][j];
            }
            matrizMultiplicada[i][j] = suma;
        }
    }


    return res.json({ matrizMultiplicada });


});

app.listen(3000, function () {
    console.log(`Aplicación ejemplo, escuchando en http://localhost:3000/`);
});