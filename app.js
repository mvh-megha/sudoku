/**
 * This file is the entry point of the app
 */

const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const serverPort = 8080;//appConfiguration.getPortNumber();
try {
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    /** Server Health checkup*/
    app.get('/', (req, res) => {
        res.send('Server is up and running');
    });

    /**
     * This is the API for sudoku validation
     * Here we are checking for the sum of row, column and sub grids to be 45
     */
    app.post('/sudoku', (req, res) => {
        try {
            var valid = checkSudokuValidity(req.body.sudoku);
            if (valid) {
                return res.status(200).send({ message: "Valid Sudoku" })
            } else {
                return res.status(400).send({ message: "Invalid Sudoku" })
            }
        } catch (error) {
            res.status(500).send(error)
        }
    });

    /** Starting the server using express */
    app.listen(serverPort, (error) => {
        if (error) {
            return console.log('Error while starting the server', error);
        }
        console.log(`server is listening on ${serverPort}`);
    });

} catch (error) {
    console.log(error);
}

/**
 * This is the function to check sudoku validity
 * @param {*} data - multidimentional sudoku array
 */
function checkSudokuValidity(data) {
    try {
        var valid = true;
        /* validating rows and columns */
        for (var i = 0; i < 9; i++) {
            var result1 = 0; var result2 = 0;
            for (var j = 0; j < 9; j++) {
                result1 += data[i][j];
                result2 += data[j][i]
            }
            if (result1 != 45 || result2 != 45) {
                return false;
            }
        }

        /* Validating sub grids */
        var subArray = [];
        /* adding entry points of subgrids in an array for reference */
        for (var i = 0; i < 9; i += 3) {
            for (var j = 0; j < 9; j += 3) {
                subArray.push({ row: i, col: j })
            }
        }

        /* checking sum of subgrid elements */
        for (var i = 0; i < subArray.length; i++) {
            var array1Total = 0;
            for (var x = subArray[i].row; x < subArray[i].row + 3; x++) {
                for (var y = subArray[i].col; y < subArray[i].col + 3; y++) {
                    array1Total += data[x][y];
                }
            }
            if (array1Total != 45) {
                return false
            }
        }
        return valid;
    } catch (error) {
        throw error;
    }
}