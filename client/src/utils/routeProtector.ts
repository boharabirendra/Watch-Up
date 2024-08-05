import { getUser } from "./getUser";

export async function isUserValid() {
  const user = await getUser();
  if (!user) {
    location.href = "../login/login.html";
  }
}
