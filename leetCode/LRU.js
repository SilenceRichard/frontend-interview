// 1. put Node(1,1)
// Head <-> Node(1,1) <-> Tail
// 2. put Node(2,2)
// Head <-> Node(2,2) <-> Node(1,1) <-> Tail
// 3. put Node(3,3)
// Head <-> Node(3,3) <-> Node(2,2) <-> Tail


class LRUNode {
  key;
  value;
  prev;
  next;
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

/**
 * @param {number} capacity
 */
var LRUCache = function (capacity) {
  this.map = new Map();
  this.length = capacity;
  this.head = new LRUNode('head', null);
  this.tail = new LRUNode('tail', null);
  this.head.next = this.tail;
  this.tail.prev = this.head;
};

/** 
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function (key) {
  if (!this.map.has(key)) {
    return -1;
  }
  const node = this.map.get(key);
  
  // Remove node from current position
  const prev = node.prev;
  const next = node.next;
  prev.next = next;
  next.prev = prev;
  
  // Move node to head (most recently used position)
  const head_next = this.head.next;
  this.head.next = node;
  node.prev = this.head;
  node.next = head_next;
  head_next.prev = node;
  
  return node.value;
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function (key, value) {
  const insertToHead = () => {
    const head_next = this.head.next;
    const new_node = new LRUNode(key, value);
    this.map.set(key, new_node);
    this.head.next = new_node;
    new_node.prev = this.head;
    new_node.next = head_next;
    head_next.prev = new_node;
  }
  
  const deleteTail = () => {
    const old_tail_node = this.tail.prev;
    const new_tail_node = old_tail_node.prev;
    this.map.delete(old_tail_node.key);
    old_tail_node.next = null;
    old_tail_node.prev = null;
    new_tail_node.next = this.tail;
    this.tail.prev = new_tail_node;
  }
  
  // If key already exists, remove the old node
  if (this.map.has(key)) {
    const node = this.map.get(key);
    // Remove node from current position
    const prev = node.prev;
    const next = node.next;
    prev.next = next;
    next.prev = prev;
    this.map.delete(key);
  } else if (this.map.size >= this.length) {
    // If at capacity, remove least recently used node
    deleteTail();
  }
  
  // Add new node to the head
  insertToHead();
};

/** 
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */

// Test cases
const lru = new LRUCache(2);

console.log("Put 1,1");
lru.put(1, 1);
console.log("Cache after put(1,1):", printCache(lru));

console.log("Get 1, result:", lru.get(1));
console.log("Cache after get(1):", printCache(lru));

console.log("Put 2,2");
lru.put(2, 2);
console.log("Cache after put(2,2):", printCache(lru));

console.log("Get 1, result:", lru.get(1));
console.log("Cache after get(1):", printCache(lru));

console.log("Put 3,3");
lru.put(3, 3); // This should remove key 2
console.log("Cache after put(3,3):", printCache(lru));

console.log("Get 2, result:", lru.get(2)); // Should return -1 (not found)
console.log("Cache after get(2):", printCache(lru));

console.log("Put 4,4");
lru.put(4, 4); // This should remove key 1
console.log("Cache after put(4,4):", printCache(lru));

console.log("Get 1, result:", lru.get(1)); // Should return -1 (not found)
console.log("Get 3, result:", lru.get(3)); // Should return 3
console.log("Get 4, result:", lru.get(4)); // Should return 4

// Helper function to visualize the cache content
function printCache(lruCache) {
  let current = lruCache.head;
  const nodes = [];
  
  while (current) {
    nodes.push(`${current.key}:${current.value}`);
    current = current.next;
  }
  
  return nodes.join(" <-> ");
}