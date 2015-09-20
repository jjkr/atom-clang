#include <iostream>

int fib(int n)
{
    if (n < 2)
    {
        return n;
    }
    else
    {
        return fib(n - 2) + fib(n - 1);
    }
}

int main() { std::cout << "fib(5)" << fib(5) << std::endl; }
