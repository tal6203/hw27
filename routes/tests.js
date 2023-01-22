const express = require('express');
const router = express.Router();
const knex = require('knex');
const config = require('config');
const logger = require('../logger/my_logger');
const dal_test = require('../dal/test_repo');


const connectedKnex = knex({
    client: 'pg',
    version: config.db.version,
    connection: {
        host: config.db.host,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database
    }
});

/**
*  @swagger
*  components:
*     schemas:
*       test:
*         type: object
*         required:
*           - id
*           - updateat
*           - name
*           - date
*           - courseid
*         properties:
*           id:
*             type: integer
*             description: The auto-generated id of the test.
*           updateat:
*             type: string
*             description: When was the last time we updated the test.
*           name:
*             type: int
*             description: The name of the test.
*           date:
*             type: string
*             description: When was the test added.
*           courseid:
*             type: int
*             description: courseid of the test.
*         example:
*           updateat: 2023-1-9 7:22:58 
*           name: Tal
*           date: 2023-1-9 7:22:58
*           courseid: 201
*/
/**
*  @swagger
*  tags:
*    name: Tests
*    description: API to manage your test.
*/

// get all

/**
*  @swagger
*   /test/:
*     get:
*       summary: List all of the tests
*       tags: [Tests]
*       responses:
*         "200":
*           description: The list of tests.
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/test'
*/
router.get('/', async (req, resp) => {
    try {
        const test = await dal_test.get_all_test();
        logger.debug(`[test router][router.get]`);
        resp.status(200).json({ test });
        
    }
    catch (err) {
        logger.debug(`error during GET in test router. ${err.message}`);
        resp.status(500).json({ "error": err.message });
    }
});

// get end point by id

/**
 *  @swagger
 *   /test/{id}:
 *     get:
 *       summary: Gets a test by id
 *       tags: [tests]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: The test id
 *       responses:
 *         "200":
 *           description: The list of test.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/test'
 *         "500":
 *           description: err.message.
 */
router.get('/:id', async (req, resp) => {
    try {
        const test = await dal_test.get_test_by_id(req.params.id);
        logger.debug(`[test router][router.get] parameter :id = ${req.params.id}`)
        resp.status(200).json(test);
    }
    catch (err) {
        logger.debug(`ERROR : ${err.message}`)
        resp.status(500).json({ "error": err.message });
    }
});


function is_valid_test(obj) {
    const result = obj.hasOwnProperty('updateat') && obj.hasOwnProperty('name') &&
        obj.hasOwnProperty('date') && obj.hasOwnProperty('courseid');

    if (!result) {
        logger.debug(`bad object was recieved. ${JSON.stringify(obj)}`);
    }
    return result;
}

function is_valid_test_for_update(obj) {
    const result = obj.hasOwnProperty('updateat') && obj.hasOwnProperty('name') && obj.hasOwnProperty('courseid');

    if (!result) {
        logger.debug(`bad object was recieved. ${JSON.stringify(obj)}`);
    }
    return result;
}


// ADD

/**
 * 
 * @swagger
 * /test/:
 *     post:
 *       summary: Creates a new test
 *       tags: [tests]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/test'
 *       responses:
 *         "200":
 *           description: The created test.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/test'
 */
router.post('/', async (req, resp) => {
    console.log(req.body);
    const test = req.body;
    try {
        if (!is_valid_test(test)) {
            resp.status(400).json({ error: 'values of test are not llegal' });
            return
        }
        const result = await dal_test.insert_test(test);
        resp.status(201).json({
            new_test: { ...test, ID: result.id },
            url: `http://localhost:8080/test/${result[0].id}`
        });
    }
    catch (err) {
        logger.debug(`error during POST in test router. test = ${JSON.stringify(test)} ${err.message}`);
        resp.status(500).json({ "error": err.message });
    }
});

/**
*  @swagger
*	/test/{id}:
*     put:
*       summary: Updates a test
*       tags: [tests]
*       parameters:
*         - in: path
*           name: id
*           schema:
*             type: integer
*           required: true
*           description: The test id
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/test'
*       responses:
*         "200":
*           description: Update passed successfully.
*         "500":
*           description: err.message.
*/
router.put('/:id', async (req, resp) => {
    console.log(req.body);
    const test = req.body;
    try {
        if (!is_valid_test_for_update(test)) {
            resp.status(400).json({ error: 'values of test are not llegal' });
            return
        }
        const result = await dal_test.update_test(req.params.id, test);
        resp.status(200).json({
            status: 'updated',
            'how many rows updated': result
        })
    }
    catch (err) {
        logger.debug(`error during PUT in test router. test = ${JSON.stringify(test)} ${err.message}`);
        resp.status(500).json({ "error": err.message });
    }
});


// DELETE 
/**
 *  @swagger
 *   /test/{id}:
 *     delete:
 *       summary: delete a test by id
 *       tags: [tests]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: The test id
 *       responses:
 *         "200":
 *           description: delete a test by id.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/test'
 *         "500":
 *           description: err.message.
 */
router.delete('/:id', async (req, resp) => {
    try {
        const result = await dal_test.del_test_by_id(req.params.id)
        resp.status(200).json({
            status: 'success',
            "how many deleted": result
        });
    }
    catch (err) {
        logger.debug(`error during DELETE in test router.  ${err.message}`);
        resp.status(500).json({ "error": err.message });
    }

});


module.exports = router;