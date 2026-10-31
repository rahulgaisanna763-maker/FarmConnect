// Basic domain tests: node tests/stock.test.js
const assert = require("node:assert/strict");
function reserve(stock, requested) {
  if (!Number.isInteger(requested) || requested <= 0) throw new Error("invalid quantity");
  if (requested > stock) throw new Error("insufficient stock");
  return stock - requested;
}
function cancel(stockAfterReserve, reservedQty) { return stockAfterReserve + reservedQty; }
assert.equal(reserve(10, 4), 6);
assert.throws(() => reserve(3, 4), /insufficient stock/);
assert.throws(() => reserve(5, 0), /invalid quantity/);
assert.equal(cancel(reserve(10, 4), 4), 10);
console.log("✓ stock limit and cancellation tests passed");