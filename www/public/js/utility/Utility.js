var oe;
(function (oe) {
    function rand(n, m) {
        if (n == undefined || isNaN(n) || n < 0)
            return NaN;
        if (m == undefined || isNaN(m)) {
            m = n;
            n = 0;
        }
        if (m < 0)
            return NaN;
        if (n > m) {
            var x = n;
            n = m;
            m = x;
        }
        m = Math.floor(m);
        n = Math.floor(n);
        return +n + Math.floor((Math.random() * 100000000) % (m - n));
    }
    oe.rand = rand;
    function shuffle(a, len) {
        if (a == undefined)
            return 'undefined';
        if (len == undefined || isNaN(len))
            len = a.length;
        var j, x, i;
        for (i = len; i; i -= 1) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
        return a;
    }
    oe.shuffle = shuffle;
    function choose(a, n) {
        if (n < 0 || n >= a.length)
            return '[]';
        var rtn = "" + a[n];
        for (var i = 0; i < a.length; i++) {
            if (i != n)
                rtn += "," + a[i];
        }
        return rtn;
    }
    oe.choose = choose;
    function chooseStr(a, n) {
        if (n < 0 || n >= a.length)
            return '[]';
        var rtn = "'" + a[n] + "'";
        for (var i = 0; i < a.length; i++) {
            if (i != n)
                rtn += ",'" + a[i] + "'";
        }
        return rtn;
    }
    oe.chooseStr = chooseStr;
    function chooseWeek(n) {
        if (n === undefined || isNaN(n) || n < 0)
            return 'undefined';
        n %= 7;
        var a = ['##0Sunday', '##6Monday', '##5Tuesday', '##4Wednesday', '##3Thursday', '##2Friday', '##1Saturday'];
        var rtn = [];
        rtn.push("" + a[n]);
        for (var i = 0; i < a.length; i++) {
            if (i != n)
                rtn.push("" + a[i]);
        }
        return rtn.join(';;');
    }
    oe.chooseWeek = chooseWeek;
    function generateRadio(a, n) {
        if (n < 0 || n >= a.length)
            return ';;';
        var rtn = "" + a[n];
        for (var i = 0; i < a.length; i++) {
            if (i != n)
                rtn += ";;" + a[i];
        }
        return rtn;
    }
    oe.generateRadio = generateRadio;
    function gcd_(x, y) {
        if (y === undefined)
            return x;
        if (x === undefined)
            return y;
        if (isNaN(x))
            return x;
        if (isNaN(y))
            return y;
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
        if (isNaN(n))
            return n;
        var f = 1;
        for (var i = 2; i <= n; i++) {
            f *= i;
        }
        return f;
    }
    oe.F = F;
    function P(n, m) {
        if (isNaN(n))
            return n;
        if (isNaN(m))
            return m;
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
    // a: 0-9; 0->Zero, 1->One, ...
    function Dstr(a) {
        if (0 <= a && a <= 20) {
            return ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
                'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty'][a];
        }
        return '-';
    }
    oe.Dstr = Dstr;
    // a: 0-9; 0->zero, 1->one, ...
    function dstr(a) {
        return Dstr(a).toLowerCase();
    }
    oe.dstr = dstr;
    // a: 1-9; 1->First, ...
    function Tstr(a) {
        if (1 <= a && a <= 20) {
            return ['Fisrt', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth', 'Eleventh',
                'Twelveth', 'Thirteenth', 'Fourteenth', 'Fifteenth', 'Sixteenth', 'Seventeenth', 'Eighteenth', 'Nineteenth', 'Twentieth'][a - 1];
        }
        return '-';
    }
    oe.Tstr = Tstr;
    // a: 2-9; 2->Twice, ...
    function Mstr(a) {
        if (a == 2)
            return 'Twice';
        return a > 2 ? oe.Dstr(a) + " times" : '-';
    }
    oe.Mstr = Mstr;
    // a: 2-9; 2->twice, ...
    function mstr(a) {
        return Mstr(a).toLowerCase();
    }
    oe.mstr = mstr;
    // a: 2-9; 2->Half, ...
    function Mstr2(a) {
        if (a == 2)
            return 'Half';
        return a > 2 ? "One " + oe.Tstr(a) : '-';
    }
    oe.Mstr2 = Mstr2;
    // a: 2-9; 2->half, ...
    function mstr2(a) {
        return Mstr2(a).toLowerCase();
    }
    oe.mstr2 = mstr2;
    // a: 1-9; 1->First, ...
    function tstr(a) {
        return Tstr(a).toLowerCase();
    }
    oe.tstr = tstr;
    // ones digit
    function d1(a) {
        if (a == undefined || isNaN(a))
            return a;
        return a % 10;
    }
    oe.d1 = d1;
    function d2(a) {
        if (a == undefined || isNaN(a))
            return a;
        return Math.floor(a / 10) % 10;
    }
    oe.d2 = d2;
    function d3(a) {
        if (a == undefined || isNaN(a))
            return a;
        return Math.floor(a / 100) % 10;
    }
    oe.d3 = d3;
    function d4(a) {
        if (a == undefined || isNaN(a))
            return a;
        return Math.floor(a / 1000) % 10;
    }
    oe.d4 = d4;
    function d5(a) {
        if (a == undefined || isNaN(a))
            return a;
        return Math.floor(a / 10000) % 10;
    }
    oe.d5 = d5;
    function d6(a) {
        if (a == undefined || isNaN(a))
            return a;
        return Math.floor(a / 100000) % 10;
    }
    oe.d6 = d6;
    function d7(a) {
        if (a == undefined || isNaN(a))
            return a;
        return Math.floor(a / 1000000) % 10;
    }
    oe.d7 = d7;
    function d8(a) {
        if (a == undefined || isNaN(a))
            return a;
        return Math.floor(a / 10000000) % 10;
    }
    oe.d8 = d8;
    function d9(a) {
        if (a == undefined || isNaN(a))
            return a;
        return Math.floor(a / 100000000) % 10;
    }
    oe.d9 = d9;
    function ngon(a) {
        if (a >= 3 && a <= 10)
            return ['triangle', 'quadrilateral', 'pentagon', 'hexagon', 'heptagon', 'octagon', 'nanogon', 'decagon'][a - 3];
        return '-';
    }
    oe.ngon = ngon;
    function card(c) {
        if (c == undefined || isNaN(c))
            c = oe.rand(4);
        if (c < 0 || c > 3)
            return 'undefined';
        return ['spade', 'diamond', 'heart', 'club'][c];
    }
    oe.card = card;
    // 1:A, 13-King
    function cardName(a) {
        if (a == undefined || isNaN(a) || a < 1 || a > 13)
            return 'undefined';
        if (2 <= a && a <= 10)
            return oe.dstr(a);
        if (a == 1)
            return 'ace';
        if (a == 11)
            return 'jack';
        if (a == 12)
            return 'queen';
        return 'king';
    }
    oe.cardName = cardName;
    // the chance of sum of rolling dice (over 36)
    function dice2(a) {
        if (a < 2 || a > 12)
            return 0;
        return [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1][a - 2];
    }
    oe.dice2 = dice2;
    // the chance of sum of rolling dice (over 36)
    function dice3(a) {
        if (a < 3 || a > 18)
            return 0;
        return [1, 3, 6, 10, 15, 21, 25, 27, 27, 25, 21, 15, 10, 6, 3, 1][a - 3];
    }
    oe.dice3 = dice3;
    function cos(x) {
        return Math.cos(x * Math.PI / 180);
    }
    oe.cos = cos;
    function sin(x) {
        return Math.sin(x * Math.PI / 180);
    }
    oe.sin = sin;
    function round(value, decimals) {
        if (decimals == undefined)
            decimals = 0;
        //        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
        return value.toFixed(decimals);
    }
    oe.round = round;
    function round0(value) { return oe.round(value, 0); }
    oe.round0 = round0;
    function round1(value) { return oe.round(value, 1); }
    oe.round1 = round1;
    function round2(value) { return oe.round(value, 2); }
    oe.round2 = round2;
    function round3(value) { return oe.round(value, 3); }
    oe.round3 = round3;
    function norm(a) {
        var n = 0;
        while (Math.abs(a - parseFloat(oe.round(a, n))) > 1e-8)
            n++;
        return oe.round(a, n);
    }
    oe.norm = norm;
    // prefix 0's until a is n-digit. n is default to 2.
    function pre0(a, n) {
        if (isNaN(a))
            return 'NaN';
        if (a == undefined)
            return 'undefined';
        if (n == undefined || isNaN(n))
            n = 2;
        var d = 0, c = 1;
        for (; a >= c; c *= 10, ++d)
            ;
        var s = '';
        for (; d < n; d++)
            s += '0';
        return s + a;
    }
    oe.pre0 = pre0;
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
        if (isNaN(a))
            return "" + a;
        if (isNaN(b))
            return "" + b;
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
        if (isNaN(a))
            return "" + a;
        if (isNaN(b))
            return "" + b;
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
    // a: '1/2', b:'2/3'
    function fracAdd_(a, b, flag) {
        if (a == undefined || b == undefined)
            return 'undefined';
        if (a.length == 0)
            return b;
        if (b.length == 0)
            return a;
        var m1, n1, m2, n2;
        var idx = a.indexOf('/');
        if (idx > 0) {
            m1 = parseInt(a.substring(0, idx).trim());
            n1 = parseInt(a.substring(idx + 1).trim());
        }
        else {
            m1 = parseInt(a.trim());
            n1 = 1;
        }
        idx = b.indexOf('/');
        if (idx > 0) {
            m2 = parseInt(b.substring(0, idx).trim());
            n2 = parseInt(b.substring(idx + 1).trim());
        }
        else {
            m2 = parseInt(b.trim());
            n2 = 1;
        }
        return flag ?
            oe.rf(m1 * n2 + m2 * n1, n1 * n2) :
            oe.rf(m1 * n2 - m2 * n1, n1 * n2);
    }
    function fracAdd(a, b) {
        return fracAdd_(a, b, true);
    }
    oe.fracAdd = fracAdd;
    function fracSub(a, b) {
        return fracAdd_(a, b, false);
    }
    oe.fracSub = fracSub;
    function fracComp(m1, n1, m2, n2) {
        if (m1 == undefined || n1 == undefined || m2 == undefined || n2 == undefined)
            return NaN;
        if (isNaN(m1) || isNaN(n1) || isNaN(m2) || isNaN(n2) || n1 == 0 || n2 == 0)
            return NaN;
        var diff = m1 * n2 - m2 * n1;
        if (diff == 0)
            return 0;
        if (n1 * n2 < 0)
            return diff > 0 ? -1 : 1;
        return diff < 0 ? -1 : 1;
    }
    oe.fracComp = fracComp;
    function sci(n) {
        if (n == undefined || isNaN(n))
            return [NaN, NaN];
        var d = 0;
        while (n >= 10) {
            n /= 10;
            d++;
        }
        return [n, d];
    }
    oe.sci = sci;
    function weekday(a) {
        if (0 <= a && a <= 7) {
            return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][a];
        }
        return '';
    }
    oe.weekday = weekday;
    function month(a) {
        if (1 <= a && a <= 12) {
            return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novermber', 'December'][a - 1];
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
    function hypo(a, b) {
        return Math.sqrt(a * a + b * b);
    }
    oe.hypo = hypo;
    function hypo2(a, b) {
        return a * a + b * b;
    }
    oe.hypo2 = hypo2;
    function log(b, n) {
        return Math.log(n) / Math.log(b);
    }
    oe.log = log;
    // return a list of primes in [min, max]
    function prime(min, max) {
        var pr = [];
        if (min == undefined || isNaN(min))
            return pr;
        if (max == undefined || isNaN(max)) {
            max = min;
            min = 1;
        }
        if (min <= 0 || max < 2 || min > max)
            return pr;
        var prime_numbers = [
            2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59,
            61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127,
            131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193,
            197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269,
            271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349,
            353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431,
            433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503,
            509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599,
            601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673,
            677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761,
            769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857,
            859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947,
            953, 967, 971, 977, 983, 991, 997];
        var i = 0;
        for (; i < prime_numbers.length && prime_numbers[i] < min; i++)
            ;
        for (; i < prime_numbers.length && prime_numbers[i] <= max; i++)
            pr.push(prime_numbers[i]);
        return pr;
    }
    oe.prime = prime;
    function randPrime(min, max) {
        if (min == undefined || isNaN(min))
            return NaN;
        if (max == undefined || isNaN(max)) {
            max = min;
            min = 1;
        }
        if (min <= 0 || max < 2 || min > max)
            return NaN;
        var pc = oe.prime(min, max);
        return pc[oe.rand(pc.length)];
    }
    oe.randPrime = randPrime;
    // i: [0-8] return a pythagorean triple
    function pnum(i) {
        var pns = [[3, 4, 5],
            [5, 12, 13],
            [7, 24, 25],
            [9, 40, 41],
            [11, 60, 61],
            [13, 84, 85],
            [8, 15, 17],
            [12, 35, 37],
            [16, 63, 65]];
        if (i == undefined || isNaN(i) || i < 0 || i > 8)
            return pns[0];
        return pns[i];
    }
    oe.pnum = pnum;
    // 1, 5, 10, 25
    function coin(n) {
        var r = [];
        if (n > 100)
            return r;
        for (var i = 0; i <= n; i++) {
            for (var j = 0; j <= n - i; j++) {
                for (var k = 0; k <= n - i - j; k++) {
                    var l = n - i - j - k;
                    var v = i * 25 + j * 10 + k * 5 + l;
                    if ($.inArray(v, r) == -1)
                        r.push(v);
                }
            }
        }
        return r.sort(function (a, b) { return a - b; });
    }
    oe.coin = coin;
    // how many different ways to give different <books> books to <ppl> people
    // ppl <= books <= 6
    // dynamic programming
    function waysGiveBooks(ppl, books) {
        if (ppl == undefined || books == undefined || isNaN(ppl) || isNaN(books))
            return NaN;
        if (books > 6 || ppl > books)
            return 0;
        var ar = [
            [1, 1, 1, 1, 1, 1],
            [0, 2, 6, 14, 30, 62],
            [0, 0, 6, 36, 150, 540],
            [0, 0, 0, 24, 240, 1560],
            [0, 0, 0, 0, 120, 1800],
            [0, 0, 0, 0, 0, 720]
        ];
        return ar[ppl - 1][books - 1];
    }
    oe.waysGiveBooks = waysGiveBooks;
    // y = ax + b
    function formulaLine(a, b) {
        if (a == undefined || b == undefined || isNaN(a) || isNaN(b))
            return 'undefined';
        var r = 'y = ';
        if (a == -1) {
            r += "-x";
        }
        else if (a == 1) {
            r += "x";
        }
        else if (a < 0) {
            r += "-" + -a + "x";
        }
        else if (a > 0) {
            r += a + "x";
        }
        if (a == 0) {
            r += "" + -b;
        }
        else if (b < 0) {
            r += " - " + -b;
        }
        else if (b > 0) {
            r += " + " + b;
        }
        return r;
    }
    oe.formulaLine = formulaLine;
    function composite(start) {
        if (start == undefined || isNaN(start))
            return start;
        if (start >= 990)
            return 987;
        var arr = oe.prime(1, 1000);
        var x = start;
        while (arr.indexOf(x) >= 0 || (x % 5 == 0))
            x += 2;
        return x;
    }
    oe.composite = composite;
    // covert b-based number x to 10-based number
    function base10(x, b) {
        if (x == undefined || b == undefined || isNaN(x) || isNaN(b) || b <= 1)
            return undefined;
        var mul = 1;
        var rlt = 0;
        while (x) {
            rlt += mul * (x % 10);
            mul *= b;
            x = Math.floor(x / 10);
        }
        return rlt;
    }
    oe.base10 = base10;
    // covert 10-based number x to b-based number
    function baseX(x, b) {
        if (x == undefined || b == undefined || isNaN(x) || isNaN(b) || b <= 1)
            return undefined;
        var mul = 1;
        var rlt = 0;
        while (x) {
            rlt += mul * (x % b);
            mul *= 10;
            x = Math.floor(x / b);
        }
        return rlt;
    }
    oe.baseX = baseX;
    // return a lisst of primes in [min, max]
    function primeCount(min, max) {
        return oe.prime(min, max).length;
    }
    oe.primeCount = primeCount;
    function isPrime(a) {
        if (a <= 1)
            return false;
        for (var i = Math.floor(Math.sqrt(a)); i >= 2; i--) {
            if (a % i == 0)
                return false;
        }
        return true;
    }
    oe.isPrime = isPrime;
    // make an array has a mode, i.e. most frequent number
    function modable(a) {
        if (a == undefined)
            return 'undefined';
        var mmap = {};
        for (var i = 0; i < a.length; i++)
            mmap[a[i]] = 0;
        for (var i = 0; i < a.length; i++)
            mmap[a[i]]++;
        var mcnt = 0, mnum = 0;
        $.each(mmap, function (k, v) {
            if (mcnt < v) {
                mcnt = v;
                mnum = k;
            }
        });
        for (var i = 0; i < a.length; i++) {
            if (a[i] != mnum && mmap[a[i]] == mcnt) {
                var cln = a.slice(0);
                cln[i] = mnum;
                return cln.join(',');
            }
        }
        return a.join(',');
    }
    oe.modable = modable;
    function mode(a) {
        if (a == undefined)
            return NaN;
        var mmap = {};
        for (var i = 0; i < a.length; i++)
            mmap[a[i]] = 0;
        for (var i = 0; i < a.length; i++)
            mmap[a[i]]++;
        var mcnt = 0, mnum = 0;
        $.each(mmap, function (k, v) {
            if (mcnt < v) {
                mcnt = v;
                mnum = k;
            }
        });
        return mnum;
    }
    oe.mode = mode;
    function median(a) {
        if (a == undefined || a.length <= 0)
            return NaN;
        var sa = a.sort(function (x, y) {
            return x - y;
        });
        return (a[Math.floor(a.length / 2)] + a[Math.floor((a.length - 1) / 2)]) / 2;
    }
    oe.median = median;
    function range(a) {
        if (a == undefined)
            return NaN;
        if (a.length <= 0)
            return 0;
        var sa = a.sort(function (x, y) {
            return x - y;
        });
        return a[a.length - 1] - a[0];
    }
    oe.range = range;
    function mean(a) {
        if (a == undefined)
            return NaN;
        if (a.length <= 0)
            return 0;
        var s = 0;
        for (var i = 0; i < a.length; i++) {
            s += a[i];
        }
        return s / a.length;
    }
    oe.mean = mean;
    // integer divid
    function div(m, n) {
        if (m == undefined)
            return m;
        if (n == undefined)
            return n;
        if (isNaN(m) || isNaN(m))
            return NaN;
        return Math.floor(m / n);
    }
    oe.div = div;
    function leapYear(year) {
        return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    }
    oe.leapYear = leapYear;
    function join(x) {
        if (x == undefined)
            return 'undefined';
        if (x.length == 0)
            return '';
        if (x.length == 1)
            return "" + x[0];
        if (x.length == 2)
            return x[0] + " and " + x[1];
        return x.slice(0, x.length - 1).join(", ") + ", and " + x[x.length - 1];
    }
    oe.join = join;
    function p2cx(x, y, r, degree) {
        if (x == undefined || y == undefined || degree == undefined)
            return undefined;
        if (isNaN(x) || isNaN(y) || isNaN(degree))
            return undefined;
        return x + r * Math.cos(degree * Math.PI / 180);
    }
    oe.p2cx = p2cx;
    function p2cy(x, y, r, degree) {
        if (x == undefined || y == undefined || degree == undefined)
            return undefined;
        if (isNaN(x) || isNaN(y) || isNaN(degree))
            return undefined;
        return y + r * Math.sin(degree * Math.PI / 180);
    }
    oe.p2cy = p2cy;
    function arrow_arc(ctx, x, y, r, start, degree, ar) {
        if (ctx == undefined || x == undefined || y == undefined || r == undefined || start == undefined || degree == undefined)
            return;
        if (isNaN(x) || isNaN(y) || isNaN(r) || isNaN(start) || isNaN(degree))
            return;
        var ccw = degree <= 0 ? true : false;
        if (ccw == undefined)
            ccw = false;
        if (ar == undefined)
            ar = 5;
        var alpha = start + degree;
        var beta = ccw ? (45 + alpha) : 180 + 45 + alpha;
        ctx.moveTo(p2cx(x, y, r, start), p2cy(x, y, r, start));
        ctx.arc(x, y, r, start * Math.PI / 180, alpha * Math.PI / 180, ccw);
        x = p2cx(x, y, r, alpha);
        y = p2cy(x, y, r, alpha);
        ctx.moveTo(x, y);
        ctx.lineTo(x + ar * Math.cos(beta * Math.PI / 180), y + ar * Math.sin(beta * Math.PI / 180));
        ctx.moveTo(x, y);
        ctx.lineTo(x + ar * Math.cos((90 + beta) * Math.PI / 180), y + ar * Math.sin((90 + beta) * Math.PI / 180));
    }
    oe.arrow_arc = arrow_arc;
    function arrow_h(ctx, x, y, len, ar) {
        if (ctx == undefined || x == undefined || y == undefined || len == undefined)
            return;
        if (isNaN(x) || isNaN(y) || isNaN(len))
            return;
        if (ar == undefined)
            ar = 5;
        ctx.moveTo(x, y);
        x += len;
        ctx.lineTo(x, y);
        if (len > 0) {
            ctx.lineTo(x - ar, y - ar);
            ctx.moveTo(x, y);
            ctx.lineTo(x - ar, y + ar);
        }
        else {
            ctx.lineTo(x + ar, y - ar);
            ctx.moveTo(x, y);
            ctx.lineTo(x + ar, y + ar);
        }
    }
    oe.arrow_h = arrow_h;
    function arrow_v(ctx, x, y, len, ar) {
        if (ctx == undefined || x == undefined || y == undefined || len == undefined)
            return;
        if (isNaN(x) || isNaN(y) || isNaN(len))
            return;
        if (ar == undefined)
            ar = 5;
        ctx.moveTo(x, y);
        y += len;
        ctx.lineTo(x, y);
        if (len > 0) {
            ctx.lineTo(x - ar, y - ar);
            ctx.moveTo(x, y + len);
            ctx.lineTo(x + ar, y - ar);
        }
        else {
            ctx.lineTo(x - ar, y + ar);
            ctx.moveTo(x, y);
            ctx.lineTo(x + ar, y + ar);
        }
    }
    oe.arrow_v = arrow_v;
    function arc_bar(ctx, x, y, r, d, len) {
        if (ctx == undefined || x == undefined || y == undefined || r == undefined || d == undefined)
            return;
        if (isNaN(x) || isNaN(y) || isNaN(r) || isNaN(d))
            return;
        if (len == undefined || isNaN(len))
            len = 2;
        ctx.moveTo(oe.p2cx(x, y, r - len, d), oe.p2cy(x, y, r - len, d));
        ctx.lineTo(oe.p2cx(x, y, r + len, d), oe.p2cy(x, y, r + len, d));
    }
    oe.arc_bar = arc_bar;
    function right_angle(ctx, x, y, ang, len) {
        if (ctx == undefined || x == undefined || y == undefined || ang == undefined)
            return;
        if (isNaN(x) || isNaN(y) || isNaN(ang))
            return;
        if (len == undefined || isNaN(len))
            len = 8;
        var d = ang;
        ctx.moveTo(oe.p2cx(x, y, len, d), oe.p2cy(x, y, len, d));
        ctx.lineTo(oe.p2cx(x, y, len * Math.sqrt(2), d + 45), oe.p2cy(x, y, len * Math.sqrt(2), d + 45));
        ctx.lineTo(oe.p2cx(x, y, len, d + 90), oe.p2cy(x, y, len, d + 90));
    }
    oe.right_angle = right_angle;
    function arc(ctx, x, y, r, s, e, c) {
        if (ctx == undefined || x == undefined || y == undefined || r == undefined || s == undefined || e == undefined)
            return;
        if (isNaN(x) || isNaN(y) || isNaN(r) || isNaN(s) || isNaN(e))
            return;
        if (c == undefined)
            c = false;
        ctx.arc(x, y, r, s * Math.PI / 180, e * Math.PI / 180, c);
    }
    oe.arc = arc;
    function circle(ctx, x, y, r, c) {
        if (ctx == undefined || x == undefined || y == undefined || r == undefined)
            return;
        if (isNaN(x) || isNaN(y) || isNaN(r))
            return;
        if (c == undefined)
            c = false; // bu default, don't draw center point
        if (c) {
            ctx.moveTo(x, y);
            ctx.arc(x, y, 1, 0, 2 * Math.PI);
            ctx.moveTo(x + r, y);
        }
        ctx.arc(x, y, r, 0, 2 * Math.PI);
    }
    oe.circle = circle;
    // paint a mark on a line
    function mark(ctx, x1, y1, x2, y2, n, len, gap) {
        if (ctx == undefined || x1 == undefined || y1 == undefined || x2 == undefined || y2 == undefined)
            return;
        if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2))
            return;
        if (n == undefined || isNaN(n))
            n = 1;
        if (len == undefined || isNaN(len))
            len = 6;
        if (gap == undefined || isNaN(gap))
            gap = 5;
        var dx = x2 - x1;
        var dy = y2 - y1;
        var p = Math.sqrt(dx * dx + dy * dy);
        var rx = dx / p;
        var ry = dy / p;
        var x = (x1 + x2) / 2 - (n - 1) * gap * rx / 2;
        var y = (y1 + y2) / 2 - (n - 1) * gap * ry / 2;
        for (var i = 0; i < n; i++) {
            ctx.moveTo(x - ry * len, y + rx * len);
            ctx.lineTo(x + ry * len, y - rx * len);
            x += gap * rx;
            y += gap * ry;
        }
    }
    oe.mark = mark;
    // paint a mark on an arc
    function mark_arc(ctx, x, y, r, s, e, n, len, gap) {
        if (ctx == undefined || x == undefined || y == undefined || r == undefined || s == undefined || e == undefined)
            return;
        if (isNaN(x) || isNaN(y) || isNaN(r) || isNaN(s) || isNaN(e))
            return;
        if (n == undefined || isNaN(n))
            n = 1;
        if (len == undefined || isNaN(len))
            len = 6;
        if (gap == undefined || isNaN(gap))
            gap = 3;
        var d = (s + e) / 2 - (n - 1) * gap / 2;
        for (var i = 0; i < n; i++) {
            arc_bar(ctx, x, y, r, d, len);
            d += gap;
        }
    }
    oe.mark_arc = mark_arc;
    /////////////////////////
    // three.js
    /////////////////////////
    function material(op) {
        if (op == undefined || op == 1) {
            return new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
        }
        else {
            return new THREE.MeshNormalMaterial({ transparent: true, opacity: op, side: THREE.DoubleSide });
        }
    }
    oe.material = material;
    function sphere(x, y, z, r, op) {
        var geometry = new THREE.SphereGeometry(r, 50, 50);
        var cube = new THREE.Mesh(geometry, material(op));
        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;
        return cube;
    }
    oe.sphere = sphere;
    function cube2(x, y, z, d1, d2, d3, op) {
        var geometry = new THREE.BoxGeometry(d1, d2, d3);
        var cube = new THREE.Mesh(geometry, material(op));
        cube.position.x = x + d1 / 2;
        cube.position.y = y + d2 / 2;
        cube.position.z = z + d3 / 2;
        return cube;
    }
    oe.cube2 = cube2;
    function cube(x, y, z, d, op) {
        return oe.cube2(x, y, z, d, d, d, op);
    }
    oe.cube = cube;
    function colorCube2(x, y, z, d1, d2, d3, clr, op) {
        var geometry = new THREE.BoxGeometry(d1, d2, d3);
        for (var i = 0; i < geometry.faces.length; i += 2) {
            geometry.faces[i].color.setHex(clr);
            geometry.faces[i + 1].color.setHex(clr);
        }
        if (op == undefined || op == 1) {
            var material = new THREE.MeshBasicMaterial({
                vertexColors: THREE.FaceColors,
                overdraw: 0.5,
                side: THREE.DoubleSide
            });
        }
        else {
            var material = new THREE.MeshBasicMaterial({
                transparent: true,
                opacity: op,
                vertexColors: THREE.FaceColors,
                overdraw: 0.5,
                side: THREE.DoubleSide
            });
        }
        var cube = new THREE.Mesh(geometry, material);
        cube.position.x = x + d1 / 2;
        cube.position.y = y + d2 / 2;
        cube.position.z = z + d3 / 2;
        return cube;
    }
    oe.colorCube2 = colorCube2;
    function colorCube(x, y, z, d, clr, op) {
        return oe.colorCube2(x, y, z, d, d, d, clr, op);
    }
    oe.colorCube = colorCube;
    function rgbCube2(x, y, z, d1, d2, d3, clr, op) {
        var geometry = new THREE.BoxGeometry(d1, d2, d3);
        var xx = '';
        for (var i = 0; i < geometry.faces.length; i += 2) {
            var color = 0xffffff;
            xx += '' + i + '=' + clr[(i / 2) % clr.length] + ',';
            switch (clr[(i / 2) % clr.length]) {
                case 'r':
                    color = 0xff0000;
                    break;
                case 'g':
                    color = 0x00ff00;
                    break;
                case 'b':
                    color = 0x0000ff;
                    break;
                case 'y':
                    color = 0xffff00;
                    break;
                case 'p':
                    color = 0x00ffff;
                    break;
                case 'B':
                    color = 0x000000;
                    break;
                case 'W':
                    color = 0xffffff;
                    break;
                case 'G':
                    color = 0x7f7f7f;
                    break;
            }
            geometry.faces[i].color.setHex(color);
            geometry.faces[i + 1].color.setHex(color);
            $('#info').text(xx);
        }
        if (op == undefined || op == 1) {
            var material = new THREE.MeshBasicMaterial({
                vertexColors: THREE.FaceColors,
                overdraw: 0.5,
                side: THREE.DoubleSide
            });
        }
        else {
            var material = new THREE.MeshBasicMaterial({
                transparent: true,
                opacity: op,
                vertexColors: THREE.FaceColors,
                overdraw: 0.5,
                side: THREE.DoubleSide
            });
        }
        var cube = new THREE.Mesh(geometry, material);
        cube.position.x = x + d1 / 2;
        cube.position.y = y + d2 / 2;
        cube.position.z = z + d3 / 2;
        return cube;
    }
    oe.rgbCube2 = rgbCube2;
    function rgbCube(x, y, z, d, clr, op) {
        return oe.rgbCube2(x, y, z, d, d, d, clr, op);
    }
    oe.rgbCube = rgbCube;
    function cone(x, y, z, r, h, op) {
        var geometry = new THREE.ConeGeometry(r, h, 50, 50);
        var cone = new THREE.Mesh(geometry, oe.material(op));
        cone.position.x = x;
        cone.position.y = y + h / 2;
        cone.position.z = z;
        return cone;
    }
    oe.cone = cone;
    function cylinder(x, y, z, r1, r2, h, op, open) {
        if (open == undefined)
            open = false;
        var geometry = new THREE.CylinderGeometry(r1, r2, h, 50, 50, open);
        var cone = new THREE.Mesh(geometry, oe.material(op));
        cone.position.x = x;
        cone.position.y = y + h / 2;
        cone.position.z = z;
        return cone;
    }
    oe.cylinder = cylinder;
    function polyCylinder(x, y, z, n, r1, r2, h, op) {
        var geometry = new THREE.CylinderGeometry(r1, r2, h, n, 50);
        var cone = new THREE.Mesh(geometry, oe.material(op));
        cone.position.x = x;
        cone.position.y = y + h / 2;
        cone.position.z = z;
        return cone;
    }
    oe.polyCylinder = polyCylinder;
    function animate(renderer, scene, camera, controls, tball) {
        //        setTimeout(function () {
        requestAnimationFrame(function () { animate(renderer, scene, camera, controls, tball); });
        //      }, 1000 / 20);
        controls.update();
        tball.update();
        renderer.render(scene, camera);
        /*        controls.update();
                tball.update();
                renderer.render(scene, camera);
                setTimeout(function () {
                    animate(renderer, scene, camera, controls, tball);
                }, 1000 / 15);*/
    }
    oe.animate = animate;
    function three(container, callback) {
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(45, container.width() / container.height(), 1, 1000);
        camera.position.x = 250;
        camera.position.y = 150;
        camera.position.z = 200;
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        scene.add(camera);
        var renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setClearColor(0xffffff);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.width(), container.height());
        //				renderer.shadowMapCullFace = THREE.CullFaceBack;
        container.append(renderer.domElement);
        if (callback(scene, camera)) {
            // animate
            var tball = new THREE.TrackballControls(camera, renderer.domElement);
            var controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.5;
            controls.enableZoom = false;
            animate(renderer, scene, camera, controls, tball);
        }
        else {
            renderer.render(scene, camera);
        }
    }
    oe.three = three;
})(oe || (oe = {}));
;
//# sourceMappingURL=Utility.js.map