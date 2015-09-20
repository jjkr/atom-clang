cmake_minimum_required(VERSION 3.0)
project(test_clang C CXX)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -isystem/usr/local/Cellar/llvm/3.6.1/include -std=c++14 -Wall -Wextra -pedantic")
set(CMAKE_CXX_FLAGS_DEBUG "${CMAKE_CXX_FLAGS_DEBUG} -g")
set(CMAKE_CXX_FLAGS_RELEASE "${CMAKE_CXX_FLAGS_RELEASE} -O3")

add_executable(test_clang test_clang.cpp)
target_link_libraries(test_clang clang)
