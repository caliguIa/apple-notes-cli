import { JsonView } from "./JsonView.ts";
import { PrettyView } from "./PrettyView.ts";

export type ViewType = "pretty" | "json";

export class ViewFactory {
  public static createView(type: ViewType) {
    switch (type) {
      case "json":
        return new JsonView();
      case "pretty":
      default:
        return new PrettyView();
    }
  }
}
