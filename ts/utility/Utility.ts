declare var THREE: any;

namespace oe {

    export function rand(n: number, m?: number): number {
        if (n == undefined || isNaN(n) || n < 0) return NaN;
        if (m == undefined || isNaN(m)) {
            m = n;
            n = 0;
        }
        if (m < 0) return NaN;
        if (n > m) {
            let x: number = n;
            n = m;
            m = x;
        }
        m = Math.floor(m);
        n = Math.floor(n);

        return +n + Math.floor((Math.random() * 100000000) % (m - n));
    }

    export function shuffle(a, len?: number): any {
        if (a == undefined) return 'undefined';
        if (len == undefined || isNaN(len)) len = a.length;
        let j, x, i;
        for (i = len; i; i -= 1) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
        return a;
    }

    export function choose(a, n: number): string {
        if (n < 0 || n >= a.length) return '[]';
        let rtn = `${a[n]}`;
        for (let i = 0; i < a.length; i++) {
            if (i != n) rtn += `,${a[i]}`;
        }
        return rtn;
    }

    export function chooseStr(a: string[], n: number): string {
        if (n < 0 || n >= a.length) return '[]';
        let rtn = `'${a[n]}'`;
        for (let i = 0; i < a.length; i++) {
            if (i != n) rtn += `,'${a[i]}'`;
        }
        return rtn;
    }

    export function chooseWeek(n: number): string {
        if (n === undefined || isNaN(n) || n < 0) return 'undefined';
        n %= 7;
        let a: string[] = ['##0Sunday', '##6Monday', '##5Tuesday', '##4Wednesday', '##3Thursday', '##2Friday', '##1Saturday'];
        let rtn: string[] = [];
        rtn.push(`${a[n]}`);
        for (let i = 0; i < a.length; i++) {
            if (i != n) rtn.push(`${a[i]}`);
        }
        return rtn.join(';;');
    }

    export function generateRadio(a, n: number): string {
        if (n < 0 || n >= a.length) return ';;';
        let rtn = `${a[n]}`;
        for (let i = 0; i < a.length; i++) {
            if (i != n) rtn += `;;${a[i]}`;
        }
        return rtn;
    }

    export function gcd_(x: number, y: number): number {
        if (y === undefined) return x;
        if (x === undefined) return y;
        if (isNaN(x)) return x;
        if (isNaN(y)) return y;

        while (y != 0) {
            var z = x % y;
            x = y;
            y = z;
        }
        return x;
    }

    export function lcm_(x: number, y: number): number {
        return x * y / gcd_(x, y);
    }

    export function gcd(...args: number[]): number {
        var ret: number = args[0];
        for (var i = 1; i < args.length; i++) {
            ret = gcd_(ret, args[i]);
        }
        return ret;
    }

    export function lcm(...args: number[]): number {
        var ret: number = args[0];
        for (var i = 1; i < args.length; i++) {
            ret = lcm_(ret, args[i]);
        }
        return ret;
    }

    export function max(...args: number[]): number {
        var ret: number = args[0];
        for (var i = 1; i < args.length; i++) {
            ret = Math.max(ret, args[i]);
        }
        return ret;
    }


    export function min(...args: number[]): number {
        var ret: number = args[0];
        for (var i = 1; i < args.length; i++) {
            ret = Math.min(ret, args[i]);
        }
        return ret;
    }

    /// Permutation and combination
    export function F(n: number): number {
        if (isNaN(n)) return n;

        var f: number = 1;
        for (var i = 2; i <= n; i++) {
            f *= i;
        }
        return f;
    }

    export function P(n: number, m: number): number {
        if (isNaN(n)) return n;
        if (isNaN(m)) return m;
        var f: number = 1;
        for (var i = n - m + 1; i <= n; i++) {
            f *= i;
        }
        return f;
    }

    export function C(n: number, m: number): number {
        return P(n, m) / F(m);
    }

