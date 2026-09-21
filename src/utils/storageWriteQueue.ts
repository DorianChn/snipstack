/** Serialize fire-and-forget writes so an older async operation cannot finish last. */
export function createWriteQueue(write: (value: string) => Promise<void>): (value: string) => void {
  let pending = Promise.resolve();

  return (value) => {
    pending = pending
      .then(() => write(value))
      // A failed write must not prevent later snapshots from being attempted.
      .catch(() => {});
  };
}
