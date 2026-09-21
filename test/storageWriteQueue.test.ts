import { test } from "node:test";
import assert from "node:assert/strict";
import { createWriteQueue } from "../src/utils/storageWriteQueue";

function flushMicrotasks(): Promise<void> {
  return new Promise((resolve) => setImmediate(resolve));
}

test("createWriteQueue writes snapshots in call order", async () => {
  const pending: Array<{
    value: string;
    resolve: () => void;
  }> = [];
  const queue = createWriteQueue(
    (value) =>
      new Promise<void>((resolve) => {
        pending.push({ value, resolve });
      })
  );

  queue("first");
  queue("second");
  await flushMicrotasks();

  assert.deepEqual(pending.map(({ value }) => value), ["first"]);
  pending[0].resolve();
  await flushMicrotasks();
  assert.deepEqual(pending.map(({ value }) => value), ["first", "second"]);

  pending[1].resolve();
  await flushMicrotasks();
});

test("createWriteQueue continues after a failed write", async () => {
  const attempts: string[] = [];
  let rejectFirst!: (error: Error) => void;
  const queue = createWriteQueue((value) => {
    attempts.push(value);
    if (value === "bad") {
      return new Promise<void>((_resolve, reject) => {
        rejectFirst = reject;
      });
    }
    return Promise.resolve();
  });

  queue("bad");
  queue("good");
  await flushMicrotasks();
  assert.deepEqual(attempts, ["bad"]);

  rejectFirst(new Error("storage unavailable"));
  await flushMicrotasks();
  assert.deepEqual(attempts, ["bad", "good"]);
});
