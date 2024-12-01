export default async function getRandomWord(): Promise<string> {
  const response = await fetch("http://127.0.0.1:5000/randomWord");
  const data = await response.json();
  console.log(data);
  return data.random_word.toUpperCase();
}