const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL;
console.log(REACT_APP_SERVER_URL);
if (!REACT_APP_SERVER_URL) {
  throw new Error("Api not present");
}
export { REACT_APP_SERVER_URL };
