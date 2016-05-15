function rand(n: number) : number {
    return ((Math.random() * 100000000) % n) >> 0;
}
