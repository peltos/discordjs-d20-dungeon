import dotenv from "dotenv";
dotenv.config();

import { Message } from "discord.js";
import Store from "../../store/Store";
import ConsoleTimeComponent from "../Console/ConsoleTimeComponent";
import {
  ANSI_RESET,
  ANSI_FG_RED,
  ANSI_FG_GREEN,
  ANSI_FG_MAGENTA,
} from "../../resources/ANSIEscapeCode";
import SetupNextMessage from "../SetupNextMessage";

export default class ResponseBotComponent {
  private time = parseInt((process.env.TIME as unknown) as string);

  constructor(message: Message) {
    Store.Stories.map((story) => {
      if (story.channel === message.channel) {
        story.plotPoints.map((pp) => {
          if (pp.plotPointId === story.currentPlotPointId)
          setTimeout(() => {
            message.channel.fetchMessage(message.id).then((msg) => {
              new SetupNextMessage(msg, story, pp); // figure out what the next story is gonna be.

              if(story.storyEnded) {
                  setTimeout(() => { // end of the story
                    story.channel.send(
                      `\n---------------------------------------------------------------------\nThe story has ended. Restart the story to see other endings\n---------------------------------------------------------------------`
                    );
                  }, 5000)
                  new ConsoleTimeComponent(
                    `Story `,
                    ANSI_FG_GREEN,
                    `${story.storyId.toUpperCase()} `,
                    ANSI_RESET,
                    "has ",
                    ANSI_FG_RED,
                    `ended `.toUpperCase(),
                    ANSI_RESET,
                    "on channel ",
                    ANSI_FG_MAGENTA,
                    `${message.channel.id} `,
                    ANSI_RESET
                  );

                  let counter = 0;
                  Store.Stories.map((story) => {
                    if(story.channel === message.channel) {
                      Store.Stories.splice(counter, 1);
                    }
                    counter++;
                  })
                  console.log(Store);
                  
              }
            });
            
          }, this.time); // MiliSeconds
        });
      }
    });
  }
}
