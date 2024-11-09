import { NoteController } from "./controllers/NoteController.ts";
import { NoteRepository } from "./models/NoteRepo.ts";

if (import.meta.main) {
  const DB_PATH =
    "/Users/caligula/Library/Group Containers/group.com.apple.notes/NoteStore.sqlite";

  const repository = new NoteRepository(DB_PATH);
  const controller = new NoteController(repository);

  const args = Deno.args;
  const [command, param] = args;

  let exitCode: number;

  switch (command) {
    case "get": {
      const id = parseInt(param ?? "", 10);
      if (isNaN(id)) {
        console.error("Invalid note ID");
        exitCode = 1;
      } else {
        exitCode = controller.getById(id);
      }
      break;
    }

    case "search":
    default:
      exitCode = controller.search(param);
      break;
  }

  Deno.exit(exitCode);
}
