/* istanbul ignore file */
import {
  RestEvent,
  RestNews,
  RestPage,
  RestTeam,
  RestUser,
} from '@asap-hub/squidex';
import { Migration } from '@asap-hub/server-common';
import { applyToAllItemsInCollection } from '../utils/migrations';

export default class EnforceUrlFormat extends Migration {
  isPatchingEnabled = false;

  processEvents = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestEvent>(
      'events',
      async (event, squidexClient) => {
        if (
          event.data.meetingLink?.iv &&
          !event.data.meetingLink.iv.startsWith('http')
        ) {
          // eslint-disable-next-line no-console
          console.log(
            `Event ${event.id} does not have a valid meeting link. Adding https:// prefix.`,
          );
          if (this.isPatchingEnabled) {
            await squidexClient.patch(event.id, {
              meetingLink: {
                iv: `https://${event.data.meetingLink.iv}`,
              },
            });
          } else {
            // eslint-disable-next-line no-console
            console.log(
              `Before: ${event.data.meetingLink.iv}\nAfter: https://${event.data.meetingLink.iv}`,
            );
          }
        }
      },
    );
  };

  processPages = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestPage>(
      'pages',
      async (page, squidexClient) => {
        if (page.data.link?.iv && !page.data.link.iv.startsWith('http')) {
          // eslint-disable-next-line no-console
          console.log(
            `Page ${page.id} does not have a valid link. Adding https:// prefix.`,
          );
          if (this.isPatchingEnabled) {
            await squidexClient.patch(page.id, {
              link: {
                iv: `https://${page.data.link.iv}`,
              },
            });
          } else {
            // eslint-disable-next-line no-console
            console.log(
              `Before: ${page.data.link.iv}\nAfter: https://${page.data.link.iv}`,
            );
          }
        }
      },
    );
  };

  processNewsAndEvents = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestNews>(
      'news-and-events',
      async (news, squidexClient) => {
        if (news.data.link?.iv && !news.data.link.iv.startsWith('http')) {
          // eslint-disable-next-line no-console
          console.log(
            `News ${news.id} does not have a valid link. Adding https:// prefix.`,
          );
          if (this.isPatchingEnabled) {
            await squidexClient.patch(news.id, {
              link: {
                iv: `https://${news.data.link.iv}`,
              },
            });
          } else {
            // eslint-disable-next-line no-console
            console.log(
              `Before: ${news.data.link.iv}\nAfter: https://${news.data.link.iv}`,
            );
          }
        }
      },
    );
  };

  processTeams = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestTeam>(
      'teams',
      async (team, squidexClient) => {
        if (team.data.tools?.iv) {
          let shouldUpdate = false;

          const tools = team.data.tools.iv.map((tool) => {
            if (tool.url && !tool.url.startsWith('http')) {
              shouldUpdate = true;
              return {
                ...tool,
                url: `https://${tool.url}`,
              };
            }
            return tool;
          });

          if (shouldUpdate) {
            // eslint-disable-next-line no-console
            console.log(
              `Team ${team.id} does not have a valid tool link(s). Adding https:// prefix.`,
            );
            if (this.isPatchingEnabled) {
              await squidexClient.patch(team.id, {
                tools: {
                  iv: tools,
                },
              });
            } else {
              // eslint-disable-next-line no-console
              console.log(
                `Before: ${JSON.stringify(
                  team.data.tools.iv,
                  null,
                  2,
                )}\nAfter: ${JSON.stringify(tools, null, 2)}`,
              );
            }
          }
        }
      },
    );
  };

  processUsers = async (): Promise<void> => {
    await applyToAllItemsInCollection<RestUser>(
      'users',
      async (user, squidexClient) => {
        if (user.data.social?.iv) {
          let shouldUpdate = false;

          const social = user.data.social.iv.map((socialValue) => {
            let newSocial = socialValue;

            if (
              socialValue.website1 &&
              !socialValue.website1.startsWith('http')
            ) {
              shouldUpdate = true;
              newSocial = {
                ...newSocial,
                website1: `https://${socialValue.website1}`,
              };
            }

            if (
              socialValue.website2 &&
              !socialValue.website2.startsWith('http')
            ) {
              shouldUpdate = true;
              newSocial = {
                ...newSocial,
                website2: `https://${socialValue.website2}`,
              };
            }

            return newSocial;
          });

          if (shouldUpdate) {
            // eslint-disable-next-line no-console
            console.log(
              `User ${user.id} does not have a valid social website(s). Adding https:// prefix.`,
            );
            if (this.isPatchingEnabled) {
              await squidexClient.patch(user.id, {
                social: {
                  iv: social,
                },
              });
            } else {
              // eslint-disable-next-line no-console
              console.log(
                `Before: ${JSON.stringify(
                  user.data.social.iv,
                  null,
                  2,
                )}\nAfter: ${JSON.stringify(social, null, 2)}`,
              );
            }
          }
        }
      },
    );
  };

  up = async (): Promise<void> => {
    await this.processEvents();
    await this.processPages();
    await this.processNewsAndEvents();
    await this.processTeams();
    await this.processUsers();
  };
  down = async (): Promise<void> => {
    // No down migration
    // eslint-disable-next-line no-console
    console.log('No down migration for this migration.');
  };
}