    // last digit of a^n
    export function ones(a: number, n: number): number {
        if (n == 0) return 1;
        if (a == 0 || a == 1 || a == 5 || a == 6) return a;
        if (a == 2) return [6, 2, 4, 8][n % 4];
        if (a == 3) return [1, 3, 9, 7][n % 4];
        if (a == 4) return [6, 4][n % 2];
        if (a == 7) return [1, 7, 9, 3][n % 4];
        if (a == 8) return [6, 8, 4, 2][n % 4];
        if (a == 9) return [1, 9][n % 2];
        return 0;
    }


    // Number
    export function num(...args: number[]): number {
        var n: number = 0;
        for (var i = 0; i < args.length; i++) {
            n = n * 10 + args[i];
        }
        return n;
    }

    // a: 0-9; 0->Zero, 1->One, ...
    export function Dstr(a: number): string {
        if (0 <= a && a <= 20) {
            return ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
                'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty'][a];
        }
        return '-';
    }

    // a: 0-9; 0->zero, 1->one, ...
    export function dstr(a: number): string {
        return Dstr(a).toLowerCase();
    }

    // a: 1-9; 1->First, ...
    export function Tstr(a: number): string {
        if (1 <= a && a <= 20) {
            return ['Fisrt', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth', 'Eleventh',
                'Twelveth', 'Thirteenth', 'Fourteenth', 'Fifteenth', 'Sixteenth', 'Seventeenth', 'Eighteenth', 'Nineteenth', 'Twentieth'][a - 1];
        }
        return '-';
    }

    // a: 2-9; 2->Twice, ...
    export function Mstr(a: number): string {
        if (a == 2) return 'Twice';
        return a > 2 ? `${oe.Dstr(a)} times` : '-';
    }

    // a: 2-9; 2->twice, ...
    export function mstr(a: number): string {
        return Mstr(a).toLowerCase();
    }

    // a: 2-9; 2->Half, ...
    export function Mstr2(a: number): string {
        if (a == 2) return 'Half';
        return a > 2 ? `One ${oe.Tstr(a)}` : '-';
    }

    // a: 2-9; 2->half, ...
    export function mstr2(a: number): string {
        return Mstr2(a).toLowerCase();
    }

    // a: 1-9; 1->First, ...
    export function tstr(a: number): string {
        return Tstr(a).toLowerCase();
    }

    // ones digit
    export function d1(a: number): number {
        if (a == undefined || isNaN(a)) return a;
        return a % 10;
    }
    export function d2(a: number): number {
        if (a == undefined || isNaN(a)) return a;
        return Math.floor(a / 10) % 10;
    }
    export function d3(a: number): number {
        if (a == undefined || isNaN(a)) return a;
        return Math.floor(a / 100) % 10;
    }
    export function d4(a: number): number {
        if (a == undefined || isNaN(a)) return a;
        return Math.floor(a / 1000) % 10;
    }
    export function d5(a: number): number {
        if (a == undefined || isNaN(a)) return a;
        return Math.floor(a / 10000) % 10;
    }
    export function d6(a: number): number {
        if (a == undefined || isNaN(a)) return a;
        return Math.floor(a / 100000) % 10;
    }
    export function d7(a: number): number {
        if (a == undefined || isNaN(a)) return a;
        return Math.floor(a / 1000000) % 10;
    }
    export function d8(a: number): number {
        if (a == undefined || isNaN(a)) return a;
        return Math.floor(a / 10000000) % 10;
    }
    export function d9(a: number): number {
        if (a == undefined || isNaN(a)) return a;
        return Math.floor(a / 100000000) % 10;
    }

    export function ngon(a: number): string {
        if (a >= 3 && a <= 10)
            return ['triangle', 'quadrilateral', 'pentagon', 'hexagon', 'heptagon', 'octagon', 'nanogon', 'decagon'][a - 3];
        return '-';
    }

    export function card(c?: number): string {
        if (c == undefined || isNaN(c)) c = oe.rand(4);
        if (c < 0 || c > 3) return 'undefined';
        return ['spade', 'diamond', 'heart', 'club'][c];
    }
    // 1:A, 13-King
    export function cardName(a: number): string {
        if (a == undefined || isNaN(a) || a < 1 || a > 13) return 'undefined';
        if (2 <= a && a <= 10) return oe.dstr(a);
        if (a == 1) return 'ace';
        if (a == 11) return 'jack';
        if (a == 12) return 'queen';
        return 'king';
    }

    // the chance of sum of rolling dice (over 36)
    export function dice2(a: number): number {
        if (a < 2 || a > 12) return 0;
        return [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1][a - 2];
    }

    // the chance of sum of rolling dice (over 36)
    export function dice3(a: number): number {
        if (a < 3 || a > 18) return 0;
        return [1, 3, 6, 10, 15, 21, 25, 27, 27, 25, 21, 15, 10, 6, 3, 1][a - 3];
    }

    export function cos(x: number): number {
        return Math.cos(x * Math.PI / 180);
    }

    export function sin(x: number): number {
        return Math.sin(x * Math.PI / 180);
    }

    export function round(value: number, decimals: number): string {
        if (decimals == undefined) decimals = 0;
        //        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
        return value.toFixed(decimals);
    }
    export function round0(value: number): string { return oe.round(value, 0); }
    export function round1(value: number): string { return oe.round(value, 1); }
    export function round2(value: number): string { return oe.round(value, 2); }
    export function round3(value: number): string { return oe.round(value, 3); }

    export function norm(a: number): string {
        var n: number = 0;
        while (Math.abs(a - parseFloat(oe.round(a, n))) > 1e-8) n++;
        return oe.round(a, n)
    }

    // prefix 0's until a is n-digit. n is default to 2.
    export function pre0(a: number, n: number): string {
        if (isNaN(a)) return 'NaN';
        if (a == undefined) return 'undefined';
        if (n == undefined || isNaN(n)) n = 2;
        let d: number = 0, c: number = 1;
        for (; a >= c; c *= 10, ++d);
        let s: string = '';
        for (; d < n; d++) s += '0';
        return s + a;
    }

    export function money(m: number): string {
        return m.toFixed(2);
    }

    export function ratio(a: number, b: number): string {
        if (a <= 0 || b <= 0) return '';
        let g = oe.gcd(a, b);
        return `${a / g} : ${b / g}`;
    }

    export function reverse(str: string): string {
        return str.split("").reverse().join("");
    }

    export function comma(a: number): string {
        return (a + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }

    export function rf(a: number, b: number): string {
        if (isNaN(a)) return `${a}`;
        if (isNaN(b)) return `${b}`;
        var pos: number = 1;
        if (a < 0) { pos = 1 - pos; a = -a; }
        if (b < 0) { pos = 1 - pos; b = -b; }
        var g: number = gcd(a, b);
        return ['-', ''][pos] + (b == g ? a / g : a / g + "/" + b / g);
    }

    // return string representation of reduced fraction a/b, using \over
    export function rfm(a: number, b: number): string {
        if (isNaN(a)) return `${a}`;
        if (isNaN(b)) return `${b}`;
        var pos: number = 1;
        if (a < 0) { pos = 1 - pos; a = -a; }
        if (b < 0) { pos = 1 - pos; b = -b; }
        var g: number = gcd(a, b);
        return '{' + ['-', ''][pos] + (b == g ? a / g : (a / g + " \\over " + b / g)) + '}';
    }

    // a: '1/2', b:'2/3'
    function fracAdd_(a: string, b: string, flag: boolean): string {
        if (a == undefined || b == undefined) return 'undefined';
        if (a.length == 0) return b;
        if (b.length == 0) return a;

        let m1: number, n1: number, m2: number, n2: number;
        let idx: number = a.indexOf('/');
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
    export function fracAdd(a: string, b: string): string {
        return fracAdd_(a, b, true);
    }
    export function fracSub(a: string, b: string): string {
        return fracAdd_(a, b, false);
    }

    export function fracComp(m1: number, n1: number, m2: number, n2: number): number {
        if (m1 == undefined || n1 == undefined || m2 == undefined || n2 == undefined) return NaN;
        if (isNaN(m1) || isNaN(n1) || isNaN(m2) || isNaN(n2) || n1 == 0 || n2 == 0) return NaN;
        let diff: number = m1 * n2 - m2 * n1;
        if (diff == 0) return 0;
        if (n1 * n2 < 0) return diff > 0 ? -1 : 1;
        return diff < 0 ? -1 : 1;
    }

    export function sci(n: number): number[] {
        if (n == undefined || isNaN(n)) return [NaN, NaN];
        let d = 0;
        while (n >= 10) {
            n /= 10;
            d++;
        }
        return [n, d];
    }

    export function weekday(a: number): string {
        if (0 <= a && a <= 7) {
            return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][a];
        }
        return '';
    }

    export function month(a: number): string {
        if (1 <= a && a <= 12) {
            return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novermber', 'December'][a - 1];
        }
        return '';
    }

    export function month_abbr(a: number): string {
        if (1 <= a && a <= 12) {
            return ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'][a - 1];
        }
        return '';
    }

    export function hypo(a: number, b: number): number {
        return Math.sqrt(a * a + b * b);
    }
    export function hypo2(a: number, b: number): number {
        return a * a + b * b;
    }

    export function log(b: number, n: number): number {
        return Math.log(n) / Math.log(b);
    }

    // return a list of primes in [min, max]
    export function prime(min: number, max?: number): number[] {
        let pr: number[] = [];
        if (min == undefined || isNaN(min)) return pr;
        if (max == undefined || isNaN(max)) {
            max = min;
            min = 1;
        }
        if (min <= 0 || max < 2 || min > max) return pr;

        let prime_numbers: number[] = [
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
        let i = 0;
        for (; i < prime_numbers.length && prime_numbers[i] < min; i++);
        for (; i < prime_numbers.length && prime_numbers[i] <= max; i++) pr.push(prime_numbers[i]);
        return pr;
    }

    export function randPrime(min: number, max?: number): number {
        if (min == undefined || isNaN(min)) return NaN;
        if (max == undefined || isNaN(max)) {
            max = min;
            min = 1;
        }
        if (min <= 0 || max < 2 || min > max) return NaN;
        let pc = oe.prime(min, max);
        return pc[oe.rand(pc.length)];
    }

    // i: [0-8] return a pythagorean triple
    export function pnum(i: number): number[] {
        let pns: number[][] =
            [[3, 4, 5],
                [5, 12, 13],
                [7, 24, 25],
                [9, 40, 41],
                [11, 60, 61],
                [13, 84, 85],
                [8, 15, 17],
                [12, 35, 37],
                [16, 63, 65]];
        if (i == undefined || isNaN(i) || i < 0 || i > 8) return pns[0];
        return pns[i];
    }

    // 1, 5, 10, 25
    export function coin(n: number): number[] {
        let r: number[] = [];
        if (n > 100) return r;
        for (let i = 0; i <= n; i++) {
            for (let j = 0; j <= n - i; j++) {
                for (let k = 0; k <= n - i - j; k++) {
                    let l = n - i - j - k;
                    let v: number = i * 25 + j * 10 + k * 5 + l;
                    if ($.inArray(v, r) == -1) r.push(v);
                }
            }
        }
        return r.sort(function (a, b) { return a - b; });
    }

    // how many different ways to give different <books> books to <ppl> people
    // ppl <= books <= 6
    // dynamic programming
    export function waysGiveBooks(ppl: number, books: number): number {
        if (ppl == undefined || books == undefined || isNaN(ppl) || isNaN(books)) return NaN;
        if (books > 6 || ppl > books) return 0;
        let ar: number[][] = [
            [1, 1, 1, 1, 1, 1],
            [0, 2, 6, 14, 30, 62],
            [0, 0, 6, 36, 150, 540],
            [0, 0, 0, 24, 240, 1560],
            [0, 0, 0, 0, 120, 1800],
            [0, 0, 0, 0, 0, 720]
        ];
        return ar[ppl - 1][books - 1];
    }

    // y = ax + b
    export function formulaLine(a: number, b: number): string {
        if (a == undefined || b == undefined || isNaN(a) || isNaN(b)) return 'undefined';
        let r = 'y = ';

        if (a == -1) {
            r += `-x`;
        }
        else if (a == 1) {
            r += `x`;
        }
        else if (a < 0) {
            r += `-${-a}x`;
        }
        else if (a > 0) {
            r += `${a}x`;
        }

        if (a == 0) {
            r += `${-b}`;
        }
        else if (b < 0) {
            r += ` - ${-b}`;
        }
        else if (b > 0) {
            r += ` + ${b}`;
        }

        return r;
    }

    export function composite(start: number): number {
        if (start == undefined || isNaN(start)) return start;
        if (start >= 990) return 987;
        let arr: number[] = oe.prime(1, 1000);
        let x: number = start;
        while (arr.indexOf(x) >= 0 || (x % 5 == 0)) x += 2;
        return x;
    }

    // covert b-based number x to 10-based number
    export function base10(x: number, b: number): number {
        if (x == undefined || b == undefined || isNaN(x) || isNaN(b) || b <= 1) return undefined;
        let mul: number = 1;
        let rlt: number = 0;
        while (x) {
            rlt += mul * (x % 10);
            mul *= b;
            x = Math.floor(x / 10);
        }
        return rlt;
    }

    // covert 10-based number x to b-based number
    export function baseX(x: number, b: number): number {
        if (x == undefined || b == undefined || isNaN(x) || isNaN(b) || b <= 1) return undefined;
        let mul: number = 1;
        let rlt: number = 0;
        while (x) {
            rlt += mul * (x % b);
            mul *= 10;
            x = Math.floor(x / b);
        }
        return rlt;
    }

    // return a lisst of primes in [min, max]
    export function primeCount(min: number, max: number): number {
        return oe.prime(min, max).length;
    }

    export function isPrime(a: number): boolean {
        if (a <= 1) return false;

        for (let i = Math.floor(Math.sqrt(a)); i >= 2; i--) {
            if (a % i == 0) return false;
        }
        return true;
    }

    // make an array has a mode, i.e. most frequent number
    export function modable(a: number[]): string {
        if (a == undefined) return 'undefined';
        let mmap: { [k: number]: number } = {};
        for (let i = 0; i < a.length; i++) mmap[a[i]] = 0;
        for (let i = 0; i < a.length; i++) mmap[a[i]]++;
        let mcnt = 0, mnum = 0
        $.each(mmap, function (k, v) {
            if (mcnt < v) {
                mcnt = v;
                mnum = k;
            }
        });
        for (let i = 0; i < a.length; i++) {
            if (a[i] != mnum && mmap[a[i]] == mcnt) {
                let cln = a.slice(0);
                cln[i] = mnum;
                return cln.join(',');
            }
        }

        return a.join(',');
    }

    export function mode(a: number[]): number {
        if (a == undefined) return NaN;
        let mmap: { [k: number]: number } = {};
        for (let i = 0; i < a.length; i++) mmap[a[i]] = 0;
        for (let i = 0; i < a.length; i++) mmap[a[i]]++;
        let mcnt = 0, mnum = 0
        $.each(mmap, function (k, v) {
            if (mcnt < v) {
                mcnt = v;
                mnum = k;
            }
        });
        return mnum;
    }

    export function median(a: number[]): number {
        if (a == undefined || a.length <= 0) return NaN;
        let sa = a.sort(function (x: number, y: number) {
            return x - y;
        });
        return (a[Math.floor(a.length / 2)] + a[Math.floor((a.length - 1) / 2)]) / 2;
    }

    export function range(a: number[]): number {
        if (a == undefined) return NaN;
        if (a.length <= 0) return 0;
        let sa = a.sort(function (x: number, y: number) {
            return x - y;
        });
        return a[a.length - 1] - a[0];
    }

    export function mean(a: number[]): number {
        if (a == undefined) return NaN;
        if (a.length <= 0) return 0;
        let s: number = 0;
        for (let i = 0; i < a.length; i++) {
            s += a[i];
        }
        return s / a.length;
    }

    // integer divid
    export function div(m: number, n: number): number {
        if (m == undefined) return m;
        if (n == undefined) return n;
        if (isNaN(m) || isNaN(m)) return NaN;
        return Math.floor(m / n);
    }


    export function leapYear(year) {
        return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    }

    export function join(x: any[]): string {
        if (x == undefined) return 'undefined';

        if (x.length == 0) return '';
        if (x.length == 1) return `${x[0]}`;
        if (x.length == 2) return `${x[0]} and ${x[1]}`;
        return `${x.slice(0, x.length - 1).join(", ")}, and ${x[x.length - 1]}`;
    }

    export function p2cx(x: number, y: number, r: number, degree: number): number {
        if (x == undefined || y == undefined || degree == undefined) return undefined;
        if (isNaN(x) || isNaN(y) || isNaN(degree)) return undefined;
        return x + r * Math.cos(degree * Math.PI / 180);
    }

    export function p2cy(x: number, y: number, r: number, degree: number): number {
        if (x == undefined || y == undefined || degree == undefined) return undefined;
        if (isNaN(x) || isNaN(y) || isNaN(degree)) return undefined;
        return y + r * Math.sin(degree * Math.PI / 180);
    }

    export function arrow_arc(ctx: any, x: number, y: number, r: number, start: number, degree: number, ar?: number): void {
        if (ctx == undefined || x == undefined || y == undefined || r == undefined || start == undefined || degree == undefined) return;
        if (isNaN(x) || isNaN(y) || isNaN(r) || isNaN(start) || isNaN(degree)) return;
        let ccw: boolean = degree <= 0 ? true : false;
        if (ccw == undefined) ccw = false;
        if (ar == undefined) ar = 5;

        let alpha: number = start + degree;
        let beta = ccw ? (45 + alpha) : 180 + 45 + alpha;
        ctx.moveTo(p2cx(x, y, r, start), p2cy(x, y, r, start));
        ctx.arc(x, y, r, start * Math.PI / 180, alpha * Math.PI / 180, ccw);
        x = p2cx(x, y, r, alpha);
        y = p2cy(x, y, r, alpha);
        ctx.moveTo(x, y);
        ctx.lineTo(x + ar * Math.cos(beta * Math.PI / 180), y + ar * Math.sin(beta * Math.PI / 180));
        ctx.moveTo(x, y);
        ctx.lineTo(x + ar * Math.cos((90 + beta) * Math.PI / 180), y + ar * Math.sin((90 + beta) * Math.PI / 180));
    }

    export function arrow_h(ctx: any, x: number, y: number, len: number, ar?: number): void {
        if (ctx == undefined || x == undefined || y == undefined || len == undefined ) return;
        if (isNaN(x) || isNaN(y) || isNaN(len)) return;
        if (ar == undefined) ar = 5;

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

    export function arrow_v(ctx: any, x: number, y: number, len: number, ar?: number): void {
        if (ctx == undefined || x == undefined || y == undefined || len == undefined) return;
        if (isNaN(x) || isNaN(y) || isNaN(len)) return;
        if (ar == undefined) ar = 5;

        ctx.moveTo(x, y);
        y += len;
        ctx.lineTo(x, y);
        if (len > 0) {
            ctx.lineTo(x - ar, y - ar);
            ctx.moveTo(x, y+len);
            ctx.lineTo(x + ar, y - ar);
        }
        else {
            ctx.lineTo(x - ar, y + ar);
            ctx.moveTo(x, y);
            ctx.lineTo(x + ar, y + ar);
        }
    }

    export function arc_bar(ctx: any, x: number, y: number, r: number, d: number, len?: number): void {
        if (ctx == undefined || x == undefined || y == undefined || r==undefined || d == undefined) return;
        if (isNaN(x) || isNaN(y) || isNaN(r) || isNaN(d)) return;
        if (len == undefined || isNaN(len)) len = 2;
        ctx.moveTo(oe.p2cx(x, y, r - len, d), oe.p2cy(x, y, r - len, d));
        ctx.lineTo(oe.p2cx(x, y, r + len, d), oe.p2cy(x, y, r + len, d));
    }

    export function right_angle(ctx: any, x: number, y: number, ang: number, len?: number): void {
        if (ctx == undefined || x == undefined || y == undefined || ang == undefined) return;
        if (isNaN(x) || isNaN(y) || isNaN(ang)) return;
        if (len == undefined || isNaN(len)) len = 8;
        let d: number = ang;
        ctx.moveTo(oe.p2cx(x, y, len, d), oe.p2cy(x, y, len, d));
        ctx.lineTo(oe.p2cx(x, y, len * Math.sqrt(2), d + 45), oe.p2cy(x, y, len * Math.sqrt(2), d + 45));
        ctx.lineTo(oe.p2cx(x, y, len, d + 90), oe.p2cy(x, y, len, d + 90));
    }

    export function arc(ctx: any, x: number, y: number, r: number, s: number, e: number, c?: boolean): void {
        if (ctx == undefined || x == undefined || y == undefined || r == undefined || s == undefined || e == undefined) return;
        if (isNaN(x) || isNaN(y) || isNaN(r) || isNaN(s) || isNaN(e)) return;
        if (c == undefined) c = false;
        ctx.arc(x, y, r, s * Math.PI / 180, e * Math.PI / 180, c);
    }

    export function circle(ctx: any, x: number, y: number, r: number, c?: boolean): void {
        if (ctx == undefined || x == undefined || y == undefined || r == undefined) return;
        if (isNaN(x) || isNaN(y) || isNaN(r)) return;
        if (c == undefined) c = false; // bu default, don't draw center point
        if (c) {
            ctx.moveTo(x, y);
            ctx.arc(x, y, 1, 0, 2* Math.PI);
            ctx.moveTo(x + r, y);
        }
        ctx.arc(x, y, r, 0, 2 * Math.PI);
    }

    // paint a mark on a line
    export function mark(ctx: any, x1: number, y1: number, x2: number, y2: number, n?: number, len?: number, gap?: number): void {
        if (ctx == undefined || x1 == undefined || y1 == undefined || x2 == undefined || y2 == undefined) return;
        if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) return;
        if (n == undefined || isNaN(n)) n = 1;
        if (len == undefined || isNaN(len)) len = 6;
        if (gap == undefined || isNaN(gap)) gap = 5;

        let dx: number = x2 - x1;
        let dy: number = y2 - y1;
        let p: number = Math.sqrt(dx * dx + dy * dy);
        let rx: number = dx / p;
        let ry: number = dy / p;
        let x: number = (x1 + x2) / 2 - (n - 1) * gap*rx / 2;
        let y: number = (y1 + y2) / 2 - (n - 1) * gap*ry / 2;
        for (let i: number = 0; i < n; i++) {
            ctx.moveTo(x - ry * len, y + rx * len);
            ctx.lineTo(x + ry * len, y - rx * len);
            x += gap * rx;
            y += gap * ry;
        }
    }


    // paint a mark on an arc
    export function mark_arc(ctx: any, x: number, y: number, r: number, s: number, e: number, n?: number, len?: number, gap?: number): void {
        if (ctx == undefined || x == undefined || y == undefined || r == undefined || s == undefined || e == undefined) return;
        if (isNaN(x) || isNaN(y) || isNaN(r) || isNaN(s) || isNaN(e)) return;
        if (n == undefined || isNaN(n)) n = 1;
        if (len == undefined || isNaN(len)) len = 6;
        if (gap == undefined || isNaN(gap)) gap = 3;

        let d: number = (s + e) / 2 - (n - 1) * gap / 2;
        for (let i: number = 0; i < n; i++) {
            arc_bar(ctx, x, y, r, d, len);
            d += gap;
        }
    }

    /////////////////////////
    // three.js
    /////////////////////////
    export function material(op: number): any {
        if (op == undefined || op == 1) {
            return new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
        }
        else {
            return new THREE.MeshNormalMaterial({ transparent: true, opacity: op, side: THREE.DoubleSide });
        }
    }

    export function sphere(x: number, y: number, z: number, r: number, op: number) {
        var geometry = new THREE.SphereGeometry(r, 50, 50);
        var cube = new THREE.Mesh(geometry, material(op));
        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;
        return cube;
    }

    export function cube2(x: number, y: number, z: number, d1: number, d2: number, d3: number, op: number) {
        var geometry = new THREE.BoxGeometry(d1, d2, d3);
        var cube = new THREE.Mesh(geometry, material(op));
        cube.position.x = x + d1 / 2;
        cube.position.y = y + d2 / 2;
        cube.position.z = z + d3 / 2;
        return cube;
    }
    export function cube(x: number, y: number, z: number, d: number, op: number) {
        return oe.cube2(x, y, z, d, d, d, op);
    }

    export function colorCube2(x: number, y: number, z: number, d1: number, d2: number, d3: number, clr: number, op: number) {
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
    export function colorCube(x: number, y: number, z: number, d: number, clr: number, op: number) {
        return oe.colorCube2(x, y, z, d, d, d, clr, op);
    }

    export function rgbCube2(x: number, y: number, z: number, d1: number, d2: number, d3: number, clr: string, op: number) {
        var geometry = new THREE.BoxGeometry(d1, d2, d3);
        var xx = '';
        for (var i = 0; i < geometry.faces.length; i += 2) {
            var color = 0xffffff;
            xx += '' + i + '=' + clr[(i / 2) % clr.length] + ',';
            switch (clr[(i / 2) % clr.length]) {
                case 'r':
                    color = 0xff0000; break;
                case 'g':
                    color = 0x00ff00; break;
                case 'b':
                    color = 0x0000ff; break;
                case 'y':
                    color = 0xffff00; break;
                case 'p':
                    color = 0x00ffff; break;
                case 'B':
                    color = 0x000000; break;
                case 'W':
                    color = 0xffffff; break;
                case 'G':
                    color = 0x7f7f7f; break;
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
    export function rgbCube(x: number, y: number, z: number, d: number, clr: string, op: number) {
        return oe.rgbCube2(x, y, z, d, d, d, clr, op);
    }


    export function cone(x: number, y: number, z: number, r: number, h: number, op: number) {
        var geometry = new THREE.ConeGeometry(r, h, 50, 50);
        var cone = new THREE.Mesh(geometry, oe.material(op));
        cone.position.x = x;
        cone.position.y = y + h / 2;
        cone.position.z = z;
        return cone;
    }

    export function cylinder(x: number, y: number, z: number, r1: number, r2: number, h: number, op: number, open: boolean) {
        if (open == undefined) open = false;
        var geometry = new THREE.CylinderGeometry(r1, r2, h, 50, 50, open);
        var cone = new THREE.Mesh(geometry, oe.material(op));
        cone.position.x = x;
        cone.position.y = y + h / 2;
        cone.position.z = z;
        return cone;
    }

    export function polyCylinder(x: number, y: number, z: number, n: number, r1: number, r2: number, h: number, op: number) {
        var geometry = new THREE.CylinderGeometry(r1, r2, h, n, 50);
        var cone = new THREE.Mesh(geometry, oe.material(op));
        cone.position.x = x;
        cone.position.y = y + h / 2;
        cone.position.z = z;
        return cone;
    }

    export function animate(renderer, scene, camera, controls, tball) {
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

    export function three(container, callback) {
        let scene = new THREE.Scene();

        let camera = new THREE.PerspectiveCamera(45, container.width() / container.height(), 1, 1000);
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
            let tball = new THREE.TrackballControls(camera, renderer.domElement);
            let controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.5;
            controls.enableZoom = false;

            animate(renderer, scene, camera, controls, tball);
        }
        else {
            renderer.render(scene, camera);
        }
    }

};
