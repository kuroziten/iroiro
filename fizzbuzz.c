#ifndef __bool_true_false_are_defined
#define __bool_true_false_are_defined   1
 
#ifndef __cplusplus
 
#define false   0
#define true    1
 
#define bool    _Bool
#if __STDC_VERSION__ < 199901L && __GNUC__ < 3 && !defined(__INTEL_COMPILER)
typedef int     _Bool;
#endif
 
#endif /* !__cplusplus */
#endif /* __bool_true_false_are_defined */

#include <stdio.h>

int main(void) {
	int input = 30;
	bool r = false;
	int f = 3;
	bool fflug = false;
	int b = 5;
	bool bflug = false;
	int i;
	for (i = 1; i <= 1000; i = i + 1)
	{
		if ((i * f) == input)
		{
			fflug = true;
		}
		if ((i * b) == input)
		{
			bflug = true;
		}
		if (fflug)
		{
			if (bflug)
			{
				i = 1000;
			}
		}
	}
	if (fflug)
	{
		if (bflug)
		{
			printf("fizzbuzz");
		} else {
			printf("fizz");
		}
	} else {
		if (bflug)
		{
			printf("buzz");
		} else {
			printf("out");
		}
	}
	
	return 0;
}
