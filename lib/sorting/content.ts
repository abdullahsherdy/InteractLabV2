// Static teaching content for the sorting tool: Python snippets (rendered by the
// shared CodeBlock highlighter) and the structured data behind the properties,
// comparison, and "why learn it" panels. Kept out of the components so wording
// can be tweaked without touching logic.

export const SLOW_CODE: Record<string, string> = {
  bubble: `def bubble_sort(nums):
    n = len(nums)
    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):
            if nums[j] > nums[j + 1]:
                nums[j], nums[j + 1] = nums[j + 1], nums[j]
                swapped = True
        if not swapped:      # a clean pass — already sorted
            break
    return nums`,
  selection: `def selection_sort(nums):
    n = len(nums)
    for i in range(n - 1):
        smallest = i
        for j in range(i + 1, n):
            if nums[j] < nums[smallest]:
                smallest = j
        nums[i], nums[smallest] = nums[smallest], nums[i]
    return nums`,
  insertion: `def insertion_sort(nums):
    for i in range(1, len(nums)):
        key = nums[i]
        j = i - 1
        while j >= 0 and nums[j] > key:
            nums[j + 1] = nums[j]    # shift right
            j -= 1
        nums[j + 1] = key
    return nums`,
};

export const FAST_CODE: Record<string, string> = {
  merge: `def merge_sort(nums):
    if len(nums) <= 1:
        return nums
    mid = len(nums) // 2
    left = merge_sort(nums[:mid])
    right = merge_sort(nums[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:      # <= keeps it stable
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
  quick: `def quick_sort(nums):
    if len(nums) <= 1:
        return nums
    pivot = nums[-1]                 # last value is the pivot
    left = [x for x in nums[:-1] if x <= pivot]
    right = [x for x in nums[:-1] if x > pivot]
    return quick_sort(left) + [pivot] + quick_sort(right)`,
};

export const BUILTIN_CODE = `# Python's built-in sort is Timsort — O(n log n), stable
nums.sort()               # sorts the list in place, returns None
ordered = sorted(nums)    # returns a NEW sorted list, leaves nums alone`;

export interface ExplainCard {
  title: string;
  body: string;
}

export const FAST_EXPLAIN: Record<"merge" | "quick", ExplainCard> = {
  merge: {
    title: "Merge sort — split all the way down, then merge back up",
    body: "Halve the list again and again until every piece is length 1 (already sorted). Then merge pairs back together in order. The merging does the real work — and it costs O(n log n) whether the input is sorted, reversed, or random.",
  },
  quick: {
    title: "Quick sort — partition around a pivot",
    body: "Pick a pivot, throw everything smaller to its left and everything bigger to its right, then sort each side the same way. Fast on average and sorts in place — but a bad pivot (like the last value on an already-sorted list) makes the partitions lopsided and drags it down to O(n²).",
  },
};

export interface PropConcept {
  term: string;
  def: string;
  why: string;
}

export const PROP_CONCEPTS: PropConcept[] = [
  {
    term: "Stable",
    def: "Equal values keep their original relative order.",
    why: "Lets you sort by one thing after another — sort by name, then by grade, and names stay in order inside each grade.",
  },
  {
    term: "In-place",
    def: "Sorts by rearranging the original list, using only O(1) extra memory.",
    why: "Matters on huge lists or small devices where making a second full copy of the data won't fit.",
  },
  {
    term: "Adaptive",
    def: "Runs faster when the input is already partly sorted.",
    why: "Real data is often nearly ordered. Insertion sort (and Timsort) finish in close to O(n) on it.",
  },
];

export interface PropRow {
  algo: string;
  best: string;
  average: string;
  worst: string;
  space: string;
  stable: boolean;
  inPlace: boolean;
  adaptive: boolean;
  detail: string;
}

export const PROP_ROWS: PropRow[] = [
  {
    algo: "Bubble",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    stable: true,
    inPlace: true,
    adaptive: true,
    detail: "The early-exit flag gives it a linear best case on already-sorted data, but it does the most swaps of any O(n²) sort. Mostly a teaching tool.",
  },
  {
    algo: "Selection",
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    stable: false,
    inPlace: true,
    adaptive: false,
    detail: "Always scans the whole unsorted region, so it never speeds up — but it makes at most n-1 swaps, useful when writes are expensive.",
  },
  {
    algo: "Insertion",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    stable: true,
    inPlace: true,
    adaptive: true,
    detail: "The best of the simple sorts: stable, adaptive, and genuinely fast on small or nearly-sorted lists. Timsort uses it for short runs.",
  },
  {
    algo: "Merge",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    space: "O(n)",
    stable: true,
    inPlace: false,
    adaptive: false,
    detail: "Rock-steady O(n log n) no matter the input, and stable — the price is O(n) extra memory for the merges.",
  },
  {
    algo: "Quick",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n²)",
    space: "O(log n)",
    stable: false,
    inPlace: true,
    adaptive: false,
    detail: "Usually the fastest in practice and sorts in place, but a poor pivot choice can trigger the O(n²) worst case. Real implementations pick the pivot cleverly.",
  },
];

export interface WhyCard {
  title: string;
  body: string;
}

export const WHY_LEARN: WhyCard[] = [
  {
    title: "They teach the core pattern",
    body: "Compare, swap, repeat. Every sort — even the clever ones — is built on the loop-and-compare idea you first meet here.",
  },
  {
    title: "They win on tiny inputs",
    body: "For ~10 items or fewer, their simplicity beats the overhead of recursion. Timsort itself drops to insertion sort on short runs.",
  },
  {
    title: "Insertion sort is adaptive",
    body: "On nearly-sorted data it runs in close to O(n) — sometimes faster than an O(n log n) sort with more overhead.",
  },
  {
    title: "They're easy to prove correct",
    body: "No recursion, no tricky merge edge cases. You can trace the whole thing by hand and be sure it works.",
  },
  {
    title: "They build Big-O intuition",
    body: "You can literally watch the nested loops run n × n times. Nothing makes O(n²) concrete like seeing it.",
  },
  {
    title: "Interviews still ask",
    body: "Coding and reasoning about the simple sorts — and knowing when each is the right pick — is a common interview warm-up.",
  },
];

export interface DecisionRow {
  when: string;
  use: string;
}

export const DECISIONS: DecisionRow[] = [
  { when: "Small list (≤ ~10) or nearly sorted already", use: "Insertion sort — simple and adaptive." },
  { when: "You need a guaranteed O(n log n), even worst case", use: "Merge sort — steady on any input." },
  { when: "You want speed on average and memory is tight", use: "Quick sort — fast in practice, sorts in place." },
  { when: "Stability matters (sorting by more than one key)", use: "Merge sort or Python's Timsort — both stable." },
  { when: "You just need it sorted, correctly, right now", use: "Built-in sorted() / .sort() — Timsort, stable, O(n log n)." },
  { when: "Teaching or debugging the idea by hand", use: "Bubble or selection sort — easiest to trace." },
];
