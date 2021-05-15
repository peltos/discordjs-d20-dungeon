import dotenv from "dotenv";
dotenv.config();

import { Message } from "discord.js";
import StartCommand from "../commands/StartCommand";
import RemoveCommand from "../commands/RemoveCommand";
import ReloadCommand from "../commands/ReloadCommand";
import PauseCommand from "../commands/PauseCommand";
import ConsoleTimeComponent from "./ConsoleTimeComponent";
import { ANSI_RESET, ANSI_FG_RED } from "../resources/ANSIEscapeCode";
import SendMessageWarningComponent from "./SendMessage/SendMessageWarningComponent";
import StatsCommand from "../commands/StatsCommand";

export default class ResponseUserComponent {
  private prefixChar = process.env.PREFIX_CHAR as unknown as string;
  private prefixWord = (
    process.env.PREFIX_WORD as unknown as string
  ).toLowerCase();

  constructor(message: Message) {
    const args = this.initMessage(message);
    if (args.length === 0) return; // nothing happens if the command is wrong

    const command = args.shift()?.toLowerCase();

    // Commands
    switch (command) {
      case "start":
      case "s":
        new StartCommand(message, args);
        break;
      case "remove":
      case "rem":
        new RemoveCommand(message.channel, true, args);
        break;
      case "reload":
      case "rel":
        new ReloadCommand(message.channel);
        break;
      case "pause":
      case "p":
        new PauseCommand(message.channel);
        break;
      case "stats":
        new StatsCommand(message.channel);
        break;
      default:
        new SendMessageWarningComponent(
          message.channel,
          ...new ConsoleTimeComponent(
            ANSI_FG_RED,
            "Command ",
            ANSI_RESET,
            `${command?.toUpperCase() as string} `,
            ANSI_FG_RED,
            "not found",
            ANSI_RESET
          ).messages
        );
    }
  }

  private initMessage(message: Message): string[] {
    if (!message.content.startsWith(this.prefixChar)) return [];
    const args = message.content.slice(this.prefixChar.length).split(" ");
    if (args.shift() !== this.prefixWord) return [];
    return args;
  }
}