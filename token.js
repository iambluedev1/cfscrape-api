// https://stackoverflow.com/a/23328916
function generate(count, k) {
    var _sym = 'abcdefghijklmnopqrstuvwxyz1234567890';
    var str = '';
    for(var i = 0; i < count; i++) {
        str += _sym[parseInt(Math.random() * (_sym.length))];
    }
    k(str);
}

module.exports = generate;