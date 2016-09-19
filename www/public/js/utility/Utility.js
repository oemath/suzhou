var oe;
(function (oe) {
    function rand(n) {
        return ((Math.random() * 100000000) % n) >> 0;
    }
    oe.rand = rand;
    function shuffle(a, len) {
        var j, x, i;
        for (i = len; i; i -= 1) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
    }
    oe.shuffle = shuffle;
    function shuffle2(a) {
        shuffle(a, a.length);
    }
    oe.shuffle2 = shuffle2;
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
    // last digit of a^n
    function ones(a, n) {
        if (n == 0)
            return 1;
        if (a == 0 || a == 1 || a == 5 || a == 6)
            return a;
        if (a == 2)
            return [6, 2, 4, 8][n % 4];
        if (a == 3)
            return [1, 3, 9, 7][n % 4];
        if (a == 4)
            return [6, 4][n % 2];
        if (a == 7)
            return [1, 7, 9, 3][n % 4];
        if (a == 8)
            return [6, 8, 4, 2][n % 4];
        if (a == 9)
            return [1, 9][n % 2];
        return 0;
    }
    oe.ones = ones;
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
    // a: 0-9; 0->zero, 1->one, ...
    function dstr(a) {
        if (0 <= a && a <= 9) {
            return ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'][a];
        }
    }
    oe.dstr = dstr;
    // a: 0-9; 0->Zero, 1->One, ...
    function Dstr(a) {
        if (0 <= a && a <= 9) {
            return ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'][a];
        }
    }
    oe.Dstr = Dstr;
    function card() {
        return ['heart', 'spade', 'diamond', 'club'][oe.rand(4)];
    }
    oe.card = card;
    // the chance of sum of rolling dice (over 36)
    function dice2(a) {
        if (a < 2 || a > 12)
            return 0;
        return [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1][a - 2];
    }
    oe.dice2 = dice2;
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
    function money(m) {
        return m.toFixed(2);
    }
    oe.money = money;
    function ratio(a, b) {
        if (a <= 0 || b <= 0)
            return '';
        var g = oe.gcd(a, b);
        return a / g + " : " + b / g;
    }
    oe.ratio = ratio;
    function reverse(str) {
        return str.split("").reverse().join("");
    }
    oe.reverse = reverse;
    function comma(a) {
        return (a + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    oe.comma = comma;
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
    function weekday(a) {
        if (0 <= a && a <= 6) {
            return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][a];
        }
        return '';
    }
    oe.weekday = weekday;
    function month(a) {
        if (1 <= a && a <= 12) {
            return ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novermber', 'December'][a - 1];
        }
        return '';
    }
    oe.month = month;
    function month_abbr(a) {
        if (1 <= a && a <= 12) {
            return ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'][a - 1];
        }
        return '';
    }
    oe.month_abbr = month_abbr;
})(oe || (oe = {}));
;
//# sourceMappingURL=Utility.js.map