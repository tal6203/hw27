const check = require('./exam_check');
const assert = require('assert');
describe('Testing basic functionality of the grade_validator', () => {
    it('Valid grade check', () => {
        const actual = check.grade_validator(26);

        const expected = true;

        assert.strictEqual(expected, actual);
    });
    it('Invalid grade check', () => {
        const actual = check.grade_validator(300);

        const expected = false;

        assert.strictEqual(expected, actual);
    });
    it('Invalid input', () => {
        assert.throws(() => {
            check.grade_validator([1, 2, 3]);
            check.grade_validator("hello");
            check.grade_validator(undefined);
        });
    });
});
