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
    function shuffle2(a) {
        shuffle(a, a.length);
        return a;
    }
    oe.shuffle2 = shuffle2;
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
})(oe || (oe = {}));
;
//# sourceMappingURL=Utility.js.map