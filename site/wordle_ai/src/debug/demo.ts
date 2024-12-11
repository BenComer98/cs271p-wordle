const isDemo = true;

export default function demo(item: any) {
  if (isDemo) {
    console.log(item);
    return true;
  }

  return false;
}