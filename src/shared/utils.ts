let _uid: number = 0;
export function uid(): string {
  return (_uid++).toString();
}