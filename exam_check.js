function grade_validator(grade) {
    if (typeof grade != "number") {
        throw new Error('The grade is invalid');
    }
    else {
        if (grade >= 0 && grade <= 100) {
            return true;
        }
        else {
            return false;
        }
    }
}

module.exports = {grade_validator}