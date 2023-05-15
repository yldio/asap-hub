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

export default class RemoveUrlWhitespaces extends Migration {
  private isPatchingEnabled = false;

  processEvents = async (): Promise<void> => {
    // eslint-disable-next-line no-console
    console.log('Processing events...');
    await applyToAllItemsInCollection<RestEvent>(
      'events',
      async (event, squidexClient) => {
        const cleanedUrl = (event.data.meetingLink?.iv || '').trim();
        if (cleanedUrl && cleanedUrl !== event.data.meetingLink?.iv) {
          // eslint-disable-next-line no-console
          console.log(
            `Event ${event.id} contains whitespaces. '${event.data.meetingLink?.iv}' -> '${cleanedUrl}'`,
          );

          if (this.isPatchingEnabled) {
            // eslint-disable-next-line no-console
            console.log('Patching enabled. Updating event...');
            await squidexClient.patch(event.id, {
              meetingLink: {
                iv: cleanedUrl,
              },
            });
          } else {
            // eslint-disable-next-line no-console
            console.log('Patching is disabled. Skipping...');
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
        const cleanedUrl = (page.data.link?.iv || '').trim();
        if (cleanedUrl && cleanedUrl !== page.data.link?.iv) {
          // eslint-disable-next-line no-console
          console.log(
            `Page ${page.id} does not have a valid link. '${page.data.link?.iv}' -> '${cleanedUrl}'`,
          );
          if (this.isPatchingEnabled) {
            // eslint-disable-next-line no-console
            console.log('Patching enabled. Updating page...');
            await squidexClient.patch(page.id, {
              link: {
                iv: cleanedUrl,
              },
            });
          } else {
            // eslint-disable-next-line no-console
            console.log('Patching is disabled. Skipping...');
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
        const cleanedUrl = (news.data.link?.iv || '').trim();
        if (cleanedUrl && cleanedUrl !== news.data.link?.iv) {
          // eslint-disable-next-line no-console
          console.log(
            `News ${news.id} does not have a valid link. '${news.data.link?.iv}' -> '${cleanedUrl}'`,
          );
          if (this.isPatchingEnabled) {
            // eslint-disable-next-line no-console
            console.log('Patching enabled. Updating news...');
            await squidexClient.patch(news.id, {
              link: {
                iv: cleanedUrl,
              },
            });
          } else {
            // eslint-disable-next-line no-console
            console.log('Patching is disabled. Skipping...');
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
            const cleanedUrl = (tool.url || '').trim();
            if (cleanedUrl && cleanedUrl !== tool.url) {
              // eslint-disable-next-line no-console
              console.log(
                `Team ${team.id} tool url contains whitespaces. '${tool.url}' -> '${cleanedUrl}'`,
              );
              shouldUpdate = true;
              return {
                ...tool,
                url: cleanedUrl,
              };
            }
            return tool;
          });

          if (shouldUpdate && this.isPatchingEnabled) {
            // eslint-disable-next-line no-console
            console.log('Patching enabled. Updating team...');
            await squidexClient.patch(team.id, {
              tools: {
                iv: tools,
              },
            });
          } else {
            // eslint-disable-next-line no-console
            console.log('Patching is disabled. Skipping...');
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

            let cleanedUrl = (socialValue.website1 || '').trim();
            if (cleanedUrl && cleanedUrl !== socialValue.website1) {
              // eslint-disable-next-line no-console
              console.log(
                `User ${user.id} website1 contains whitespaces. '${socialValue.website1}' -> '${cleanedUrl}'`,
              );
              shouldUpdate = true;
              newSocial = {
                ...newSocial,
                website1: cleanedUrl,
              };
            }

            cleanedUrl = (socialValue.website2 || '').trim();
            if (cleanedUrl && cleanedUrl !== socialValue.website2) {
              // eslint-disable-next-line no-console
              console.log(
                `User ${user.id} website2 contains whitespaces. '${socialValue.website2}' -> '${cleanedUrl}'`,
              );
              shouldUpdate = true;
              newSocial = {
                ...newSocial,
                website2: cleanedUrl,
              };
            }

            return newSocial;
          });

          if (shouldUpdate && this.isPatchingEnabled) {
            // eslint-disable-next-line no-console
            console.log('Patching enabled. Updating user...');
            await squidexClient.patch(user.id, {
              social: {
                iv: social,
              },
            });
          } else {
            // eslint-disable-next-line no-console
            console.log('Patching is disabled. Skipping...');
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
