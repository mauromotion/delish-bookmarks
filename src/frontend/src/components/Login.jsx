export default function Login() {
  return (
    <>
      <form action="submit">
        <input type="text" name="username" placeholder="Enter username" />
        <input type="password" name="password" placeholder="Enter password" />
        <button type="submit">Login</button>
      </form>
    </>
  );
}
