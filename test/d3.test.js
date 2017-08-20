const assert = require('assert');
const path = require('path')
const getPoint = require(path.join(process.cwd(), 'src/d3/drawArrow'))

describe('getPoint function', function () {
    describe('point is on the line', function () {
        it('first', function () {
            let line = [100, 20, 30, 200]
            let r = getPoint(...line, 20)
            assert.equal(true, isPointCorrect(line, [r[0].x, r[0].y]));
        });
        it('second', function () {
            let line = [10, 20, 200, 200]
            let r = getPoint(...line, 20)
            assert.equal(true, isPointCorrect(line, [r[0].x, r[0].y]));
        });
        it('third', function () {
            let line = [400, 400, 300, 300]
            let r = getPoint(...line, 20)
            assert.equal(true, isPointCorrect(line, [r[0].x, r[0].y]));
        });
        it('forth', function () {
            let line = [100, 400, 300, 300]
            let r = getPoint(...line, 20)
            assert.equal(true, isPointCorrect(line, [r[0].x, r[0].y]));
        });
        function isPointCorrect(line, point) {
            let r = Math.abs((point[1] - line[3]) / (line[1] - line[3]) - (point[0] - line[2]) / (line[0] - line[2]))
            if (r < 0.0001) {
                console.log('r:', r)
                return true
            }
            else {
                return false
            }
        }
    });
});

