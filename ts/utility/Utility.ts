namespace oe {

    export function rand(n: number): number {
        return ((Math.random() * 100000000) % n) >> 0;
    }

    export function shuffle(a) {
        let j, x, i;
        for (i = a.length; i; i -= 1) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
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


    // Number
    export function num(...args: number[]): number {
        var n: number = 0;
        for (var i = 0; i < args.length; i++) {
            n = n * 10 + args[i];
        }
        return n;
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
};
