const assert = require('assert');
const expect = require('chai').expect;
const axios = require('axios');
const config = require('config');

const port = config.express.port;



describe('Testing rest-api resource test' ,() => {

    it('testing get should return status 200', async () => {
        // A A A
        const res = await axios.get(`http://localhost:${port}/test`);
        expect(res.status).to.equal(200)
       
    });
    it('testing get with id 1 should return status 200', async () => {

        const res = await axios.get(`http://localhost:${port}/test/1`);
        const actual = res.data.id

        const expected = '1';
        assert.strictEqual(expected, actual);
        
    })

});