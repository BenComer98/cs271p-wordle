export const isDebug = true;

export default function debug(item: any): boolean {
  if (isDebug) {
    console.log(item);
    return true;
  }
  
  return false;
}