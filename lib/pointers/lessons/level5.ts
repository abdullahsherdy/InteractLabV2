import type { Level } from "../types";
import { lesson, v, p, set, point, free } from "../authoring";

export const level5: Level = {
  level: 5,
  slug: "arrays-and-arithmetic",
  title: "Arrays and pointer arithmetic",
  description:
    "Move within an array, carry its size, and match array allocation with cleanup.",
  prerequisite: "Level 4 · dynamic lifetime and cleanup",
  lessons: [
    lesson({
      id: "5.1",
      title: "Array decay and the first element",
      hook: "Is an array itself a pointer, or can it convert to one?",
      steps: [
        [
          "int a[3] = {4, 7, 9};",
          "The array is one object containing three adjacent integers. The drawing uses a hypothetical 4-byte int.",
          [
            v("a[0]", "4", "stack", 1000, "a"),
            v("a[1]", "7", "stack", 1004, "a"),
            v("a[2]", "9", "stack", 1008, "a"),
          ],
        ],
        [
          "int* p = a;",
          "In this expression, the array converts to a pointer to its first element.",
          [p("p", "a[0]")],
        ],
        [
          "int first = *p;",
          "Dereferencing p reads the first element, a[0].",
          [v("first", "4", "stack", 1080)],
        ],
      ],
      predict: ["What is first?", "4", "p identifies a[0]."],
      trace: [
        "Is p == &a[0] true?",
        "true",
        "Array-to-pointer conversion produces that address.",
      ],
      bug: [
        "Is “an array is a pointer” an accurate rule?",
        "No; an array and a pointer are different types of objects.",
        "Conversion happens in many expressions; sizeof(a) and &a preserve array information.",
      ],
      draw: [
        "Draw a and p.",
        "Three contiguous integer cells; p points to the first.",
        "The array’s elements are not separate allocations.",
      ],
      takeaway:
        "An array is not a pointer; it converts to a pointer to its first element in many expressions.",
      verify: 'std::cout << first << " " << std::boolalpha << (p == &a[0]);',
      expected: "4 true",
    }),
    lesson({
      id: "5.2",
      title: "Move by elements, within bounds",
      hook: "Does adding 1 to int* mean moving one byte?",
      optional: true,
      steps: [
        [
          "int a[3] = {4, 7, 9};",
          "Array elements are contiguous. The illustrative addresses assume sizeof(int) is 4.",
          [
            v("a[0]", "4", "stack", 1000, "a"),
            v("a[1]", "7", "stack", 1004, "a"),
            v("a[2]", "9", "stack", 1008, "a"),
          ],
        ],
        ["int* p = a;", "Start at the first element.", [p("p", "a[0]")]],
        [
          "p = p + 1;",
          "Advance by one element, to a[1]. Real byte distance is sizeof(int), which is platform-dependent.",
          [point("p", "a[1]")],
        ],
        [
          "int value = *p;",
          "Read the second element through the advanced pointer.",
          [v("value", "7", "stack", 1080)],
        ],
      ],
      predict: [
        "What does *p read?",
        "7",
        "p identifies a[1], not an arbitrary byte.",
      ],
      trace: [
        "What is p - a?",
        "1",
        "Subtraction within the same array measures an element distance.",
      ],
      bug: [
        "May *(a + 3) be read here?",
        "No; a + 3 is one past the end and must not be dereferenced.",
        "Forming one-past is allowed; forming pointers beyond that bound is not.",
      ],
      draw: [
        "Draw p after adding 1.",
        "p points to a[1] at illustrative address 1004.",
        "a[i] and *(a + i) select the same element for valid indices.",
      ],
      takeaway:
        "Pointer arithmetic moves in elements and stays within one array or its one-past position.",
      verify: 'std::cout << value << " " << (p - a);',
      expected: "7 1",
    }),
    lesson({
      id: "5.4",
      title: "Dynamic arrays need delete[]",
      hook: "How does the program release all elements of a dynamically allocated array?",
      steps: [
        [
          "int* a = new int[3]{4, 7, 9};",
          "Allocate one array containing three initialized integers.",
          [
            v("a[0]", "4", "heap", 2000, "a"),
            v("a[1]", "7", "heap", 2004, "a"),
            v("a[2]", "9", "heap", 2008, "a"),
            p("a", "a[0]"),
          ],
        ],
        [
          "int value = a[1];",
          "Indexing reads the second element. The owner pointer still holds the original array address.",
          [v("value", "7", "stack", 1080)],
        ],
        [
          "delete[] a; a = nullptr;",
          "Release the entire array with delete[], then clear the owning pointer.",
          [free("a[0]"), point("a", null)],
        ],
      ],
      predict: [
        "Which elements are released?",
        "All three elements.",
        "delete[] matches the array allocation as a whole.",
      ],
      trace: [
        "What is value after cleanup?",
        "7",
        "The copied integer has independent storage.",
      ],
      bug: [
        "Can delete a replace delete[] a?",
        "No; mismatching new[] and delete is undefined behavior.",
        "Match new with delete and new[] with delete[].",
      ],
      draw: [
        "Draw the state after release.",
        "All array elements are freed; a is null; value contains 7.",
        "Never release an interior pointer such as a + 1.",
      ],
      takeaway:
        "Keep the original array address and match new[] with delete[].",
      verify: "std::cout << value;",
      expected: "7",
    }),
    lesson({
      id: "5.3",
      title: "Array parameters lose the array extent",
      hook: "When an array is passed to a function, does the parameter remember its length?",
      prelude:
        "int sum(const int a[], int count) {\n  int total = 0;\n  for (int i = 0; i < count; ++i) total += a[i];\n  return total;\n}",
      steps: [
        [
          "int a[3] = {4, 7, 9};",
          "The caller has a real three-element array.",
          [
            v("a[0]", "4", "stack", 1000, "a"),
            v("a[1]", "7", "stack", 1004, "a"),
            v("a[2]", "9", "stack", 1008, "a"),
          ],
        ],
        [
          "int count = sizeof(a) / sizeof(a[0]);",
          "Here a still denotes the array for sizeof. Dividing its total byte size by an element’s size gives 3.",
          [v("count", "3", "stack", 1080)],
        ],
        [
          "int total = sum(a, count);",
          "An array parameter written a[] adjusts to a pointer parameter. Pass the valid element count separately.",
          [v("total", "20", "stack", 1096)],
        ],
      ],
      predict: [
        "What is total?",
        "20",
        "The function reads exactly 3 elements: 4 + 7 + 9.",
      ],
      trace: [
        "What is count in the caller?",
        "3",
        "The calculation occurs where a has array type.",
      ],
      bug: [
        "Why is sizeof(a) / sizeof(a[0]) wrong inside sum?",
        "There a is a pointer parameter, so sizeof(a) measures the pointer, not the array.",
        "The numeric sizes are platform-dependent.",
      ],
      draw: [
        "Draw the function’s view.",
        "A borrowed pointer to a[0], plus the separate count 3.",
        "The pointer itself carries no array length.",
      ],
      takeaway:
        "Array parameters behave as pointer parameters; pass the valid extent explicitly.",
      verify: 'std::cout << count << " " << total;',
      expected: "3 20",
    }),
    lesson({
      id: "5.5",
      title: "C-strings end at a null character",
      hook: "How does walking a char pointer know where a string ends?",
      steps: [
        [
          "char text[] = {'h', 'i', '\\0'};",
          "A C-string is a character array with a null terminator. The terminator is a character value, not a null pointer.",
          [
            v("text[0]", "'h'", "stack", 1000, "text"),
            v("text[1]", "'i'", "stack", 1001, "text"),
            v("text[2]", "'\\0'", "stack", 1002, "text"),
          ],
        ],
        [
          "char* p = text;",
          "Start at the first character.",
          [p("p", "text[0]")],
        ],
        ["++p;", "Advance one char to i.", [point("p", "text[1]")]],
        [
          "++p;",
          "The cursor now identifies the terminator. A string walk checks the character before processing another letter.",
          [point("p", "text[2]")],
        ],
      ],
      predict: [
        "Does p now equal nullptr?",
        "No; p points to a real array element whose value is the null character.",
        "A zero character and a null pointer are different things.",
      ],
      trace: [
        "How many letters precede the terminator?",
        "2",
        "The terminator is not part of the visible text.",
      ],
      bug: [
        "What is wrong with char s[2] = {'h', 'i'} when used as a C-string?",
        "There is no null terminator within the array.",
        "A C-string operation may read beyond the bounds: undefined behavior.",
      ],
      draw: [
        "Draw the final cursor.",
        "p → text[2], containing the null character.",
        "The cursor itself remains a valid pointer.",
      ],
      takeaway:
        "A C-string walk stops at the null character, while staying within the character array.",
      verify: 'std::cout << text << " " << (p - text);',
      expected: "hi 2",
    }),
    lesson({
      id: "5.6",
      title: "Grow an array without losing ownership",
      hook: "Can an existing allocation simply gain more adjacent elements?",
      steps: [
        [
          "int* a = new int[2]{4, 7};",
          "Start with capacity for two integers.",
          [
            v("old[0]", "4", "heap", 2000, "old"),
            v("old[1]", "7", "heap", 2004, "old"),
            p("a", "old[0]"),
          ],
        ],
        [
          "int* bigger = new int[4]{};",
          "Allocate a separate larger array. It does not extend the old allocation in place.",
          [
            v("new[0]", "0", "heap", 2100, "new"),
            v("new[1]", "0", "heap", 2104, "new"),
            v("new[2]", "0", "heap", 2108, "new"),
            v("new[3]", "0", "heap", 2112, "new"),
            p("bigger", "new[0]", "stack", 1056),
          ],
        ],
        [
          "for (int i = 0; i < 2; ++i) bigger[i] = a[i];",
          "Copy the two existing values before freeing their source.",
          [set("new[0]", "4"), set("new[1]", "7")],
        ],
        [
          "delete[] a; a = bigger; bigger = nullptr;",
          "Release the old allocation and transfer the owner’s address to the new allocation.",
          [free("old[0]"), point("a", "new[0]"), point("bigger", null)],
        ],
        [
          "int last = a[1]; delete[] a; a = nullptr;",
          "Copy the preserved value, then clean up the new allocation too.",
          [v("last", "7", "stack", 1080), free("new[0]"), point("a", null)],
        ],
      ],
      predict: [
        "Is the original second value preserved?",
        "Yes; last becomes 7.",
        "Copying occurred before releasing the source allocation.",
      ],
      trace: [
        "What is last?",
        "7",
        "The larger array initially preserved both old elements.",
      ],
      bug: [
        "Why must the source not be deleted before copying?",
        "Reading its elements afterward would use freed storage.",
        "Allocate, copy, then release the old allocation.",
      ],
      draw: [
        "Draw the state during copying.",
        "Two allocations are live, with a pointing to the old array and bigger to the new one.",
        "Temporarily using extra storage keeps the original data available.",
      ],
      takeaway:
        "Growing a dynamic array means allocating elsewhere, copying live elements, then releasing the old allocation.",
      verify: "std::cout << last;",
      expected: "7",
    }),
  ].sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true })),
};
