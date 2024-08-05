import { getUser } from "./getUser";

export async function isUserLoggedIn() {
  const user = await getUser();
  if (!user) {
    location.href = "../login/login.html";
  }
}
