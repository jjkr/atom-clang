#include <clang-c/Index.h>
#include <iostream>

using namespace std;

int main()
{
    auto index = clang_createIndex(0, 0);
    cout << "index " << index << endl;
    return 0;
}
