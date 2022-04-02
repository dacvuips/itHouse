import passwordHash from "password-hash";

export default test("HashPassword", async () => {
  console.log();
  return passwordHash.isHashed(
    "sha1$e21c5f30$1$44c937bec40e8eb3bd56370073a71815cb133cdf"
  );
});
