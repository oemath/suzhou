namespace oe {

    export function rand(n: number): number {
        return ((Math.random() * 100000000) % n) >> 0;
    }

    export function shuffle(a, len: number) {
        let j, x, i;
        for (i = len; i; i -= 1) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
    }

    export function shuffle2(a) {
        shuffle(a, a.length);
    }

    export function gcd_(x: number, y: number): number {
        if (y === undefined) return x;
        if (x === undefined) return 1;

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
        var f: number = 1;
        for (var i = 2; i <= n; i++) {
            f *= i;
        }
        return f;
    }

    export function P(n: number, m: number): number {
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
        if (a == 0 || a==1 || a==5 || a==6) return a;
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

    // a: 0-9; 0->zero, 1->one, ...
    export function dstr(a: number): string {
        if (0 <= a && a <= 9) {
            return ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'][a];
        }
    }

    // a: 0-9; 0->Zero, 1->One, ...
    export function Dstr(a: number): string {
        if (0 <= a && a <= 9) {
            return ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'][a];
        }
    }

    export function card(): string {
        return ['heart', 'spade', 'diamond', 'club'][oe.rand(4)];
    }

    // the chance of sum of rolling dice (over 36)
    export function dice2(a: number): number {
        if (a < 2 || a > 12) return 0;
        return [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1][a - 2];
    }

    export function cos(x: number): number {
        return Math.cos(x * Math.PI / 180);
    }

    export function sin(x: number): number {
        return Math.sin(x * Math.PI / 180);
    }

    export function round(value: number, decimals: number): string {
        //        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
        return value.toFixed(decimals);
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
        var pos: number = 1;
        if (a < 0) { pos = 1 - pos; a = -a; }
        if (b < 0) { pos = 1 - pos; b = -b; }
        var g: number = gcd(a, b);
        return ['-', ''][pos] + (b == g ? a / g : a / g + "/" + b / g);
    }

    // return string representation of reduced fraction a/b, using \over
    export function rfm(a: number, b: number): string {
        var pos: number = 1;
        if (a < 0) { pos = 1 - pos; a = -a; }
        if (b < 0) { pos = 1 - pos; b = -b; }
        var g: number = gcd(a, b);
        return '{' + ['-', ''][pos] + (b == g ? a / g : (a / g + " \\over " + b / g)) + '}';
    }

    export function weekday(a: number): string {
        if (0 <= a && a <= 6) {
            return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][a];
        }
        return '';
    }

    export function month(a: number): string {
        if (1 <= a && a <= 12) {
            return ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novermber', 'December'][a-1];
        }
        return '';
    }

    export function month_abbr(a: number): string {
        if (1 <= a && a <= 12) {
            return ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'][a-1];
        }
        return '';
    }
};
