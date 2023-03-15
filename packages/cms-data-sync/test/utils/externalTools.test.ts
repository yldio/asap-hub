import { Environment } from 'contentful-management';
import {
  createExternalTool,
  createExternalToolLinks,
} from '../../src/utils/externalTools';
import { getEntry } from '../fixtures';
import { getContentfulEnvironmentMock } from '../mocks/contentful.mocks';

const tool = {
  name: 'Google link',
  url: 'http://www.google.com',
  description: 'Useful link',
};

describe('createExternalTool', () => {
  let envMock: Environment;

  beforeEach(async () => {
    jest.clearAllMocks();

    envMock = getContentfulEnvironmentMock();
  });

  it('creates tool with correct payload and publishes it', async () => {
    const toolMock = getEntry(tool);
    jest.spyOn(envMock, 'createEntry').mockResolvedValueOnce(toolMock);
    jest.spyOn(toolMock, 'publish').mockResolvedValueOnce(toolMock);

    await createExternalTool(envMock, [tool]);

    expect(envMock.createEntry).toBeCalledWith('externalTools', {
      fields: {
        name: { 'en-US': tool.name },
        description: { 'en-US': tool.description },
        url: { 'en-US': tool.url },
      },
    });

    expect(toolMock.publish).toBeCalled();
  });
});

describe('createExternalToolLinks', () => {
  let envMock: Environment;

  beforeEach(async () => {
    jest.clearAllMocks();

    envMock = getContentfulEnvironmentMock();
  });

  it('returns external tool link data', async () => {
    const id = 'external-tool-1';
    const toolMock = getEntry(tool);
    toolMock.sys.id = id;
    jest.spyOn(envMock, 'createEntry').mockResolvedValueOnce(toolMock);
    jest.spyOn(toolMock, 'publish').mockResolvedValueOnce(toolMock);

    const toolLinks = await createExternalToolLinks(envMock, [tool]);

    expect(toolLinks).toEqual([
      { sys: { id, linkType: 'Entry', type: 'Link' } },
    ]);
  });
});
