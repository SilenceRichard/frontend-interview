const binarySearch = (nums, target) => {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] > target) {
      right = mid - 1;
    } else if (nums[mid] < target) {
      left = mid + 1;
    }
  }
  return -1;
}

console.log(binarySearch([1, 2, 3, 3, 4, 6, 8, 9], 4));

// 变式： 返回左边界
// target存在时，返回target的左边界
// target不存在时，返回第一个比target大的索引
const leftBound = (nums, target) => {
  // [1,2,3,4,6,7] target = 4 return 2
  // target = 5, 
  let left = 0, right = nums.length;
  while (left < right) { // [left, right)
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] === target) {
      right = mid - 1;
    } else if (nums[mid] > target) {
      right = mid - 1;
    } else if (nums[mid] < target) {
      left = mid + 1;
    }
  }
  return left;
}

console.log(leftBound([1, 2, 3, 3, 4, 6, 8, 9], 5));