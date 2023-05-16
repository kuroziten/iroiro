/*
ぺるさんのモンテカルロ！
*/

#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define ARR_MAX 4

double generate_random_number() {
    double res;
    do {
        res = (double) rand() / RAND_MAX;
    } while ( res == 0.0 || res == 1.0 );
    return res;
}

double monte_ccarlo(int n) {
    double x, y;
    int i = 0;
    int j = 0;
    
    srand(time(NULL));
    
    do {
        x = generate_random_number();
        y = generate_random_number();
        if ( x * x + y * y < 1.0 ) {
            i++;
        }
    } while ( j++ < n );
    return 4.0 * i / n;
}

int main(void) {
    int n[ARR_MAX] = { 10, 1000, 100000, 10000000 };
    for ( int i = 0; i < ARR_MAX; i++ ) {
        printf("%f\n", monte_ccarlo(n[i]));
    }
    return 0;
}
