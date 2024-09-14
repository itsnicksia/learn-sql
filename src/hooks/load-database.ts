import { PGlite } from "@electric-sql/pglite";
import { Dispatch, SetStateAction } from "react";

export default async function loadDb(setDb: Dispatch<SetStateAction<PGlite | null>>) {
  const db = new PGlite();
  await db.waitReady;
  setDb(db);
  console.log("Database loaded!");
}
