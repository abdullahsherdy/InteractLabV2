// Static teaching content for the Recursion & Big-O tool. Kept as typed data so
// the copy lives in one place and the components stay pure rendering.

/** A "guess the Big-O" card in the visualiser panel. */
export interface AnnotateCard {
  code: string;
  bigo: string;
  /** colour class suffix: rec-o-<cls> */
  cls: "fast" | "linear" | "slow";
  why: string;
  example: string;
}

export const ANNOTATE_CARDS: AnnotateCard[] = [
  {
    code: "def f1(items):\n    return items[0]",
    bigo: "O(1)",
    cls: "fast",
    why: "No loop. It jumps straight to index 0. Same speed no matter how big the list is.",
    example: "n = 10:        1 step\nn = 1,000:     1 step\nn = 1,000,000: still 1 step",
  },
  {
    code: "def f2(items):\n    for x in items:\n        print(x)",
    bigo: "O(n)",
    cls: "linear",
    why: "One loop that runs once per item. Double the list → double the work.",
    example: "n = 10:    10 steps\nn = 100:   100 steps\nn = 1,000: 1,000 steps",
  },
  {
    code: "def f3(items):\n    for i in items:\n        for j in items:\n            ...",
    bigo: "O(n²)",
    cls: "slow",
    why: "A loop inside a loop. Each of n items triggers another n steps — n × n total.",
    example: "n = 10:    100 steps\nn = 100:   10,000 steps\nn = 1,000: 1,000,000 steps!",
  },
  {
    code: "def f4(d, key):\n    return d.get(key)",
    bigo: "O(1)",
    cls: "fast",
    why: "A dict is a hash table. Python jumps straight to the value — no loop needed.",
    example: "dict with 10 keys:        1 step\ndict with 1,000,000 keys: still 1 step",
  },
];

/** One step of the repeatable 6-step problem-solving method. */
export interface SixStep {
  num: string;
  title: string;
  short: string;
  body: string;
  example: string;
}

export const SIX_STEPS: SixStep[] = [
  {
    num: "01",
    title: "Understand",
    short: "Read the problem twice. Define input and output.",
    body: "Before writing a single character of code, make sure you fully understand what the problem wants. Write it in your own words.",
    example:
      "# Problem: \"find if a list has duplicate names\"\n# Input:  a list of strings → ['Adam','Sara','Adam']\n# Output: True or False\n# Rule:   True only if ANY name appears more than once",
  },
  {
    num: "02",
    title: "Examples",
    short: "Write 2–3 test cases by hand. Include edge cases.",
    body: "Edge cases are the inputs that might break your solution: empty list, single item, all duplicates. Write these BEFORE coding.",
    example:
      "# Normal:    ['Adam','Sara','Ali']   → False\n# Duplicate: ['Adam','Sara','Adam']  → True\n# Edge:      []                      → False\n# Edge:      ['Adam']                → False (1 item can't dup)",
  },
  {
    num: "03",
    title: "Brute Force",
    short: "Write the simple, slow solution first.",
    body: "Write the first solution that comes to mind, even if it is slow. A working O(n²) solution beats a broken O(n) one.",
    example:
      "def has_dup_slow(names):\n    for i in range(len(names)):\n        for j in range(i + 1, len(names)):\n            if names[i] == names[j]:\n                return True\n    return False\n# Big-O: O(n²) — loop inside a loop",
  },
  {
    num: "04",
    title: "Optimise",
    short: "Can you reduce the Big-O? What data structure helps?",
    body: "Ask: what is the bottleneck? Usually a loop doing repeated work. A dict or set lets you remember things in O(1).",
    example:
      "# Bottleneck: checking if a name was seen before\n# Dict lookup is O(1) → use a dict as memory\n# One loop O(n) + O(1) lookup = O(n) total",
  },
  {
    num: "05",
    title: "Code",
    short: "Now write the actual code.",
    body: "Only now do you write the final code. You already know it will work because you have examples to test it with.",
    example:
      "def has_dup_fast(names):\n    seen = {}\n    for name in names:      # O(n)\n        if name in seen:    # O(1)\n            return True\n        seen[name] = True\n    return False",
  },
  {
    num: "06",
    title: "Test",
    short: "Run your examples from Step 2. Try the edge cases.",
    body: "Run each test case from Step 2. If a test fails, go back to Step 3 — not Step 5.",
    example:
      "print(has_dup_fast(['Adam','Sara','Adam']))  # True  ✓\nprint(has_dup_fast(['Adam','Sara','Ali']))   # False ✓\nprint(has_dup_fast([]))                       # False ✓\nprint(has_dup_fast(['Adam']))                 # False ✓",
  },
];

/** A row of the complexity reference table. */
export interface ComplexityRow {
  notation: string;
  /** colour class suffix: rec-cx-<cls> */
  cls: "fast" | "ok" | "slow";
  name: string;
  example: string;
  badge: string;
}

export const COMPLEXITY_ROWS: ComplexityRow[] = [
  { notation: "O(1)", cls: "fast", name: "constant", example: "my_dict['key'] · lst[0]", badge: "fastest" },
  { notation: "O(log n)", cls: "fast", name: "logarithmic", example: "binary search", badge: "very fast" },
  { notation: "O(n)", cls: "ok", name: "linear", example: "one for loop", badge: "acceptable" },
  { notation: "O(n log n)", cls: "ok", name: "linearithmic", example: "merge sort", badge: "good for sorting" },
  { notation: "O(n²)", cls: "slow", name: "quadratic", example: "nested for loop", badge: "slow — avoid" },
];

/** Code snippets shown in the intro and method panels. */
export const CODE = {
  countdown: `# Step 1: write the BASE CASE first
def countdown(n):
    if n <= 0:            # <- BASE CASE: stop here
        print('Done!')
        return
    print(n)             # do something at this level
    countdown(n - 1)     # <- RECURSIVE CASE: smaller!`,

  factorial: `def factorial(n):
    if n == 0:                     # BASE CASE: 0! = 1
        return 1
    return n * factorial(n - 1)    # RECURSIVE CASE

# factorial(4):
# 4 x factorial(3)
#     3 x factorial(2)
#         2 x factorial(1)
#             1 x factorial(0) <- base case -> 1
# <- 1x1=1 <- 2x1=2 <- 3x2=6 <- 4x6=24  OK`,

  reverseSum: `# Reverse a string recursively
def reverse(text):
    if text == '':           # BASE CASE: empty string
        return ''
    return reverse(text[1:]) + text[0]

# Sum a list recursively
def list_sum(nums):
    if nums == []:           # BASE CASE: empty list
        return 0
    return nums[0] + list_sum(nums[1:])`,

  bruteVsFast: `# Step 3 - Brute Force O(n^2): two nested loops
def has_duplicate_slow(names):
    for i in range(len(names)):
        for j in range(i + 1, len(names)):
            if names[i] == names[j]:
                return True
    return False
# Big-O: O(n^2) - loop inside a loop

# Step 4 - Optimised O(n): use a dict as memory
def has_duplicate_fast(names):
    seen = {}
    for name in names:          # one loop = O(n)
        if name in seen:        # dict lookup = O(1)
            return True
        seen[name] = True
    return False
# Big-O: O(n) - one loop, O(1) lookup inside`,
} as const;
