var oe;
(function (oe) {
    function rand(n) {
        return ((Math.random() * 100000000) % n) >> 0;
    }
    oe.rand = rand;
    function shuffle(a) {
        var j, x, i;
        for (i = a.length; i; i -= 1) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
    }
    oe.shuffle = shuffle;
    function gcd_(x, y) {
        if (y === undefined)
            return x;
        if (x === undefined)
            return 1;
        while (y != 0) {
            var z = x % y;
            x = y;
            y = z;
        }
        return x;
    }
    oe.gcd_ = gcd_;
    function lcm_(x, y) {
        return x * y / gcd_(x, y);
    }
    oe.lcm_ = lcm_;
    function gcd() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var ret = args[0];
        for (var i = 1; i < args.length; i++) {
            ret = gcd_(ret, args[i]);
        }
        return ret;
    }
    oe.gcd = gcd;
    function lcm() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var ret = args[0];
        for (var i = 1; i < args.length; i++) {
            ret = lcm_(ret, args[i]);
        }
        return ret;
    }
    oe.lcm = lcm;
    function max() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var ret = args[0];
        for (var i = 1; i < args.length; i++) {
            ret = Math.max(ret, args[i]);
        }
        return ret;
    }
    oe.max = max;
    function min() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var ret = args[0];
        for (var i = 1; i < args.length; i++) {
            ret = Math.min(ret, args[i]);
        }
        return ret;
    }
    oe.min = min;
    /// Permutation and combination
    function F(n) {
        var f = 1;
        for (var i = 2; i <= n; i++) {
            f *= i;
        }
        return f;
    }
    oe.F = F;
    function P(n, m) {
        var f = 1;
        for (var i = n - m + 1; i <= n; i++) {
            f *= i;
        }
        return f;
    }
    oe.P = P;
    function C(n, m) {
        return P(n, m) / F(m);
    }
    oe.C = C;
    // Number
    function num() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var n = 0;
        for (var i = 0; i < args.length; i++) {
            n = n * 10 + args[i];
        }
        return n;
    }
    oe.num = num;
    function cos(x) {
        return Math.cos(x * Math.PI / 180);
    }
    oe.cos = cos;
    function sin(x) {
        return Math.sin(x * Math.PI / 180);
    }
    oe.sin = sin;
    function round(value, decimals) {
        //        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
        return value.toFixed(decimals);
    }
    oe.round = round;
    function rf(a, b) {
        var pos = 1;
        if (a < 0) {
            pos = 1 - pos;
            a = -a;
        }
        if (b < 0) {
            pos = 1 - pos;
            b = -b;
        }
        var g = gcd(a, b);
        return ['-', ''][pos] + (b == g ? a / g : a / g + "/" + b / g);
    }
    oe.rf = rf;
    // return string representation of reduced fraction a/b, using \over
    function rfm(a, b) {
        var pos = 1;
        if (a < 0) {
            pos = 1 - pos;
            a = -a;
        }
        if (b < 0) {
            pos = 1 - pos;
            b = -b;
        }
        var g = gcd(a, b);
        return '{' + ['-', ''][pos] + (b == g ? a / g : (a / g + " \\over " + b / g)) + '}';
    }
    oe.rfm = rfm;
})(oe || (oe = {}));
;
//# sourceMappingURL=utility.js.map