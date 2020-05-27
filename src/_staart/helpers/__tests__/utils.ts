import { deleteSensitiveInfoUser } from "../utils";

test("Remove sensitive info", () => {
  expect(
    deleteSensitiveInfoUser({
      id: 1,
      name: "Anand Chowdhary",
      password: "1abc9c",
    }).password
  ).toBeUndefined();
});
