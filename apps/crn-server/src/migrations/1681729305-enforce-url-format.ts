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

  cleanupUrl = (url?: string) => {
    if (!url) {
      return null;
    }
    // trim whitespaces and lowercase the http(s) protocol.
    // Do not lowercase the rest of the url as it might contain query parameters that are case-sensitive (e.g. password of a zoom meeting).
    url = url
      .trim()
      .replace('HTTP://', 'http://')
      .replace('HTTPS://', 'https://');
    if (url.length === 0) {
      return null;
    }
    return url;
  };

  processEvents = async (): Promise<void> => {
    // eslint-disable-next-line no-console
    console.log('Processing events...');
    await applyToAllItemsInCollection<RestEvent>(
      'events',
      async (event, squidexClient) => {
        const cleanedUrl = this.cleanupUrl(event.data.meetingLink?.iv);
        if (cleanedUrl && !cleanedUrl.startsWith('http')) {
          // eslint-disable-next-line no-console
          console.log(
            `Event ${event.id} does not have a valid meeting link. Adding https:// prefix.`,
          );
          if (this.isPatchingEnabled) {
            await squidexClient.patch(event.id, {
              meetingLink: {
                iv: `https://${cleanedUrl}`,
              },
            });
          } else {
            // eslint-disable-next-line no-console
            console.log(
              `Before: ${event.data.meetingLink?.iv}\nAfter: https://${cleanedUrl}`,
            );
          }
        }
      },
    );
  };

  processPages = async (): Promise<void> => {
    // eslint-disable-next-line no-console
    console.log('Processing pages...');
    await applyToAllItemsInCollection<RestPage>(
      'pages',
      async (page, squidexClient) => {
        const cleanedUrl = this.cleanupUrl(page.data.link?.iv);
        if (cleanedUrl && !cleanedUrl.startsWith('http')) {
          // eslint-disable-next-line no-console
          console.log(
            `Page ${page.id} does not have a valid link. Adding https:// prefix.`,
          );
          if (this.isPatchingEnabled) {
            await squidexClient.patch(page.id, {
              link: {
                iv: `https://${cleanedUrl}`,
              },
            });
          } else {
            // eslint-disable-next-line no-console
            console.log(
              `Before: ${page.data.link?.iv}\nAfter: https://${cleanedUrl}`,
            );
          }
        }
      },
    );
  };

  processNewsAndEvents = async (): Promise<void> => {
    // eslint-disable-next-line no-console
    console.log('Processing news and events...');
    await applyToAllItemsInCollection<RestNews>(
      'news-and-events',
      async (news, squidexClient) => {
        const cleanedUrl = this.cleanupUrl(news.data.link?.iv);
        if (cleanedUrl && !cleanedUrl.startsWith('http')) {
          // eslint-disable-next-line no-console
          console.log(
            `News ${news.id} does not have a valid link. Adding https:// prefix.`,
          );
          if (this.isPatchingEnabled) {
            await squidexClient.patch(news.id, {
              link: {
                iv: `https://${cleanedUrl}`,
              },
            });
          } else {
            // eslint-disable-next-line no-console
            console.log(
              `Before: ${news.data.link?.iv}\nAfter: https://${cleanedUrl}`,
            );
          }
        }
      },
    );
  };

  processTeams = async (): Promise<void> => {
    // eslint-disable-next-line no-console
    console.log('Processing teams...');
    await applyToAllItemsInCollection<RestTeam>(
      'teams',
      async (team, squidexClient) => {
        if (team.data.tools?.iv) {
          let shouldUpdate = false;

          const tools = team.data.tools.iv.map((tool) => {
            const cleanedUrl = this.cleanupUrl(tool.url);
            if (cleanedUrl && !cleanedUrl.startsWith('http')) {
              shouldUpdate = true;
              return {
                ...tool,
                url: `https://${cleanedUrl}`,
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
    // eslint-disable-next-line no-console
    console.log('Processing users...');
    await applyToAllItemsInCollection<RestUser>(
      'users',
      async (user, squidexClient) => {
        if (user.data.social?.iv) {
          let shouldUpdate = false;

          const social = user.data.social.iv.map((socialValue) => {
            let newSocial = socialValue;

            let cleanedUrl = this.cleanupUrl(socialValue.website1);
            if (cleanedUrl && !cleanedUrl.startsWith('http')) {
              shouldUpdate = true;
              newSocial = {
                ...newSocial,
                website1: `https://${cleanedUrl}`,
              };
            }

            cleanedUrl = this.cleanupUrl(socialValue.website2);
            if (cleanedUrl && !cleanedUrl.startsWith('http')) {
              shouldUpdate = true;
              newSocial = {
                ...newSocial,
                website2: `https://${cleanedUrl}`,
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
