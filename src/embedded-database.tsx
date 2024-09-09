import {PGlite, Results} from "@electric-sql/pglite";
import {useEffect, useState} from "react";


// -> { rows: [ { message: "Hello world" } ] }

export function EmbeddedDatabase() {
  const [result, setResults] = useState<Results<unknown>>();

  useEffect(() => {
    async function helloWorld() {
      const db = new PGlite();
      const result = await db.query("select 'Ready!' as message;");
      setResults(result);
    }

    void helloWorld();
  }, []);

  return (
    <>
      <textarea name="Text1" cols={40} rows={5}/>
      <button>{result != null ? (result.rows[0] as any)?.message : "Loading..."}</button>
    </>
  );
}