export const createQueryString = (searchParams: URLSearchParams, name: string, value: string) => {
  const params = new URLSearchParams(searchParams);
  params.set(name, value);

  return params.toString();
}
